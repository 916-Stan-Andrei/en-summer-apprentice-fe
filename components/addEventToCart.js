import { kebabCase } from "../utils";

export const handleAddToCart = (title, id, input, addToCart) => {
    const ticketType = document.querySelector(`.${kebabCase(title)}-ticket-type`).value;
    const quantity = input.value;
    if(parseInt(quantity)){
      fetch('http://localhost:9090/orders',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          eventID:id,
          ticketCategoryID:+ticketType,
          numberOfTickets:+quantity
  
        })
      }).then((response)=>{
        return response.json().then((data)=>{
          if(!response.ok){
            console.log("ERROR ADDING!");
          }
          return data;
        })
      }).then((data)=>{
        console.log("Done!");
        input.value = 0;
        addToCart.disabled = true;
      })
    }else{
  
    }
  }