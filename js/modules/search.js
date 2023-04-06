export default function Search() {
  const searchForm = document.querySelector('#search-form');
  const citySearchInput = document.querySelector('#city-search-input');
  const resultsContainer = document.querySelector('#results-container');
  const apiSecret = '3AHIueOLGj4rurjN2j5YRIF5Pqvmi51H';


  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    handleSearchSubmit(event);
  };

  const handleInputChange = (event) => {
    
    handleSearchSubmit(event);
  };

  searchForm.addEventListener('submit', handleFormSubmit);
  citySearchInput.addEventListener('input', handleInputChange);
  document.querySelector('#category-select').addEventListener('change', handleInputChange);
  document.querySelector('#date-input').addEventListener('change', handleInputChange);

  const handleSearchSubmit = (event) => {

    const searchQuery = citySearchInput.value.trim().split(/\s+/).join('%20');
    const categorySelect = document.querySelector('#category-select');
    const category = categorySelect.value;
    const dateInput = document.querySelector('#date-input');
    const date = dateInput.value ? new Date(dateInput.value).toISOString().split('T')[0] : null;
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${searchQuery}&locale=*&classificationName=${category}&apikey=${apiSecret}&size=100&sort=date,asc`;

    if (date) {
      url += `&startDateTime=${date}T00:00:00Z&endDateTime=${date}T23:59:59Z`;
    }

    event.preventDefault();
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resultsContainer.innerHTML = '';

        if (data._embedded && data._embedded.events) {
          let events = data._embedded.events;

          if (category) {
            events = events.filter((event) => event.classifications[0].segment.name.toLowerCase() === category);
          }

          if (date) {
            events = events.filter((event) => event.dates.start.localDate === date);
          }

         
          sessionStorage.setItem('events', JSON.stringify(events));

          events.forEach((event) => {
            const resultItem = createResultItem(event);
            resultsContainer.appendChild(resultItem);
          });
        } else {
          console.error('No events found');
        }

      })
      .catch((error) => console.error(error));
  };

  const createResultItem = (event) => {
    const name = event.name;
    const dateStr = event.dates.start.localDate;
    const dateArr = dateStr.split('-');
    const date = `${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`;
    const venue = event._embedded?.venues?.[0]?.name || '';
    const imageUrl = event.images.find((image) => image.width > 500)?.url;
    const ticketUrl = event.url;
    const availableTickets = event.dates.status.code === 'onsale' ? 'Available tickets!' : 'Tickets unavailable';
    const ticketStatusClass = event.dates.status.code === 'onsale' ? 'green-text' : 'red-text';
    const category = event.classifications?.[0]?.segment.name || '';

 
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');
    resultItem.innerHTML = `
    <a class="result-details__id" href="event.html?id=${event.id}">
      <div class="result-image">
        <img src="${imageUrl}" alt="${name}">
      </div>
      <h2 class="result-details__name">${name}</h2>
      <div class="result-details">
        <p class="result-details__date"><b class="event-details--bold">When:</b> ${date}</p>
        <p class="result-details__venue"><b class="event-details--bold">Venue:</b> ${venue}</p>
        <p class="result-details__category"><b class="event-details--bold">Category:</b> ${category}</p>
        <p class="result-details__tickets"><b class="event-details--bold ${ticketStatusClass}">${availableTickets}</b></p>
        <a class="result-details__button" href="${ticketUrl}" target="_blank">Buy Tickets</a>
      </div>
    </a>
  `;

    return resultItem;
  };


  const savedEvents = sessionStorage.getItem('events');
  let events = [];

  if (savedEvents) {
    events = JSON.parse(savedEvents);

 
    events.forEach((event) => {
      const resultItem = createResultItem(event);
      resultsContainer.appendChild(resultItem);
    });
  }

  const clearDateButton = document.querySelector('#clear-date-button');
  const dateInput = document.querySelector('#date-input');

  const handleClearDateClick = (event) => {
    dateInput.value = '';
    handleSearchSubmit(event); 
  };

  clearDateButton.addEventListener('click', handleClearDateClick);
}