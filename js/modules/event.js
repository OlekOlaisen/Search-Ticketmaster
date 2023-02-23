export default function Event() {
	const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');
const url = `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=3AHIueOLGj4rurjN2j5YRIF5Pqvmi51H`;

const eventDetailsContainer = document.getElementById('event-details-container');

fetch(url)
  .then(response => response.json())
  .then(event => {
    const name = event.name;
    const date = event.dates.start.localDate;
    const time = event.dates.start.localTime;
    const venue = event._embedded.venues[0].name;
    const imageUrl = event.images.find(image => image.width > 500)?.url;
    const ticketUrl = event.url;
    const availableTickets = event.dates.status.code === 'onsale' ? 'Available tickets!' : 'Tickets not yet on sale';
    const category = event.classifications[0].segment.name;

    eventDetailsContainer.innerHTML = `
      <div class="event-image">
        <img src="${imageUrl}" alt="${name}">
      </div>
      <div class="event-details">
        <h2>${name}</h2>
        <p>Date: ${date}</p>
        <p>Time: ${time}</p>
        <p>Venue: ${venue}</p>
        <p>${availableTickets}</p>
        <p>Category: ${category}</p>
        <a href="${ticketUrl}" target="_blank">Buy Tickets</a>
      </div>
    `;
  })
  .catch(error => console.error(error));

}

Event();