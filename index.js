const productContainer = document.getElementById("product-container");
const cardButton = document.getElementById("cart");
// ids of offcanvas
const offcanvas = document.getElementById("offcanvasRight");
const closeCart = document.getElementById("closeCart");
const cartContainer = document.getElementById("addToCartData");



let cart = [];
let totalCartPrice = 0; // Initialize total price

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    displayProduct(data);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display products on the landing page
function displayProduct(products) {
  productContainer.innerHTML = "";

  products.map((item) => {
    const productCard = document.createElement("div");
    productCard.classList.add("card");
    productCard.innerHTML = `
      <img src="${item.image}" class="product-image" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>₹${item.price}</p>
      <button class="add-to-cart-btn" 
        onclick="addToCart(${item.id}, '${item.title}', ${item.price}, '${item.image}')">
        Add to Cart
      </button>
    `;
    productContainer.appendChild(productCard);
  });
}

// Function to add products to cart
function addToCart(id, title, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Get existing cart data

  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart data
  showOffCanvasProducts();
}


// Show cart data in the offcanvas
function showOffCanvasProducts() {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; 
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p style='text-align:center; font-weight:bold;'>Cart is empty</p>";
    return;
  }

  let totalCartPrice = 0;//to grand total of all product

  cart.map((item, index) => {

    const totalPrice = (item.price * item.quantity);
    totalCartPrice += totalPrice

    const cardItem = document.createElement("div");
    cardItem.classList.add("cart-item");
    cardItem.innerHTML = `
      <div class="cart-item-content">
        <div class="main-content">
          <img src="${item.image}" class="cart-image" alt="${item.title}">
          <p class="cart-title">${item.title}</p>
        </div>
        <div class="cart-details">
          <p class="cart-price">Total:  ₹${totalPrice}</p>
          <div class="quantity-control">
            <button class="qty-btn" onclick="decreaseQuantity(${index})" ${item.quantity === 1 ? "disabled" : ""}>-</button>
            <span class="quantity">Quantity: ${item.quantity}</span>
            <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
            
          </div>
          <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
          <button class="openProduct" onclick="openProduct(${item.id})"> Open Product </button>
        </div>
      </div>
    `;
    cartContainer.appendChild(cardItem);
  });

  // Display the grand total of all products
  const totalPriceElement = document.createElement("p");
  totalPriceElement.style.fontWeight = "bold";
  totalPriceElement.style.color = "red";
  totalPriceElement.innerText = `Total is:  ₹${totalCartPrice}`;

  cartContainer.appendChild(totalPriceElement);
}

// Increase item quantity
function increaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  showOffCanvasProducts();
}

// Decrease item quantity
function decreaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  showOffCanvasProducts();
}

// Remove item from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  showOffCanvasProducts();
}

// Open the cart
cardButton.addEventListener("click", () => {
  offcanvas.classList.add("open");
});

// Close the cart
closeCart.addEventListener("click", () => {
  offcanvas.classList.remove("open");
});

// this is for open the product in the new page 
function openProduct(productId) {
  window.location.href = `product.html?id=${productId}`
}

// Fetch products on page load
fetchProducts();
showOffCanvasProducts(); 
