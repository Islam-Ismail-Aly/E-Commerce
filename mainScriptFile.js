let products;

// #region base section | Scroll Button & CurrentYear

document.addEventListener("DOMContentLoaded", function () 
{
   var scrollToTopBtn = document.getElementById("scrollToTopBtn");


   window.onscroll = function () 
   {
       if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) 
       {
           scrollToTopBtn.style.display = "block";
       } 
       else 
       {
           scrollToTopBtn.style.display = "none";
       }
   };

   scrollToTopBtn.addEventListener("click", function () 
   {
       document.documentElement.scrollTop = 0;
   });

   //#region Current Year
   var currentYear = document.getElementById('currentYear');
   console.log('currentYear', currentYear);
   currentYear.textContent = new Date().getFullYear();
   //#endregion

});

//#endregion

// #region Loader

document.addEventListener("DOMContentLoaded", function () {

  // Simulate content loading
  setTimeout(function () {
      // Hide the loader
      document.getElementById('loader').style.display = 'none';

      // Show the main content
      document.getElementById('main-content').style.display = 'block';

  }, 2200);

  // update card count
  let cardCount = document.getElementById('card-count');
  cardCount.innerText = cartItems.length;

  let cart = document.getElementById('cartContainerDisplay');
  emptyProductDisplay(cart);

});

//#endregion

// #region Consume API Products | fetchData

async function fetchData() {
    let response = await fetch("https://fakestoreapi.com/products");
    let data = await response.json();
    products = data;
    return data;
}

//#endregion

// #region get cart items | retrive the data from local storage

function getCartItems() {

  // Retrieve items from localStorage
  let items = JSON.parse(localStorage.getItem('cartItems'));

  // catch the card count element
  let cardCount = document.getElementById('card-count');

  // set the card count
  cardCount.innerText = items.length;

  // passing the items to the function after retrive it form local storage
  displayCartItems(items);
}

//#endregion

// #region initialize Application

async function initializeApp() {
  try 
  {
    await fetchData(); 
    getCartItems();   
  } 
  catch (error) 
  {
    console.error("Error initializing:", error);
  }
}

//#endregion

// #region when the document is loaded

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

//#endregion

// #region display cart items into cart page

function displayCartItems(items) {
  console.log("Displaying cart items:", items);
  
  let cartContainerDisplay = document.getElementById('cartContainerDisplay');
  let totalAmount = 0;

  // Clear previous content in the cart container
  cartContainerDisplay.innerHTML = '';

  if (items && items.length > 0) {
    items.forEach((item) => {

      let cardItem = document.createElement('div');
      cardItem.classList.add('col', 'mb-4', 'mt-5', 'card-container');

      let itemQuantity = 1;

      const cardContent = `
        <div class="card h-100 shadow rounded-4">
          <img src="${item.image}" class="card-img-top rounded-top-4 product-img" alt="Product Image">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${item.title}</h5>
            <div class="d-flex my-2">
              <div class="bg-light p-2 rounded-pill">
                ${generateRatingStars(item.rating.rate)}
                <span class="badge bg-success ms-1 rounded-pill">${item.rating.rate}</span>
              </div>
            </div>
            <p class="card-text text-muted smaller-text">${item.category}</p>
            <span class="h5 mb-0 text-gray">${item.price} <i class="fa fa-usd text-success" aria-hidden="true"></i></span>
            <div class="d-flex my-2">
            <div class="bg-light p-2 rounded-pill">
              <span class="me-2">Quantity:</span>
              <div class="icon-container" onclick="updateQuantity('${item.id}', 'increase', ${item.price})">
                <i class="fa fa-plus-square" aria-hidden="true"></i>
              </div>
              <span class="mx-2" id="quantity-${item.id}">${itemQuantity}</span>
              <div class="icon-container" id="minus-btn" onclick="updateQuantity('${item.id}', 'decrease', ${item.price})">
                  <i class="fa fa-minus-square" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-end mt-2">
                <i class="fa fa-trash-o btn btn-danger btn-sm ms-2" aria-hidden="true" onclick="deleteItem('${item.id}', ${item.price})"></i>
            </div>
              <div class="flex-grow-1"></div> <!-- Spacer to push the button to the bottom -->
          </div>
        </div>
      `;

      totalAmount += item.price * itemQuantity;

      cardItem.innerHTML = cardContent;
      cartContainerDisplay.appendChild(cardItem);
    });
  } else {
    emptyProductDisplay(cartContainerDisplay);
  }

  // Create a div for the hr with full width
  const hrContainer = document.createElement('div');
  hrContainer.style.width = "100%";
  hrContainer.innerHTML = '<hr>';

  cartContainerDisplay.appendChild(hrContainer); // Append hrContainer to cartContainerDisplay

  // Add the total price section
  const totalSection = document.createElement('div');
  totalSection.classList.add('mt-4', 'text-start', 'col-12');
  totalSection.innerHTML = `
    <div>
      <span class="text-gray">Total Price: <span id="totalAmount">${totalAmount.toFixed(2)}</span> <i class="fa fa-usd text-success" aria-hidden="true"></i></span>
    </div>
    <button class="custom-btn secondary-btn mt-3" onclick="confirmPayment()">Confirm Payment <i class="fa fa-credit-card-alt text-warning" aria-hidden="true"></i></button>
  `;

  cartContainerDisplay.appendChild(totalSection);
}



