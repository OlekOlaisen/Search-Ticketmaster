export default function Search() {
  const searchForm = document.querySelector('#search-form');
  const cityInput = document.querySelector('#city-input');
  const categorySelect = document.querySelector('#category-select');
  const resultsContainer = document.querySelector('#results-container');
  const apiKey = '3AHIueOLGj4rurjN2j5YRIF5Pqvmi51H';

  const createResultItem = (event) => {
    const name = event.name;
    const dateStr = event.dates.start.localDate;
    const dateArr = dateStr.split('-');
    const date = `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`;
    const venue = event._embedded.venues[0].name;
    const imageUrl = event.images.find((image) => image.width > 500)?.url;
    const ticketUrl = event.url;
    const availableTickets = event.dates.status.code === 'onsale' ? 'Available tickets!' : 'Tickets not yet on sale';
    const category = event.classifications[0].segment.name;

    // Renders events in HTML
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');
    resultItem.innerHTML = `
      <a class="result-details__id" href="event.html?id=${event.id}">
        <div class="result-image">
          <img src="${imageUrl}" alt="${name}">
        </div>
        <div class="result-details">
          <h2 class="result-details__name">${name}</h2>
          <p class="result-details__date">When: ${date}</p>
          <p class="result-details__venue">Venue: ${venue}</p>
          <p class="result-details__tickets">${availableTickets}</p>
          <p class="result-details__category">Category: ${category}</p>
          <a class="result-details__button" href="${ticketUrl}" target="_blank">Buy Tickets</a>
        </div>
      </a>
    `;

    return resultItem;
  };

  // Loads events from localStorage
  const savedEvents = localStorage.getItem('events');
  let events = [];

  if (savedEvents) {
    events = JSON.parse(savedEvents);

    // Renders saved events
    events.forEach((event) => {
      const resultItem = createResultItem(event);
      resultsContainer.appendChild(resultItem);
    });
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const city = cityInput.value;
    const category = categorySelect.value;
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&classificationName=${category}&apikey=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resultsContainer.innerHTML = '';
        let events = data._embedded.events;

        if (category) {
          events = events.filter((event) => event.classifications[0].segment.name.toLowerCase() === category);
        }

        events.sort((a, b) => a.classifications[0].segment.name.localeCompare(b.classifications[0].segment.name));

        // Saves events to localStorage
        localStorage.setItem('events', JSON.stringify(events));

        events.forEach((event) => {
          const resultItem = createResultItem(event);
          resultsContainer.appendChild(resultItem);
        });
      })
      .catch((error) => console.error(error));
  };

  searchForm.addEventListener('submit', handleSearchSubmit);
}
