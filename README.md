# Real Time Two Player TicTacToe Game 🎮

This project is a real-time Two Player **Tic-Tac-Toe** game built with  **React.js, Socket.io, and Express.js** . Follow the steps below to run the game on your local machine.

Live Link: [Go to Play](https://realtimemultiplayertictactoe.onrender.com/)

## **🛠️ Steps to Run Locally**

### **1️⃣ Clone the Repository**

```
git clone git@github.com:Man0sh-r0y/RealTimeMultiplayerTicTacToe.git
cd RealTimeMultiplayerTicTacToe

```

### **2️⃣ Edit the `socketURL`  in `App.jsx`**

```
const socketURL = "https://localhost:5000";
```

The React app will run on  **[http://localhost:3000](http://localhost:3000)** .

### **3️⃣ Start the Backend Server**

Navigate to the **server** folder and install dependencies:

```
cd server
npm run build

```

And then set up the .env files. Then the backend will start running at  **[http://localhost:5000]()** .

## **🚀 Play the Game!**

1. Open **[http://localhost:3000](http://localhost:3000)** in two different browser tabs or devices.
2. Click **"Play Online"** to join the game.
3. Once two players are connected, the match starts automatically!
