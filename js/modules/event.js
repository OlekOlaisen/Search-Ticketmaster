

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9idXJhdG8iLCJhIjoiY2xlNnppZDV6MDBsbjN1cGhkNmw0Zmh1cSJ9.bTkN44PiKDNAygr5t1c36A';


export function Event() {
  // Get the event ID from the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  const apiSecret = '3AHIueOLGj4rurjN2j5YRIF5Pqvmi51H';
  const url = `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${apiSecret}&include=venue,pricing`;

  const eventDetailsContainer = document.querySelector('#event-details-container');
  const cleanUrl = window.location.href.replace('event.html', '');
  history.replaceState(null, '', cleanUrl);

  // Fetches the event data 
  fetch(url)
    .then(response => response.json())
    .then(event => {
      const name = event.name;
      const dateStr = event.dates.start.localDate;
      const dateArr = dateStr.split('-');
      const date = `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`;
      const timeStart = event.dates.start.localTime?.slice(0, 5);
      const venue = event._embedded.venues[0].name;
      const address = event._embedded.venues[0].address;
      const longitude = event._embedded.venues[0].location.longitude;
      const latitude = event._embedded.venues[0].location.latitude;
      const city = event._embedded.venues[0].city.name;
      const country = event._embedded.venues[0].country.name;
      const imageUrl = event.images.find(image => image.width > 500)?.url;
      const ticketUrl = event.url;
      const availableTickets = event.dates.status.code === 'onsale' ? 'Available tickets!' : 'Tickets unavailable';
      const ticketStatusClass = event.dates.status.code === 'onsale' ? 'green-text' : 'red-text';
      const category = event.classifications[0].segment.name;
      const performers = event._embedded.attractions ? event._embedded.attractions.map(attraction => attraction.name).join(", ") : '';
      const minPrice = event.priceRanges ? event.priceRanges[0].min.toFixed(2) : null;
      const maxPrice = event.priceRanges ? event.priceRanges[0].max.toFixed(2) : null;
      const priceRange = minPrice && maxPrice && minPrice !== maxPrice ? `${minPrice}  - ${maxPrice}` : maxPrice ? `${maxPrice}` : 'Price not available';
      const performerImages = event._embedded.attractions ? event._embedded.attractions.map(attraction => {
        if (attraction.images.length > 0) {
          return attraction.images.find(image => image.width > 500)?.url;
        }
      }) : [];
      const performerImage = performerImages.filter(image => image != null)[0];
      document.title = name;

      const mapContainer = document.createElement('div');
      mapContainer.classList.add('event-details__performer-image');
      mapContainer.id = 'map';

      eventDetailsContainer.innerHTML = `
  <div class="event-image__container">
    <img class="event-image" src="${imageUrl}" alt="${name}">
  </div>
  <div class="event__container"> 
    <div class="event-details__container">
      <h2 class="event-details__name"><b class="event-details--bold">${name}</b></h2>
      <p class="event-details__performers"><b class="event-details--bold">Performers:</b> ${performers}</p>
      <p class="event-details__category"><b class="event-details--bold">Category:</b> ${category}</p>
      <p class="event-details__date"><b class="event-details--bold">Date:</b> ${date}</p>
      <p class="event-details__time"><b class="event-details--bold">Time:</b> ${timeStart}</p>
      <p class="event-details__venue"><b class="event-details--bold">Venue:</b> ${venue}</p>
      <p class="event-details__address"><b class="event-details--bold">Address:</b> ${address.line1}, ${city}, ${country}</p>
      <p class="event-details__price"><b class="event-details--bold">Price:</b> ${priceRange}</p>
      <p class="event-details__tickets"><b class="event-details--bold ${ticketStatusClass}">${availableTickets}</b></p>
      
      <a class="event-details__button" href="${ticketUrl}" target="_blank">Buy Tickets</a>
    </div>
    ${mapContainer.outerHTML}
  </div>
`;

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude], 
        zoom: 15
      });

      
      new mapboxgl.Marker({ "color": "#ff0022" })
        .setLngLat([longitude, latitude])
        .addTo(map);
    

    })
    .catch(error => console.error(error));
}

Event();