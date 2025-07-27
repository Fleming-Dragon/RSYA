const socket = io();

const bookingsList = document.getElementById("bookings-list");
const emptyState = document.getElementById("empty-state");
const totalBookingsEl = document.getElementById("total-bookings");
const totalGuestsEl = document.getElementById("total-guests");
const refreshIndicator = document.getElementById("refresh-indicator");

let totalBookings = 0;
let totalGuests = 0;

// Function to animate counter
function animateCounter(element, start, end, duration = 1000) {
  const startTime = performance.now();
  const difference = end - start;

  function updateCounter(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const current = Math.floor(start + difference * progress);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

// Function to update stats
function updateStats() {
  animateCounter(
    totalBookingsEl,
    parseInt(totalBookingsEl.textContent) || 0,
    totalBookings
  );
  animateCounter(
    totalGuestsEl,
    parseInt(totalGuestsEl.textContent) || 0,
    totalGuests
  );
}

// Function to show/hide empty state
function toggleEmptyState() {
  if (bookingsList.children.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }
}

// Function to show refresh indicator
function showRefreshIndicator() {
  refreshIndicator.classList.add("active");
  setTimeout(() => {
    refreshIndicator.classList.remove("active");
  }, 1000);
}

// Function to create booking item with enhanced styling
function createBookingItem(booking) {
  const li = document.createElement("li");
  li.className = "booking-item";

  // Generate a random venue icon
  const venueIcons = [
    "fas fa-utensils",
    "fas fa-wine-glass-alt",
    "fas fa-coffee",
    "fas fa-pizza-slice",
  ];
  const randomIcon = venueIcons[Math.floor(Math.random() * venueIcons.length)];

  li.innerHTML = `
    <div class="venue">
      <i class="${randomIcon}"></i>
      ${booking.venueName}
    </div>
    <div class="details">
      <div class="party-size">
        <i class="fas fa-users"></i>
        <span>${booking.partySize} ${
    booking.partySize === 1 ? "guest" : "guests"
  }</span>
      </div>
      <div class="time">
        <i class="fas fa-clock"></i>
        <span>${formatTime(booking.time)}</span>
      </div>
    </div>
  `;

  return li;
}

// Function to format time nicely
function formatTime(timeString) {
  try {
    // Handle different time formats
    let date;

    if (timeString.includes("T") || timeString.includes("Z")) {
      // ISO string format
      date = new Date(timeString);
    } else if (timeString.includes(":")) {
      // Time-only format (like "2:30:15 PM")
      const today = new Date();
      const timeOnly = timeString;
      date = new Date(`${today.toDateString()} ${timeOnly}`);
    } else {
      // Fallback: try to parse as-is
      date = new Date(timeString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    // Format the date nicely
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow =
      date.toDateString() ===
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

    if (isToday) {
      return `Today, ${date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else {
      return date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        month: "short",
        day: "numeric",
      });
    }
  } catch (error) {
    console.warn("Failed to parse time:", timeString, error);
    // Return a user-friendly fallback
    return timeString || "Time not available";
  }
}

// Function to add booking with animation
function addBooking(booking) {
  const item = createBookingItem(booking);

  // Update stats
  totalBookings++;
  totalGuests += parseInt(booking.partySize) || 0;

  // Insert at the beginning
  bookingsList.insertBefore(item, bookingsList.firstChild);

  // Limit to 10 most recent bookings
  while (bookingsList.children.length > 10) {
    bookingsList.removeChild(bookingsList.lastChild);
  }

  // Update UI
  toggleEmptyState();
  updateStats();
  showRefreshIndicator();

  // Add a subtle notification sound effect (optional)
  playNotificationSound();
}

// Function to play a subtle notification sound
function playNotificationSound() {
  // Create a short, pleasant beep using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    600,
    audioContext.currentTime + 0.1
  );

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.1
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Socket event listeners
socket.on("new-booking", (booking) => {
  console.log("New booking received:", booking);
  addBooking(booking);
});

socket.on("connect", () => {
  console.log("Connected to server");
  showRefreshIndicator();
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  toggleEmptyState();
  console.log("Live Bookings Dashboard initialized");
});
