# Live Bookings Viewer

A simple full-stack real-time dashboard for administrators to monitor and confirm incoming bookings instantly.

## Tech Stack

- **Backend:** Node.js, Express.js, Socket.IO
- **Frontend:** HTML, CSS, JavaScript (no frameworks)
- **Database:** In-memory array (no external DB)

## Features

- Real-time updates: New bookings appear instantly for all connected users.
- Simple, clean UI.

## Setup Instructions

### 1. Install dependencies

Open a terminal in the `server` directory and run:

```
npm install express socket.io
```

### 2. Start the server

From the `server` directory, run:

```
node index.js
```

The server will start on [http://localhost:3000](http://localhost:3000).

### 3. View the dashboard

Open your browser and go to [http://localhost:3000](http://localhost:3000).

## Project Structure

```
day_27_07/
  public/
    index.html
    style.css
    main.js
  server/
    index.js
  README.md
```

## How it works

- The backend simulates a new booking every 5 seconds and broadcasts it to all connected clients using Socket.IO.
- The frontend listens for new bookings and displays them at the top of the list in real-time.

---

**Author:** Ved Mahajan
