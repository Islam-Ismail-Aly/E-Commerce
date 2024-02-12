function getProductDataFromURL() {
   let urlParams = new URLSearchParams(window.location.search);
   let productData = urlParams.get('data');
   
   // Decode and parse the product data
   return productData ? JSON.parse(decodeURIComponent(productData)) : null;
}

let productData = getProductDataFromURL();

if (productData) 
{

   // set product details, title & description
   document.getElementById('productName').innerText = productData.title;
   document.getElementById('productDescription').innerText = productData.description;

   // set product image
   let productImage = document.getElementById('productImage');
   productImage.src = productData.image;
   productImage.alt = productData.title;

   // set product rating
   let productRating = document.getElementById('productRating');
   productRating.innerHTML = `Rating: ${productData.rating.rate} <i class="fa fa-star text-warning" aria-hidden="true"></i>`;

   let productReview = document.getElementById('productReview');
   productReview.innerHTML =`Reviews: ${productData.rating.count} reviews <i class="fa fa-smile-o text-danger" aria-hidden="true"></i>`;

   // set product price
   let productPrice = document.getElementById('productPrice');
   productPrice.innerText = `Price: ${productData.price}`;
} 
else 
{
   console.error('Product data not found in the URL.');
}

const container = document.getElementById('lottie-container');

if (container && typeof lottie !== 'undefined') {
  fetch('AnimationShopping.json')
    .then(response => response.json())
    .then(animationData => {
      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    })
    .catch(error => {
      console.error('Error loading animation data:', error);
    });
} 
else {
  console.error("Container element not found or Lottie library not loaded.");
}
