let iconCart=document.querySelector('.icon-cart');
let close=document.querySelector('.close-btn');
let body=document.querySelector('body');
let listProductHTML=document.querySelector('.list-products');
let listcartHTML=document.querySelector('.list-cart');
let iconCartSpan=document.querySelector('.icon-cart span');

let listProducts=[];
let carts=[];
iconCart.addEventListener('click',()=>{
    body.classList.toggle('showcart')
})
close.addEventListener('click',()=>{
    body.classList.toggle('showcart')
})

// 2.
const addDataToHTML=()=>{
    listProductHTML.innerHTML='';
    if(listProducts.length >0){
        listProducts.forEach(product => {
            let newproduct=document.createElement('div');
            newproduct.classList.add('item');
            newproduct.dataset.id=product.id;
            newproduct.innerHTML=`
             <img src="${product.image}">
             <h2>${product.name}</h2>
             <div class="price">$${product.price}</div>
             <button class="addtocart">Add to Cart</button>
            `;
            listProductHTML.appendChild(newproduct);
        });
    }
};

// 1.
const initApp=()=>{
    fetch('product.json')
    .then(response=>response.json())
    .then(data=>{
        listProducts=data;
        // console.log(listProduct)
        addDataToHTML();

        // get data from memory
        if(localStorage.getItem('cart')){
            carts=JSON.parse(localStorage.getItem('cart'));
            addcartToHTML();
        }
    })
}
initApp();

// 3.
listProductHTML.addEventListener('click',(event)=>{
    // console.log(event.target);
    // console.log(event.target.classList);
    if(event.target && event.target.classList.contains('addtocart')){
        let product_id=event.target.parentElement.dataset.id;
        addtoCart(product_id);
    }
})

// 5. 
const addcartToHTML=()=>{
    listcartHTML.innerHTML='';
    let totalQuantity=0;
    if(carts.length>0){
        carts.forEach(cart=>{
            totalQuantity+=cart.quantity;
            let newcart=document.createElement('div');
            newcart.dataset.id=cart.product_id;
            let productindex= listProducts.findIndex((value)=> value.id == cart.product_id);
            let info=listProducts[productindex];
            newcart.classList.add('item');
            newcart.innerHTML=`
            <div class="img">
                <img src="${info.image}">
            </div>
            <div class="name">
            ${info.name}    
            </div>
            <div class="price">
            $${info.price * cart.quantity}
            </div>
            <div class="quantity">
                <span class="minus">-</span> 
                <span>${cart.quantity}</span>
                <span class="add">+</span>
            </div>
            `;
            listcartHTML.appendChild(newcart);
        })
    }
    iconCartSpan.innerText=totalQuantity;
}


// 4. objects in arrays
const addtoCart=(product_id)=>{
    let positionThisProductInCart=carts.findIndex((value)=>value.product_id==product_id)
    if(carts.length<=0){
        carts=[{
            product_id:product_id,
            quantity:1
        }]
    }

    else if(positionThisProductInCart<0){
        carts.push({
            product_id:product_id,
            quantity:1
        })
    }
    else{
        carts[positionThisProductInCart].quantity=carts[positionThisProductInCart].quantity+1;
    }
    // console.log(cart);
    addcartToHTML();
    addcarttoMemory();
}

// 6.
const addcarttoMemory=()=>{
    localStorage.setItem('cart',JSON.stringify(carts));
}

// 7.
listcartHTML.addEventListener('click',(event)=>{
    let position=event.target;
    if(position.classList.contains('minus') || position.classList.contains('add')){
        let product_id=position.parentElement.parentElement.dataset.id;
        let type='minus';
        if(position.classList.contains('add')){
            type='add';
        }
        changeQuantity(product_id,type);
    }
})

// 8.
const changeQuantity=(product_id,type)=>{
   let positionincart=carts.findIndex((value)=>value.product_id==product_id);
   if(positionincart>=0){
    switch(type){
        case 'add':
            carts[positionincart].quantity=carts[positionincart].quantity+1;
            break;
        
        case 'minus':
            let valueChange=carts[positionincart].quantity-1;
            if(valueChange>0){
                carts[positionincart].quantity=valueChange;
            }   
            else{
                carts.splice(positionincart,1);
            }
            break;
        }
   }
   addcarttoMemory();
   addcartToHTML();
}