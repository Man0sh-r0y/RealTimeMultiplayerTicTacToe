// const { createServer } = require("http");
// const { Server } = require("socket.io");
const dotenv = require('dotenv');
const path = require('path');
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
app.use(express.json()); // to accept json data

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`)
});

app.use(cookieParser());
app.use(
  cors({
      origin: "*",
      credentials: true,
  })
)

// const httpServer = createServer();

// const io = new Server(httpServer, {
//   cors: "*",
// });

// ---Deployment Code start----
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "../dist", "index.html"))
  );
} 
else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// ---Deployment Code end----

const allUsers = {};
const allRooms = [];

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  allUsers[socket.id] = {
    socket: socket,
    online: true,
  };

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;

    let opponentPlayer;

    for (const key in allUsers) {
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;
        break;
      }
    }

    if (opponentPlayer) {
      allRooms.push({
        player1: opponentPlayer,
        player2: currentUser,
      });

      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "circle",
      });

      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "cross",
      });

      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });
    } else {
      currentUser.socket.emit("OpponentNotFound");
    }
  });

  socket.on("disconnect", function () {
    const currentUser = allUsers[socket.id];
    currentUser.online = false;
    currentUser.playing = false;

    for (let index = 0; index < allRooms.length; index++) {
      const { player1, player2 } = allRooms[index];

      if (player1.socket.id === socket.id) {
        player2.socket.emit("opponentLeftMatch");
        break;
      }

      if (player2.socket.id === socket.id) {
        player1.socket.emit("opponentLeftMatch");
        break;
      }
    }
  });
});

// httpServer.listen(process.env.PORT);