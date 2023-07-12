const cartBody = document.querySelector('.cart-container')
const cartList = document.querySelector('.cart-list')

const removeProduct = async (cid, pid) =>{
    await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'DELETE'
    }).then(() => {
        window.location.reload();
    });
}

const clearCart = async (cid) =>{
    await fetch(`/api/carts/${cid}`,{
        method: 'DELETE'
    })
    alert('Se limpio el carrito')
    .then(() => {
        window.location.reload();
    });
}



const seeTicketButton = async (tid) =>{
    const ticketButton = document.createElement('button')
    ticketButton.innerText = 'Ver comprobante'
    ticketButton.style.cursor = 'pointer'
    ticketButton.classList.add('see-ticket', 'waves-effect', 'waves-light', 'btn-small', 'indigo', 'darken-4')
    ticketButton.addEventListener('click', ()=>{
        window.location.pathname = `/ticket/${tid}`
    })
    cartBody.appendChild(ticketButton)
}


const purchase = async(cid) =>{
    await fetch(`/api/carts/${cid}/purchase`,{
        method: 'PUT'
    })
    .then(response => {
        if(response.ok){
            alert('Compra realizada exitosamente')
        }else{
            alert('Se produjo un problema al procesar su compra. Vuelva a intentarlo')
        }
        return response.json()
    })
    .then(response => {
        seeTicketButton(response.payload.newTicket._id)
    })
    cartList.remove()
}

