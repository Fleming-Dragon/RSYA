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
  // Send only the most recent 100 bookings to the new client
  bookings
    .slice(-100) // Get last 100 bookings
    .reverse() // Show newest first
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

  // Generate a random time within the next 24 hours
  const now = new Date();
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  const bookingTime = new Date(
    now.getTime() + (randomHours * 60 + randomMinutes) * 60 * 1000
  );

  return {
    venueName,
    partySize,
    time: bookingTime.toISOString(), // Send as ISO string for proper parsing
  };
}

setInterval(() => {
  const booking = generateRandomBooking();
  bookings.push(booking);

  // Keep only the most recent 100 bookings in memory
  if (bookings.length > 100) {
    bookings = bookings.slice(-100);
  }

  io.emit("new-booking", booking);
}, 5000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