//#endregion

// #region empty product display

function emptyProductDisplay(cart){

   // If there are no items in the cart, display a message
   cart.innerHTML = `
   <div class="bg-danger-subtle p-2 rounded-square rounded-3 my-5">
     <i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i><span>  No products in your cart yet! </span>
   </div>`;
}

// #endregion

// #region update quantity 

function updateQuantity(itemId, action, itemPrice) {
  const quantityElement = document.getElementById(`quantity-${itemId}`);
  let itemQuantity = parseInt(quantityElement.textContent);

  //let minusbtn = document.getElementById("minus-btn");

  if (action === 'increase') 
  {
    itemQuantity += 1;
  } 
  else if (action === 'decrease' && itemQuantity > 1) 
  {
    itemQuantity -= 1;
    // minusbtn.disabled = false;
    // minusbtn.classList.remove('disabled');
  } 
  else if (action === 'decrease' && itemQuantity == 1) 
  {
    // If the quantity is 1 and it's being decreased, remove the item from the cart
    deleteDecreasedItem(itemId);
    
    // minusbtn.disabled = true;
    // minusbtn.classList.add('disabled');
    
  }

  quantityElement.textContent = itemQuantity;
  updateTotalAmount(itemPrice, action, itemQuantity);
}


//#endregion

// #region Update total amount based on quantity changes

function updateTotalAmount(itemPrice, action, itemQuantity) {

  const totalAmountElement = document.getElementById('totalAmount');
  let totalAmount = parseFloat(totalAmountElement.textContent);

  //let minusbtn = document.getElementById("minus-btn");

  if (action === 'increase') 
  {
    totalAmount += itemPrice;
  }
  else if (action === 'decrease' && itemQuantity > 1) 
  {
    totalAmount -= itemPrice;
    // minusbtn.disabled = false;
    // minusbtn.classList.remove('disabled');
  }
  else if (action === 'decrease' && itemQuantity == 1) 
  {
    // If the quantity is 1 and it's being decreased, remove the item from the cart
    deleteDecreasedItem(itemId);
    
    // minusbtn.disabled = true;
    // minusbtn.classList.add('disabled');
  }

  totalAmountElement.textContent = totalAmount.toFixed(2);
}

//#endregion

// #region delete item from local storage

function deleteItem(itemId, itemPrice) {

  swal({
      title: "Are you sure?",
      text: "Once deleted, you won't be able to recover this item!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
  })
  .then((willDelete) => {
      if (willDelete) {
          console.log("Deleting item:", itemId);

          // Remove the item from local storage
          let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
          const updatedCartItems = cartItems.filter(item => item.id != itemId);
          localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

          // console.log("After deleting item:", localStorage.getItem('cartItems'));
          // console.log("After update cart item:", updatedCartItems);

          // Update the displayed cart
          displayCartItems(updatedCartItems);

          swal("The item has been deleted!", {
              icon: "success",
              timer: 2000,  // Adjust the timer as needed
              buttons: false
          });

          let cardCount = document.getElementById('card-count');

          // set the card count
          cardCount.innerText = cartItems.length-1;

      } else {
          swal("The item is safe!", {
              icon: "info",
              timer: 2000,  // Adjust the timer as needed
              buttons: false
          });
      }
  });
}

//#endregion

// #region delete item after decreased == 0

function deleteDecreasedItem(itemId, itemPrice) {

    //console.log("Deleting item:", itemId);

    // Remove the item from local storage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = cartItems.filter(item => item.id != itemId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    // console.log("After deleting item:", localStorage.getItem('cartItems'));
    // console.log("After update cart item:", updatedCartItems);

    // Update the displayed cart
    displayCartItems(updatedCartItems);


    let cardCount = document.getElementById('card-count');

    // set the card count
    cardCount.innerText = cartItems.length-1;
}

