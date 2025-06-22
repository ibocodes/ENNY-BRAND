let iconCart = document.querySelector(".icon-cart");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
let listProductHTML = document.querySelector(".listProduct");
let listCartHTML = document.querySelector(".listCart");
let iconcartSpan = document.querySelector(".icon-cart span");
let listProducts = [];
let carts = [];

// Load cart from localStorage on page load
if (localStorage.getItem("cart")) {
  carts = JSON.parse(localStorage.getItem("cart"));
}

if (iconCart) {
  iconCart.addEventListener("click", () => {
    body.classList.toggle("showCart");
  });
}
if (closeCart) {
  closeCart.addEventListener("click", () => {
    body.classList.toggle("showCart");
  });
}

// Add event listener only for the mobile cart icon on the home page
const mobileCartIcon = document.querySelector("#mobile-cart-icon");
if (mobileCartIcon) {
  mobileCartIcon.addEventListener("click", () => {
    body.classList.toggle("showCart");
  });
}

const addDataToHTML = () => {
  if (!listProductHTML) return;
  listProductHTML.innerHTML = "";
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
      <img src="${product.image}" alt="">
      <h2>${product.name}</h2>
      <div class="price">N${product.price}</div>
      <button class="addCart">
       Add to Cart
      </button>
      `;
      listProductHTML.appendChild(newProduct);
    });
  }
};

// Event listener for adding products to the cart
if (listProductHTML) {
  listProductHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains("addCart")) {
      let product_id = positionClick.parentElement.dataset.id;
      addToCart(product_id);
    }
  });
}

// Function to add a product to the cart
const addToCart = (product_id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity =
      carts[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
  localStorage.setItem("cart", JSON.stringify(carts));
};

// Function to save the cart to local storage
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

// Function to retrieve the cart from local storage
const addCartToHTML = () => {
  if (!listCartHTML) return;
  listCartHTML.innerHTML = ""; // Clear previous content
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity = totalQuantity + cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let positionProduct = listProducts.findIndex(
        (value) => value.id == cart.product_id
      );
      let info = listProducts[positionProduct];
      if (!info) return;
      newCart.innerHTML = `
          <div class="image">
            <img src="${info.image}" alt="">
          </div>
          <div class="name">
           ${info.name}
          </div>
          <div class="totalPrice">
           N${info.price * cart.quantity}
          </div>
          <div class="quantity">
            <span class="minus">-</span>
            <span>${cart.quantity}
            </span>
            <span class="plus">+</span>
          </div>
        `;
      listCartHTML.appendChild(newCart);
    });
  }
  // Update all cart icon counts (mobile and desktop)
  document.querySelectorAll(".icon-cart span").forEach((span) => {
    span.innerText = totalQuantity;
  });
};

// Event listener for updating the cart when clicking on plus or minus buttons
if (listCartHTML) {
  listCartHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (
      positionClick.classList.contains("minus") ||
      positionClick.classList.contains("plus")
    ) {
      let product_id = positionClick.closest(".item").dataset.id;
      let type = "minus";
      if (positionClick.classList.contains("plus")) {
        type = "plus";
      }
      changeQuantity(product_id, type);
    }
  });
}

// Function to change the quantity of a product in the cart
const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionItemInCart].quantity =
          carts[positionItemInCart].quantity + 1;
        break;

      default:
        let valueChange = carts[positionItemInCart].quantity - 1;
        if (valueChange > 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToMemory();
  addCartToHTML();
  localStorage.setItem("cart", JSON.stringify(carts));
};

// Function to initialize the application
const initApp = () => {
  //get data from json
  fetch("product.json")
    .then((response) => response.json())
    .then((data) => {
      listProducts = data;
      addDataToHTML();

      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    });
};
initApp();
