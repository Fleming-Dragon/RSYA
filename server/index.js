const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory bookings array
let bookings = [];

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Socket.IO connection
io.on("connection", (socket) => {
  // Send all previous bookings to the new client
  bookings
    .slice()
    .reverse()
    .forEach((booking) => {
      socket.emit("new-booking", booking);
    });
});

// Mock function to generate random bookings
function generateRandomBooking() {
  const venues = [
    "Grand Hall",
    "Skyline Lounge",
    "Sunset Terrace",
    "Ocean View",
    "Garden Room",
  ];
  const partySizes = [2, 4, 6, 8, 10, 12, 20];
  const venueName = venues[Math.floor(Math.random() * venues.length)];
  const partySize = partySizes[Math.floor(Math.random() * partySizes.length)];
  const time = new Date().toLocaleTimeString();
  return { venueName, partySize, time };
}

setInterval(() => {
  const booking = generateRandomBooking();
  bookings.push(booking);
  io.emit("new-booking", booking);
}, 5000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
