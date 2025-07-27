const socket = io();

const bookingsList = document.getElementById("bookings-list");

function createBookingItem(booking) {
  const li = document.createElement("li");
  li.className = "booking-item";
  li.innerHTML = `
    <span><strong>Venue:</strong> ${booking.venueName}</span>
    <span><strong>Party Size:</strong> ${booking.partySize}</span>
    <span class="time"><strong>Time:</strong> ${booking.time}</span>
  `;
  return li;
}

socket.on("new-booking", (booking) => {
  const item = createBookingItem(booking);
  bookingsList.insertBefore(item, bookingsList.firstChild);
});
