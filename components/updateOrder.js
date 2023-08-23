export function updateOrder(orderId, newType, newQuantity){
    return fetch(`https://localhost:7105/api/Order/PatchOrder`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            orderId:orderId,
            ticketcategoryId:newType,
            numberOfTickets:newQuantity,
        })
    }).then((res) => {
        if(res.status === 200){
            toastr.success("Success!");
        }
        else{
            toastr.error("Error!");
        }
        return res;
    }).catch((err) =>{
        throw new Error(err);
    });

}