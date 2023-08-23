import { kebabCase } from "../utils";
import { handleAddToCart } from "./addEventToCart";
import { useStyle } from "./styles";

export async function fetchEvents() {
    const apiUrl = 'http://localhost:9090/allevents';
    const response = await fetch(apiUrl);
    const events = await response.json();
    return events;
  }
  
 export const addEvents = (events) => {
    const eventsDiv = document.querySelector('.events');
    eventsDiv.innerHTML = 'No events!';
    if (events.length) {
      eventsDiv.innerHTML = '';
      events.forEach((event) => {
        eventsDiv.appendChild(createEvent(event));
      })
    }
  }
  
  const createEvent = (eventData) => {
    const title = kebabCase(eventData.name);
    console.log(title);
    const imageURLSdict = {
      "Untold":"./src/assets/untold.png",
      "Electric-Castle":"./src/assets/electric.png",
      "Meci-de-fotbal":"./src/assets/football.png",
      "Wine-Festival":"./src/assets/wine.png"
    }
    const eventElement = createEventElement(eventData, title, imageURLSdict[title]);
    return eventElement;
  };

const createEventElement = (eventData, title, imageURL) => {
    const { eventID, description, name, ticketCategories} = eventData;
    const eventDiv = document.createElement('div');
    console.log(description);


    eventDiv.classList.add('event');
  
    const contentMarkup = `
      <header>
        <h2 class="event-title">${name}</h2>
      </header>
      <div class="content">
        <img src="${imageURL}" alt="${name}" class="event-img">
        <p class="description">${description}</p>
      </div>
    `;
    
    eventDiv.innerHTML = contentMarkup;
  
    const actions = document.createElement('div');
  
    const categoriesOptions = ticketCategories.map(
  
      (ticketCategory) =>
  
        `<option value=${ticketCategory.ticketCategoryID}>${ticketCategory.description}</option>`
  
    );
  
    const ticketTypeMarkup = `
    <h2 class="ticket-type-label">Choose Ticket Type:</h2>
    <select id="ticketType" name="ticketType" class="select custom-ticket-type">
      ${categoriesOptions.join('\n')}
    </select>
  `;
  
    actions.innerHTML = ticketTypeMarkup;
  
    const quantity = document.createElement('div');
    quantity.classList.add('actions');
  
    const input = document.createElement('input');
    input.classList.add('input-style');
    input.type = 'number';
    input.min = 0;
    input.value = 0;
  
    input.addEventListener('blur', () =>{
      if(!input.value){
        input.value = 0;
      }
    });
  
    input.addEventListener('input', ()=>{
      const currentQuantity = parseInt(input.value);
      if (currentQuantity > 0){
        addToCart.disabled = false;
      }else{
        addToCart.disabled = true;
      }
    });
  
    quantity.appendChild(input);
  
    const quantityActions = document.createElement('div');
    quantityActions.classList.add('quantity-actions');
  
    const increase = document.createElement('button');
    increase.classList.add('increase');
    increase.innerText = '+';
    increase.addEventListener('click', () =>{
      input.value = parseInt(input.value) + 1;
      const currentQuantity = parseInt(input.value);
      if(currentQuantity > 0){
        addToCart.disabled = false;
      }else{
        addToCart.disabled = true;
      }
    });
  
    const decrease = document.createElement('button');
    decrease.classList.add('decrease');
    decrease.innerText = '-';
    decrease.addEventListener('click', () => {
      const currentValue = parseInt(input.value);
      if (currentValue > 0) {
        input.value = currentValue - 1;
      }
      const currentQuantity = parseInt(input.value);
      if (currentQuantity > 0) {
        addToCart.disabled = false;
      } else {
        addToCart.disabled = true;
      }
    });
  
    quantityActions.appendChild(increase);
    quantityActions.appendChild(decrease);
  
    quantity.appendChild(quantityActions);
    actions.appendChild(quantity);
    eventDiv.appendChild(actions);
  
    const eventFooter = document.createElement('footer');
    const addToCart = document.createElement('button');
    addToCart.classList.add('add-to-cart-btn');
    addToCart.innerText = 'Add to cart';
    addToCart.disabled = true;
  
    addToCart.addEventListener('click', ()=>{
      handleAddToCart(title, eventID, input, addToCart);
    })
    eventFooter.appendChild(addToCart);
    eventDiv.append(eventFooter);
  
    return eventDiv;
  
  }

