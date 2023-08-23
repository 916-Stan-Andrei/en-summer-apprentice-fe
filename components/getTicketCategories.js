export async function fetchTicketCategories(){
    const url = "https://localhost:7105/api/TicketCategory/GetTicketCategories";
    const response = await fetch(url);
    const ticketCategories = await response.json();
    return ticketCategories;
}