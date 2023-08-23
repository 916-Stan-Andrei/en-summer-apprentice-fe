import { data } from "autoprefixer";
import { useStyle } from "./components/styles";
import { kebabCase } from "./utils";

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img class="banner" src="./src/assets/TMSBanner.png" alt="summer">
      <div class="all-filters">
        <h1>Explore events</h1>
        <div class="live-search">
          <input type="text" id="filter-name" placeholder="Filter by name" class="filter-input" />
        </div>
        <div class="checkbox-filter-container">
          <div class="venue-filter-container"></div>
          <div class="event-type-filter-container"></div>
        </div>
      </div>
      <div class="events">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="order-content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="purchases">
      <table class="purchase-table">
        <thead>
          <tr>
            <th class="purchase-title">Name</th>
            <th class="purchase-title">Nb tickets</th>
            <th class="purchase-title">Category</th>
            <th class="purchase-title">Date</th>
            <th class="purchase-title">Price</th>
            <th class="purchase-title">Actions</th>
          </tr>
        </thead>
        <tbody id="purchases-content">
        </tbody>
      </table>
      </div>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  fetchEvents()
    .then((data) => {
      console.log('data', data);
      addEvents(data);
      setupFilterEvents(data);
      createCheckboxesForEvents(data);
    });

}

const createEvent = (eventData) => {
  const title = kebabCase(eventData.name);
  const eventElement = createEventElement(eventData, title);
  return eventElement;
};

const createEventElement = (eventData, title) => {
  const { eventID, description, name, ticketCategories, location} = eventData;
  const eventDiv = document.createElement('div');
  const eventWrapperClasses = useStyle('eventWrapper');
  const actionsWrapperClasses = useStyle('actionsWrapper');
  const quantityClasses = useStyle('quantity');
  const inputClasses = useStyle('input');
  const quantityActionsClasses = useStyle('quantityActions');
  const increaseBtnClasses = useStyle('increaseBtn');
  const decreaseBtnClasses = useStyle('decreaseBtn');
  const addToCartBtnClasses = useStyle('addToCartBtn');

  eventDiv.classList.add(...eventWrapperClasses);

  const contentMarkup = `
    <header>
      <h2 class="event-title text-2xl font-bold">${name}</h2>
    </header>
    <div class="content">
      <img src="./src/assets/TMSLogo.png" alt="${name}" class="event-img">
      <p style="color: white; display: flex;">${description}</p>
    </div>
  `;
  
  eventDiv.innerHTML = contentMarkup;

  const actions = document.createElement('div');
  actions.classList.add(...actionsWrapperClasses);

  const categoriesOptions = ticketCategories.map(

    (ticketCategory) =>

      `<option value=${ticketCategory.ticketCategoryID}>${ticketCategory.description}</option>`

  );

  const ticketTypeMarkup = `

    <h2 class = "text-lg font-bold mb-2">Choose Ticket Type:</h2>

    <select id="ticketType" name="ticketType" class="select ${title}-ticket-type border border-gray-300 rounded">

      ${categoriesOptions.join('\n')}

    </select>

  `;

  actions.innerHTML = ticketTypeMarkup;

  // const quantity = document.createElement('div');
  // quantity.classList.add(...quantityClasses);

  // const input = document.createElement('input');
  // input.classList.add(...inputClasses);
  // input.type = 'number';
  // input.min = 0;
  // input.value = 0;

  // input.addEventListener('blur', () =>{
  //   if(!input.value){
  //     input.value = 0;
  //   }
  // });

  // input.addEventListener('input', ()=>{
  //   const currentQuantity = parseInt(input.value);
  //   if (currentQuantity > 0){
  //     addToCart.disabled = false;
  //   }else{
  //     addToCart.disabled = true;
  //   }
  // });

  // quantity.appendChild(input);

  // const quantityActions = document.createElement('div');
  // quantityActions.classList.add(...quantityActionsClasses);

  // const increase = document.createElement('button');
  // increase.classList.add(...increaseBtnClasses);
  // increase.innerText = '+';
  // increase.addEventListener('click', () =>{
  //   input.value = parseInt(input.value) + 1;
  //   const currentQuantity = parseInt(input.value);
  //   if(currentQuantity > 0){
  //     addToCart.disabled = false;
  //   }else{
  //     addToCart.disabled = true;
  //   }
  // });

  // const decrease = document.createElement('button');
  // decrease.classList.add(...decreaseBtnClasses);
  // decrease.innerText = '-';
  // decrease.addEventListener('click', () => {
  //   const currentValue = parseInt(input.value);
  //   if (currentValue > 0) {
  //     input.value = currentValue - 1;
  //   }
  //   const currentQuantity = parseInt(input.value);
  //   if (currentQuantity > 0) {
  //     addToCart.disabled = false;
  //   } else {
  //     addToCart.disabled = true;
  //   }
  // });

  // quantityActions.appendChild(increase);
  // quantityActions.appendChild(decrease);

  // quantity.appendChild(quantityActions);
  // actions.appendChild(quantity);
   eventDiv.appendChild(actions);

  // const eventFooter = document.createElement('footer');
  // const addToCart = document.createElement('button');
  // addToCart.classList.add(...addToCartBtnClasses);
  // addToCart.innerText = 'Add to cart';
  // addToCart.disabled = true;

  // addToCart.addEventListener('click', ()=>{

  // })
  // eventFooter.appendChild(addToCart);
  // eventDiv.append(eventFooter);

  return eventDiv;

}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  const purchasesContent = document.getElementById('purchases-content');

  
  fetchOrders().then((orders) => {
    if (orders.length){
      orders.forEach((order) => {
        const newOrder = createOrderItem(categories, order);
        purchasesContent.appendChild(newOrder);
      });
    }
  })

}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage();
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