// #endregion

// #region fetchdata in window onload
//window.onload = fetchData;

window.onload = function () {
  fetchData().then(data => {
      data.forEach(product => {
          displayProduct(product);
      });
  });
};

//#endregion

// #region display product

   function displayProduct(product){

       let productContainer = document.getElementById('productContainer');

       // Create HTML elements dynamically
       let card = document.createElement('div');

       // set bootstrap classes into the div that holds the cards
       card.classList.add('col', 'mb-4', 'mt-5', 'card-container');
   
       const cardContent = `
       <div class="card h-100 shadow rounded-4">
           <img src="${product.image}" class="card-img-top rounded-top-4 product-img" alt="Product Image">
           <div class="card-body d-flex flex-column">
           <h5 class="card-title">${product.title}</h5>
           <div class="d-flex my-2">
           <div class="bg-light p-2 rounded-pill">
              ${generateRatingStars(product.rating.rate)}
               <span class="badge bg-success ms-1 rounded-pill">${product.rating.rate}</span>
           </div>
           </div>
           <p class="card-text text-muted smaller-text">${product.category}</p>
           <span class="h5 mb-0 text-gray"><i class="fa fa-usd text-success" aria-hidden="true"></i> ${product.price}</span>
           <span class="h6 mb-0 text-gray my-2 smaller-text">Count: ${product.rating.count}</span>
           <div class="flex-grow-1"></div> <!-- Spacer to push the button to the bottom -->
             <div class="mt-2 text-center">
               <button class="btn btn-outline-danger rounded-pill mb-3 add-to-cart" onclick="addToCart(${product})">
                   <i class="fa fa-cart-plus me-2" aria-hidden="true"></i>Add to Cart
               </button>
             </div>
           </div>
       </div>
       `;
       // Update the card html with the card content
       card.innerHTML = cardContent;

       productContainer.appendChild(card);

       // catch the card image
       let cardImage = card.querySelector('.product-img');

       cardImage.addEventListener('click', function (event) {
           event.stopPropagation(); // Prevent the card's click event from being triggered
   
           // Convert product data to JSON and encode it in the URL
           let productData = encodeURIComponent(JSON.stringify(product));
   
           window.location.href = `productDetails.html?data=${productData}`;
       });

       // catch the add to cart btn
       let addToCartButton = card.querySelector('.add-to-cart');

        addToCartButton.addEventListener('click', function () {

          // sweet alert 
          swal({
            title: "The Product Added to Cart",
            text: product.title + " is now in the cart",
            icon: "success",
            timer: 2200,
          });

          // passing the product data to this function and button to disable it
          addToCart(product, addToCartButton);
        });
   }
   
  //#endregion

// #region Add product to cart

  // global varaiable to contains the all card items
  let cartItems = [];

  function addToCart(product, addToCartButton) {

    let cardCount = document.getElementById('card-count');

    // Check if the product is already in the cart
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) 
    {
      // Increment the quantity if the product is already in the cart
      existingItem.quantity += 1;
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } 
    else {
      // Add the product to the cart with a quantity of 1
      cartItems.push({ ...product, quantity: 1 });

      // Use local storage to set item in it
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    // set cart count 
    cardCount.innerText = cartItems.length;

    // disable the add cart btn after clicked
    addToCartButton.disabled = true;
    addToCartButton.classList.add('disabled');

    // console.log('Product:', product);
    // console.log('Existing Item:', existingItem);
    // console.log('Cart Items:', cartItems);
}

//#endregion

// #region Filter Products by category

function filterByCategory(category) {
  // Clear existing products
  document.getElementById('productContainer').innerHTML = '';

  // Fetch data and display products based on the selected category
  fetchData().then(data => {
      data.forEach(product => {
          if (product.category === category || category === 'All') {
              displayProduct(product);
          }
      });
  });
}

//#endregion

// #region generateRatingStars
function generateRatingStars(rate) 
{
    // let starCount = Math.round(rate);
    let i = 0;
    let starCount = Math.floor(rate);
    let fraction = rate - starCount;
    let starsHtml = '';

    for (i; i < starCount; i++) 
    {
        if (i < starCount) 
        {
            starsHtml += '<i class="fa fa-star text-warning" aria-hidden="true"></i>';
        }
    }

    if(fraction >= 0.5)
    {
      starsHtml += '<i class="fa fa-star-half-o text-warning" aria-hidden="true"></i>';
    }

    for(i; i < 5; i++)
    {
        if(i > starCount)
        {
            starsHtml += '<i class="fa fa-star-o text-warning" aria-hidden="true"></i>';
        }
    }

    return starsHtml;
}
//#endregion

