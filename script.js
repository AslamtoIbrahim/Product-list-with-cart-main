const dessertes = document.getElementById('dessertes');
const addCart = document.getElementById('addCart');
const crement = document.getElementById('crement');
const decrement = document.getElementById('decrement');
const increment = document.getElementById('increment');
const howMany = document.getElementById('how-many');
var quantityOneProduct = 0;
const itemList = []; // list of items with images, names, categories and  prices
const imagesUrls = []; // list of images that would be changed by the resize function updateImagesWidth()
const productList = []; // has relation with product object class Product list
const clonesCart = []; // has relation with beside or below table added items
const selectedItems = []; // has relation with selected items list add cart


fetch('data.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            let urlImage = '';
            if (window.innerWidth > 800) {
                urlImage = item.image.desktop;
            } else if (window.innerWidth < 800 && window.innerWidth > 500) {
                urlImage = item.image.tablet;
            } else {
                urlImage = item.image.mobile;
            }
            const itemInstant = addItem(urlImage, item.category, item.name, item.price);
            setOnclicks(itemInstant, item);
            itemList.push(itemInstant);
            imagesUrls.push(item.image);
        });
    })
    .catch(error => console.error('⛔ Error : ', error));

updateImagesWidth();


function updateImagesWidth() {
    window.addEventListener('resize', () => {

        if (!itemList || itemList.length === 0) {
            console.error("itemInstants is not defined or empty.");
            return;
        }

        itemList.forEach((item, index) => {
            const image = item.querySelector('.itemImage');
            if (!image) {
                console.error(`No .itemImage found in item at index ${index}`);
                return;
            }

            const width = window.innerWidth;
            console.log(`Updating image at index ${index} for width: ${width}`);



            if (width > 800) {
                image.src = imagesUrls[index]?.desktop || '';
            } else if (width <= 800 && width > 500) {
                image.src = imagesUrls[index]?.tablet || '';
            } else {
                image.src = imagesUrls[index]?.mobile || '';
            }
        });
    });
}




function addItem(imageSrc, categoryData, nameData, priceData) {
    const newItem = document.getElementById('item').cloneNode(true);
    newItem.style.display = 'flex';
    newItem.querySelector('.itemImage').src = imageSrc;
    newItem.querySelector('.category').textContent = categoryData;
    newItem.querySelector('.name').textContent = nameData;
    newItem.querySelector('.price').textContent = "$" + priceData.toFixed(2);
    dessertes.appendChild(newItem);
    return newItem;
}


function setOnclicks(itemInstant, item) {
    if (!itemInstant) {
        console.error("the itemInstant is undefined or null");
        return;
    }
    if (!item) {
        console.error("the item is undefined or null");
        return;
    }
    // add the first item to the list
    itemInstant.querySelector('.addCart').addEventListener('click', function (e) {
        const productChoised = new Product(item.image.thumbnail, item.name, item.price, 1);
        productList.push(productChoised);
        selectedItems.push(itemInstant);
        incrementProduct(itemInstant, productChoised.quantity);
        showIncrementDecrement(itemInstant);
        const cartItem = addCartResults(productChoised);
        deleteCartItem(cartItem);
    });
    // add the second item to the list by incrementing +
    itemInstant.querySelector('.increment').addEventListener('click', function (e) {
        const product = productList.find(p => p.name === item.name);
        if (!product) {
            console.log('⛔ Something went wrong with increment button ➕');
            return;
        }

        product.quantity++;
        incrementProduct(itemInstant, product.quantity);
        updateCartResults(product);
        console.log('✅ The product was incremented successfully.');

    });
    // minus the last item from the list by decrementing - 0 
    itemInstant.querySelector('.decrement').addEventListener('click', function (e) {
        const product = productList.find(p => p.name === item.name);
        if (!product) {
            console.log('⛔ Something went wrong with decrement button ➖');
            return;
        }

        product.quantity--;
        decrementProduct(itemInstant, product.quantity);
        updateCartResults(product);

        console.log('✅ the product was decremented successfully.');


        if (product.quantity == 0) {
            const index = productList.findIndex(p => p.name === item.name);
            if (index == -1) {
                console.log('⛔ The product was not found in the productList');
                return;
            }

            productList.splice(index, 1);
            hideIncrementDecrement(itemInstant);
            removeCartResults(index);
            selectedItems.splice(index, 1);
            console.log('✅ The product was removed from productList successfully');
        }
    });
}

function showIncrementDecrement(itemInstant) {
    if (!itemInstant) {
        console.error("⛔ the itemInstant is undefined or null when increment and decrement are pressing");
        return;
    }
    itemInstant.querySelector('.crement').style.display = 'flex';
    itemInstant.querySelector('.addCart').style.display = 'none';
    itemInstant.querySelector('.itemImage').style.borderWidth = '2px';
}
function hideIncrementDecrement(itemInstant) {
    if (!itemInstant) {
        console.error("⛔ the itemInstant is undefined or null when increment and decrement are hiding");
        return;
    }
    itemInstant.querySelector('.crement').style.display = 'none';
    itemInstant.querySelector('.addCart').style.display = 'flex';
    itemInstant.querySelector('.itemImage').style.borderWidth = '0px';

}


function incrementProduct(itemInstant, quantity) {
    if (!itemInstant) {
        console.error("⛔ the itemInstant is undefined or null when increment is clciked");
        return;
    }
    itemInstant.querySelector('.howmany').textContent = quantity;
}
function decrementProduct(itemInstant, quantity) {
    if (!itemInstant) {
        console.error("⛔ the itemInstant is undefined or null when decrement is clicked");
        return;
    }
    itemInstant.querySelector('.howmany').textContent = quantity;
}