// LIVE SEARCH BY NAME (FRONTEND)

  function liveSearch(events){
    const filterInput = document.querySelector('#filter-name');
    console.log(events);

    if (filterInput) {
        const searchValue = filterInput.value;

        if (searchValue != undefined){
            const filteredEvents = events.filter((event) =>
                event.name.toLowerCase().includes(searchValue.toLowerCase())
            );

            addEvents(filteredEvents);
        }
    }
}

export function setupFilterEvents(events){
    const nameFilterInput = document.querySelector('#filter-name');

    nameFilterInput.addEventListener('keyup', () =>{
        setTimeout(() =>{
            liveSearch(events);
        }, 500);
    })
}

//CHECKBOX FILTER(BACKEND)

export function getEvents(filters){
    const queryParams = new URLSearchParams(filters).toString();
    return fetch(`http://localhost:9090/events?${queryParams}`,{
        method:'GET',
        headers:{
            "Content-Type":"application/json"
            },
    })
    .then ((res)=>res.json())
    .then((data)=>{
        return [...data];
    });
}

export function getFilters(){
    const selectedVenue = document.querySelector('[id^="filter-by-venue"]:checked');
    const selectedEventType = document.querySelector('[id^="filter-by-event-type"]:checked');
  
    return {
      locId: selectedVenue ? selectedVenue.value : null,
      eventType: selectedEventType ? selectedEventType.value : null,
    };
}

export async function handleCheckboxFilter(){
    const filters = getFilters();
    if (filters.locId !== null && filters.eventType !== null) {
        try{
            const filteredData = await getEvents(filters);
            addEvents(filteredData);
        }catch (error){
            console.error("Error fetching filtered events", error);
        }
    }else{
        fetchEvents()
        .then((data) => {
          addEvents(data);
        });
    }
}

function createCheckbox(type, value, locationNameMapping){
    const checkboxContainer = document.createElement('div');
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.id = `filter-by-${type}-${value}`;
    checkbox.value = value;

    checkbox.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll(`input[type="checkbox"][id^="filter-by-${type}-"]`);
        checkboxes.forEach(otherCheckbox => {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });
    
        handleCheckboxFilter();
      });

    const label = document.createElement('label');
    label.setAttribute('for', `filter-by-${type}-${value}`);
    if (type === 'venue'){
        label.textContent = locationNameMapping[value];
    } else{
        label.textContent = value;
    }

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    return checkboxContainer;
}

export function createCheckboxesForEvents(events){
    const venueIdSet = new Set(events.map((event)=> event.location.locationID));
    const eventTypeSet = new Set(events.map((event)=> event.type));
    const locationNameMapping = {};

    events.forEach((event) => {
      locationNameMapping[event.location.locationID] = event.location.name;
    });


    const filtersContainer = document.querySelector('.checkbox-filter-container');

    const venueFilterDiv = document.querySelector('.venue-filter-container');

    venueIdSet.forEach((venueID) => {
        const checkboxContainer = createCheckbox('venue', venueID, locationNameMapping);

        venueFilterDiv.appendChild(checkboxContainer);
    });

    const eventTypeFilterDiv = document.querySelector('.event-type-filter-container');

    eventTypeSet.forEach((eventType)=>{
        const checkboxContainer = createCheckbox('event-type', eventType, locationNameMapping);

        eventTypeFilterDiv.appendChild(checkboxContainer);
    });

    filtersContainer.appendChild(venueFilterDiv);
    filtersContainer.appendChild(eventTypeFilterDiv);
}