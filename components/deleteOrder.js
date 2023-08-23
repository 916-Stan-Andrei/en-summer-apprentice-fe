export function deleteOrder(orderId){
    fetch(`https://localhost:7105/api/Order/DeleteOrder?id=${orderId}`,{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
        },
    }).then((res) => res.json())
    .then((data)=>{
        const purchasedToBeRemoved = document.getElementById(`purchase-${data.orderId}`);
        purchasedToBeRemoved.remove();
        toastr.success('Success!');
    })
    .catch((err) =>{
        console.error(err);
        toastr.error('Error!');
    })
    .finally(()=>{

    });
}