function addCartResults(item) {
    if (!item) {
        console.error("the item is undefined or null when adding cart results");
        return;
    }
    const empty = document.getElementById('empty');
    const full = document.getElementById('full');
    const tableItems = document.getElementById('tableItems');
    const totalPriceTotalFinal = document.getElementById('totalPriceTotalFinal');

    const cartItem = document.getElementById('itemSection').cloneNode(true);
    cartItem.style.display = 'block';
    cartItem.querySelector('.total-name').textContent = item.name;
    cartItem.querySelector('.total-quantity').textContent = "x" + item.quantity;
    cartItem.querySelector('.total-price').textContent = "$" + item.price.toFixed(2);
    totalPrice += item.price * item.quantity;
    cartItem.querySelector('.total-price-total').textContent = "$" + (item.price * item.quantity).toFixed(2);
    tableItems.appendChild(cartItem);
    clonesCart.push(cartItem);

    totalPriceTotalFinal.textContent = "$" + sumUpTotal().toFixed(2);
    empty.style.display = 'none';
    full.style.display = 'block';
    return cartItem;
}

function sumUpTotal() {
    if (productList.length === 0 || !productList) {
        console.log("⛔ error: productList is empty or undifined!");
        return 0;
    }
    let totalPrice = 0;
    productList.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    return totalPrice;
}

function updateCartResults(product) {
    if (!product) {
        console.log("⛔ the product is not available yet");
        return;
    }
    const productIndex = productList.findIndex(item => item.name == product.name);

    if (productIndex == -1) {
        console.log("⛔error: index is not found in product list so we could not update the cart results");
        return;
    }
    const oldClone = clonesCart[productIndex];
    oldClone.querySelector('.total-quantity').textContent = "x" + product.quantity;
    oldClone.querySelector('.total-price-total').textContent = "$" + (product.price * product.quantity).toFixed(2);
    updateTotal();
}

function updateTotal() {
    const totalPriceTotalFinal = document.getElementById('totalPriceTotalFinal');
    totalPriceTotalFinal.textContent = "$" + sumUpTotal().toFixed(2);
}

function removeCartResults(index) {
    if (!clonesCart || clonesCart.length === 0) {
        console.error("clonesCart is not defined or empty.");
        return;
    }
    if (index == -1) {
        console.error("index is not defined or empty.");
        return;
    }
    clonesCart[index].style.display = 'none';
    clonesCart.splice(index, 1);
    if (clonesCart.length == 0) {
        const empty = document.getElementById('empty');
        const full = document.getElementById('full');
        empty.style.display = 'flex';
        full.style.display = 'none';
    }

}

function deleteCartItem(cartItem) {
    if (!cartItem) {
        console.error("cartItem is undefined or null so we can not delete cart item");
        return;
    }
    cartItem.querySelector('.remove-item').addEventListener('click', function (e) {
        const index = clonesCart.findIndex(item => item.isEqualNode(cartItem));
     
        if (index == -1) {
            console.log('⛔ error : the clone cart item was not deleted');
            return;
        }

        removeCartResults(index);
        hideIncrementDecrement(selectedItems[index]);
        selectedItems.splice(index, 1);
        productList.splice(index, 1);
        updateTotal();
        console.log('✅ The clone cart item was deleted successfully');
    });
}


function confirmOrder() {

    if (productList.length == 0 || !productList) {
        console.error("error: productList is empty or undifined!");
        return;
    }

    fetch('dialog.html')
        .then(response => response.text())
        .then(html => {
            if (!productList || productList.length ==0) {
                console.log("⛔ The productList is empty or undefined");
                return;
            }
            const dialog = document.getElementById('myDialog');
            dialog.innerHTML = html;
            const tableListView = document.getElementById('itemTableView');
            productList.forEach(item => {
                const itemView = document.getElementById('itemView').cloneNode(true);
                itemView.style.display = 'block';
                itemView.querySelector('.thumbnail').src = item.imageThumbnail;
                itemView.querySelector('.final-name').textContent = item.name;
                itemView.querySelector('.final-quantity').textContent = "x" + item.quantity;
                itemView.querySelector('.final-price').textContent = "@$" + item.price.toFixed(2);
                itemView.querySelector('.final-total-price').textContent = "$" + (item.quantity * item.price).toFixed(2);
                tableListView.appendChild(itemView);
            });

            const totalPriceDialog = document.getElementById('finalTotalPrice');
            totalPriceDialog.textContent = "$" + sumUpTotal().toFixed(2);
            const startNewOrder = document.getElementById('startNewOrder');


            startNewOrder.addEventListener('click', function (e) {
                clearLists();
                console.log('🤩 StartNewOrder clicked');
                dialog.close();
            });


            dialog.showModal();
        })
        .catch(error => console.error('⛔ error: ', error));

}

// this function cleans up all lits of the clonesCart, selectedItems and productList
function clearLists() {
    for (let index = clonesCart.length - 1; index >= 0; index--) {
        removeCartResults(index);
        hideIncrementDecrement(selectedItems[index]);
        selectedItems.splice(index, 1);
        productList.splice(index, 1);
    }


}


class Product {
    constructor(imageThumbnail, name, price, quantity) {
        this.imageThumbnail = imageThumbnail;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}

 

