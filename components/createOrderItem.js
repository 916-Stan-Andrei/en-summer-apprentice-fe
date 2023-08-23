import { kebabCase } from "../utils";
import { updateOrder } from "./updateOrder";
import { deleteOrder } from "./deleteOrder";

export async function fetchOrders(){
  const response = await fetch('https://localhost:7105/api/Order/GetOrders');
  const data = await response.json();
  return data;
}

export const createOrderItem = (categories, order) => {
    const purchaseRow = document.createElement('tr');
    purchaseRow.id = `purchase-${order.orderId}`;

    const titleCell = document.createElement('td');
    titleCell.classList.add('purchase-title');
    getEventByID(order.eventId)
      .then(eventDetails => {
        const eventName = eventDetails.name; 
        titleCell.innerText = kebabCase(eventName);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    purchaseRow.appendChild(titleCell);
  
    const quantityCell = document.createElement('td');
    const purchaseQuantity = createInput();
    purchaseQuantity.type = 'number';
    purchaseQuantity.min = '1';
    purchaseQuantity.value = order.numberOfTickets;
    purchaseQuantity.disabled = true;
    quantityCell.appendChild(purchaseQuantity);
    purchaseRow.appendChild(quantityCell);

    const typeCell = document.createElement('td');
    const purchaseType = createSelect();
    purchaseType.setAttribute('disabled', true);

  const categoriesOptions = categories.map(
    (ticketCategory) => {
      if (ticketCategory.eventId === order.eventId) {
        return `<option value=${ticketCategory.ticketcategoryId} ${ticketCategory.ticketcategoryId === order.ticketcategoryId ? 'selected' : ''
          }>${ticketCategory.description}</option>`;
      }
    }).join('\n');



    purchaseType.innerHTML = categoriesOptions;
    typeCell.appendChild(purchaseType);
    purchaseRow.appendChild(typeCell);
    
    const dateCell = document.createElement('td');
    dateCell.innerText = new Date(order.orderedAt).toLocaleDateString();
    purchaseRow.appendChild(dateCell);


    const priceCell = document.createElement('td');
    priceCell.innerHTML = order.totalPrice;
    purchaseRow.appendChild(priceCell);
    
    
    const actionsCell = document.createElement('td');
    const editButton = createButton("edit", editButtonHandler);
    actionsCell.appendChild(editButton);
    const saveButton = createButton("save", saveButtonHandler);
    saveButton.hidden = true;
    actionsCell.appendChild(saveButton);
    const cancelButton = createButton("cancel", cancelButtonHandler);
    cancelButton.hidden = true;
    actionsCell.appendChild(cancelButton);
    const deleteButton = createButton("delete", deleteButtonHandler);
    actionsCell.appendChild(deleteButton);
  
    purchaseRow.appendChild(actionsCell);


    function editButtonHandler() {
        if (saveButton.hidden && cancelButton.hidden) {
            saveButton.hidden = false;
            cancelButton.hidden = false;
            purchaseType.removeAttribute('disabled');
            purchaseQuantity.disabled = false;
            editButton.hidden = true;
        }
      }

    function saveButtonHandler(){
        const newType = purchaseType.value;
        const newQuantity = purchaseQuantity.value;
        console.log(newType);
        if(newType != order.ticketcategoryId || newQuantity != order.numberOfTickets){
            updateOrder(order.orderId, newType, newQuantity)
                .then((res) => {
                    if (res.status === 200){
                        res.json().then((data) => {
                            order = data;
                            priceCell.innerHTML = order.totalPrice;
                            dateCell.innerHTML = new Date(order.orderedAt).toLocaleDateString();
                        });
                    }
                })
                .catch((err) => {
                  console.error(err);
                })
                .finally(()=>{

                });
        }
        saveButton.hidden = true;
        cancelButton.hidden = true;
        editButton.hidden = false;
        purchaseType.setAttribute('disabled', 'true');
        purchaseQuantity.disabled = true;

    }

    function cancelButtonHandler(){
        saveButton.hidden = true;
        cancelButton.hidden = true;
        editButton.hidden = false;
        purchaseType.setAttribute('disabled', 'true');
        purchaseQuantity.disabled = true;

        purchaseQuantity.value = order.numberOfTickets;
        Array.from(purchaseType.options).forEach(function  (element, index){
            if(element.value == order.ticketcategoryId){
                purchaseType.options.selectedIndex = index;
                return;
            }
        });
    }

    function deleteButtonHandler(){
      deleteOrder(order.orderId);
    }
  
    return purchaseRow;

}

function getEventByID(eventId) {
    const url = `https://localhost:7105/api/Event/GetEventById?id=${eventId}`;
  
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .catch(error => {
      throw new Error(error);
    });
  }


  function createInput(){
    const input = document.createElement('input');
    return input;
  }

  function createSelect(){
    const select = document.createElement('select');
    return select;
  }

  function createButton(innerHTML, handler){
    const button = document.createElement('button');
    button.innerHTML = innerHTML;
    button.addEventListener('click', handler);
    return button;
  }