// #region Slider Images
let sliderImages = document.querySelectorAll(".slide"),
  arrowLeft = document.querySelector("#arrow-left"),
  arrowRight = document.querySelector("#arrow-right"),
  current = 0;

// Clear all images
function reset() {
  for (let i = 0; i < sliderImages.length; i++) {
    sliderImages[i].style.display = "none";
  }
}


function startSlide() {
  reset();
  sliderImages[0].style.display = "block";
}


function slideLeft() {
  reset();
  if (current === 0) {
    current = sliderImages.length;
  }
  sliderImages[current - 1].style.display = "block";
  current--;
}


function slideRight() {
  reset();
  if (current === sliderImages.length - 1) {
    current = -1;
  }
  sliderImages[current + 1].style.display = "block";
  current++;
}


arrowLeft.addEventListener("click", function () {
  slideLeft();
});


arrowRight.addEventListener("click", function () {
  slideRight();
});

function autoSlide() {
  slideRight();
  setTimeout(autoSlide, 4000); 
}

// Start the slider automatically

startSlide();
autoSlide();


//#endregion 

// #region validate contact us form page

function validateForm() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  // Regular expression for a valid name (only letters and spaces)
  var nameRegex = /^[a-zA-Z\s]+$/;

  // Regular expression for a valid email
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameRegex.test(name)) 
  {
      swal({
        title: "Invalid Name",
        text: "Please enter a valid name (letters and spaces only).",
        icon: "error",
        timer: 2000,
        buttons: false
    });

    return false;
  }

  if (!emailRegex.test(email)) 
  {
      swal({
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        icon: "error",
        timer: 2000,
        buttons: false
    });

    return false;
  }

  if (message === "") 
  {
      swal({
        title: "Invalid Message",
        text: "Please enter a message.",
        icon: "error",
        timer: 2000,
        buttons: false
    });

    return false;
  }

  // Add additional validation logic if needed

  return true;
}

// #endregion

// #region confirm payment

function confirmPayment() {
  // Get the current cart items from local storage
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  let cardCount = document.getElementById('card-count');
  let numberOfProducts = cartItems.length;
  cardCount.innerText = numberOfProducts;

  if(numberOfProducts > 0)
  {
      // Display SweetAlert to confirm payment
      swal({
        title: "Confirm Payment",
        text: `Are you sure you want to confirm your payment and proceed with the order for ${numberOfProducts} product(s)?`,
        icon: "info",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "",
            closeModal: true,
          },
          confirm: {
            text: "Confirm",
            value: true,
            visible: true,
            className: "",
            closeModal: true,
          }
        },
      }).then((confirmed) => {
        if (confirmed) {
          // Order is confirmed, show success message and update UI
          swal("Payment Confirmed!", `Your order for ${numberOfProducts} product(s) has been shipped.`, "success");

          // Remove cart products from view and local storage
          clearCart();

          // Display in-cart design that the order is being shipped
          displayShippingStatus();
        }
      });
  }
  else
  {
    swal({
      title: "The cart is empty!",
      text: "The Number of products is " + numberOfProducts,
      icon: "error",
      timer: 2300,
    });
  }

}

// #endregion

// #region clear cart and local storage

function clearCart() {
  let cartContainerDisplay = document.getElementById('cartContainerDisplay');
  cartContainerDisplay.innerHTML = '';
  localStorage.removeItem('cartItems');

  let cardCount = document.getElementById('card-count');

  // set the card count
  cardCount.innerText = cartItems.length;
}

// #endregion

// #region display shipping status

function displayShippingStatus() {
  let cartContainerDisplay = document.getElementById('cartContainerDisplay');

  cartContainerDisplay.innerHTML = '';
  

  const shippingStatusElement = document.createElement('div');
  shippingStatusElement.classList.add('bg-success-subtle', 'p-2', 'rounded-square', 'rounded-3', 'my-5');

  shippingStatusElement.innerHTML = `
    <i class="fa fa-check-circle text-success" aria-hidden="true"></i>
    <span class="ms-2">Your order is on its way! Thank you for shopping with us.</span>
  `;

  cartContainerDisplay.appendChild(shippingStatusElement);
}

// #endregion



