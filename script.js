
const eventList = document.getElementById('event-list');
const form = document.getElementById('event-form');
const searchBar = document.getElementById('search-bar');

let events = JSON.parse(localStorage.getItem('events')) || [];

function displayEvents(filteredEvents = events) {
    eventList.innerHTML = '';
    filteredEvents.forEach((event, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${event.name} on ${event.date} at ${event.time} - ${event.location} (${event.category}) <br/>
            <button onclick="editEvent(${index})">Edit</button>
            <button onclick="deleteEvent(${index})">Delete</button>
            <span class="countdown" id="countdown-${index}"></span>
        `;
        eventList.appendChild(listItem);
        startCountdown(event.date, event.time, index);
    });
}

function addEvent(e) {
    e.preventDefault();
    const newEvent = {
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        location: document.getElementById('event-location').value,
        category: document.getElementById('event-category').value,
    };
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    form.reset();
    displayEvents();
}

function deleteEvent(index) {
    events.splice(index, 1);
    localStorage.setItem('events', JSON.stringify(events));
    displayEvents();
}

function editEvent(index) {
    const event = events[index];
    document.getElementById('event-name').value = event.name;
    document.getElementById('event-date').value = event.date;
    document.getElementById('event-time').value = event.time;
    document.getElementById('event-location').value = event.location;
    document.getElementById('event-category').value = event.category;
    deleteEvent(index);  // Delete the old event before editing
}

function filterEvents() {
    const query = searchBar.value.toLowerCase();
    const filteredEvents = events.filter(event => event.name.toLowerCase().includes(query));
    displayEvents(filteredEvents);  // Show filtered events only
}

function startCountdown(date, time, index) {
    const eventDate = new Date(`${date}T${time}`);
    const countdownElement = document.getElementById(`countdown-${index}`);
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const distance = eventDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);  // Stop countdown after event starts
            countdownElement.textContent = "Event has started";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24 ));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        countdownElement.textContent = `${days}d ${hours}h ${minutes}m`;
    }, 1000);
}

// Event listeners
form.addEventListener('submit', addEvent);
searchBar.addEventListener('input', filterEvents);

// Initialize events display
displayEvents();
