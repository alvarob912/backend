const filterResults = async(event, filter) => {
    if(filter){
        window.location.href = '/api/products?query=' + filter
    }else{
        window.location.href = '/api/products'
    }
}

const seeProduct = async (event, pid) => {
    window.location.href = '/product/' + pid
}

