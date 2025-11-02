const headerEl = document.querySelector("header");
const pageList = Array.from(document.querySelectorAll("main section"));

console.log(pageList);

const headLogo = headerEl.querySelector(".head-logo h1");

headLogo.addEventListener("click", () => {
  showPages("home");
});

function showPages(pageId = "home") {
  pageList.forEach((pages) => {
    pages.style.display = pages.id === pageId ? "block" : "none";
  });
}

showPages("home");

const menuList = headerEl.querySelectorAll("nav ul li");
console.log(menuList);

menuList.forEach((item) => {
  item.addEventListener("click", () => {
    const pageId = item.dataset.id;
    showPages(pageId);
  });
});

const clickBtn = headerEl.querySelector("#click");

clickBtn.addEventListener("click", () => {
  headerEl.classList.toggle("open");
});

// console.log(products);

let selectedProduct = {};
async function fetchData() {
  try {
    const response = await fetch("asset/dressdata.json");
    const data = await response.json();
    console.log(data);
    selectedProduct = data;
    displayItemQty();
    //   console.log(selectedProduct);
    displayCard(selectedProduct.westernWear);
  } catch (err) {
    console.log(err);
  }
}

fetchData();

const main = document.querySelector("main");

const homeBtn = main.querySelector("#home .about-home .about-details button");

homeBtn.addEventListener("click", () => {
  showPages("products");
});

// For dropdown at 576px in products

const aside = main.querySelector("#products aside");
const clickBtnDrop = aside.querySelector("#click");

clickBtnDrop.addEventListener("click", () => {
  aside.classList.toggle("active");
});

const productList = main.querySelectorAll("#products aside nav ul li");
console.log(productList);

function displayItemQty() {
  productList.forEach((list) => {
    // console.log(list);
    const listId = list.dataset.id;
    const span = list.querySelector("span");
    span.textContent = `(${selectedProduct[listId].length})`;
  });
}

productList.forEach((list) => {
  list.addEventListener("click", () => {
    const listId = list.dataset.id;

    if (selectedProduct[listId]) {
      displayCard(selectedProduct[listId]);
    }

    // const span = list.querySelector("span")
    // span.style.display = span.style.display === "none" ? "flex" : "none";
    // span.textContent = `(${selectedProduct[listId].length})`;
  });
});

let cartItem = JSON.parse(localStorage.getItem("Cart")) || [];
let detailsItem = JSON.parse(localStorage.getItem("Details")) || {};

function displayCard(products) {
  const productPage = main.querySelector("#products article");

  productPage.innerHTML = `
${products
  .map(
    (item, idx) => `
    <figure>
        <div class="image-container">
            <img src="${item.images[0].url}" alt="">
        </div>
        <figcaption>
            <table>
                <tbody>
                    <tr>
                        <th>Name: </th>
                        <td>${item.name}</td>
                    </tr>
                    <tr>
                        <th>Brand: </th>
                        <td>${item.brand}</td>
                    </tr>
                    <tr>
                        <th>Availability: </th>
                        <td style="color:${
                          item.inStock === true ? "green" : "red"
                        }">${item.availability}</td>
                    </tr>
                    <tr>
                        <th>Price: </th>
                        <td>$ ${item.price}</td>
                    </tr>
                </tbody>
            </table>
            <div class="buttons">
                <button class="add-to-cart" data-items="${idx}">Add</button>
                <button class="view-details" data-items="${
                  item.id
                }">View Details</button>
            </div>
        </figcaption>
    </figure>
`
  )
  .join("")}
`;

  const addToCartBtn = productPage.querySelectorAll(".add-to-cart");

  addToCartBtn.forEach((item) => {
    item.addEventListener("click", () => {
      const cartId = item.dataset.items;
      cartItem.push(products[cartId]);
      // displayCard(cartItem)
      localStorage.setItem("Cart", JSON.stringify(cartItem));
      displayCartItem(cartItem);
    });
  });

  const viewDetailsBtn = productPage.querySelectorAll(".view-details");

  viewDetailsBtn.forEach((item) => {
    item.addEventListener("click", () => {
      showPages("viewDetails");
      const viewId = parseInt(item.dataset.items);
      detailsItem = products.find((finItem) => finItem.id === viewId);
      localStorage.setItem("Details", JSON.stringify(detailsItem));
      displayDetailsItem(detailsItem);
    });
  });

  searchQuery(products);
}

// Search Query

const searchBar = headerEl.querySelector("input");
function searchQuery(products) {
  searchBar.addEventListener("input", (e) => {
    e.preventDefault();

    const query = e.target.value.toLowerCase().trim();

    const selProduct = products.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.availability.toLowerCase().includes(query)
      );
    });
    // console.info(selProductArr);
    showPages("products");
    displayCard(selProduct);
  });
}

const cart = document.querySelector("#cart");

const cartEl = headerEl.querySelector(".cart-icon li");

cartEl.addEventListener("click", () => {
  cart.style.display = cart.style.display === "none" ? "block" : "none";
});

const cartCloseBtn = cart.querySelector("table thead tr th button");

cartCloseBtn.addEventListener("click", () => {
  cart.style.display = cart.style.display === "block" ? "none" : "block";
});

const cartTbody = cart.querySelector("tbody");
function displayCartItem(cartItem) {
  cartTbody.innerHTML = `
${cartItem
  .map(
    (item, idx) => `
   
        <tr>
            <td>
                <div class="cart-image">
                    <img src="${item.images[0].url}" alt="">
                </div>
            </td>
            <td>
                <p>${item.name}</p>
                <div class="cart-btn">
                    <button onclick="handleIncrease(${item.id})">+</button>
                    <span>${item.qty || 1}</span>
                    <button onclick="handleDecrease(${item.id})">-</button>
                </div>
            </td>
            <td>$${((item.qty || 1) * item.price).toFixed(2)}</td>
            <td>
                <button onclick="handleDelete(${item.id})">Delete</button>
            </td>
        </tr>

 `
  )
  .join("")}
`;
  itemTotalPrice();
}

displayCartItem(cartItem);

const detailsPage = main.querySelector("#viewDetails");
const productDetails = detailsPage.querySelector(".product-details");

function displayDetailsItem(detailsItem) {
  productDetails.innerHTML = `
    <h1>Product Details</h1>

    <figure>
      <div class="details-image">
        <img src="${detailsItem.images[0].url}" alt="">
      </div>
      <figcaption>
        <table>
          <tbody>
            <tr>
              <th>Description: </th>
              <td>${detailsItem.description}</td>
            </tr>
            <tr>
              <th>Rating: </th>
              <td>${detailsItem.rating}</td>
            </tr>
            <tr>
              <th>Company: </th>
              <td>${detailsItem.company}</td>
            </tr>
            <tr>
              <th>Country: </th>
              <td>${detailsItem.country}</td>
            </tr>
            <tr>
              <th>Specification: </th>
            </tr>
            <tr>
              <th>${
                Object.keys(detailsItem.specification)[0] === "material"
                  ? "Material:"
                  : "Skin Type:"
              } </th>
              <td>${
                Object.keys(detailsItem.specification)[0] === "material"
                  ? detailsItem.specification.material
                  : detailsItem.specification.skinType
              }</td>
            </tr>
            </tr>
              <th>Warranty: </th>
              <td>${detailsItem.warranty}</td>
            </tr>
          </tbody>
        </table>
      </figcaption> 
    </figure>   
    `;
}

// displayDetailsItem(detailsItem);

// Quantity increase

function handleIncrease(id) {
  cartItem = cartItem.map((item) =>
    item.id === id
      ? {
          ...item,
          qty: (item.qty || 1) + 1 <= 10 ? (item.qty || 1) + 1 : item.qty || 1,
        }
      : item
  );

  localStorage.setItem("Cart", JSON.stringify(cartItem));
  displayCartItem(cartItem);
  itemTotalPrice();
}

// Quantity decrease

function handleDecrease(id) {
  cartItem = cartItem.map((item) =>
    item.id === id ? { ...item, qty: (item.qty || 1) - 1 } : item
  );

  localStorage.setItem("Cart", JSON.stringify(cartItem));
  displayCartItem(cartItem);
  itemTotalPrice();
}

// Total Price

function itemTotalPrice() {
  const totalPrice = cart.querySelector(".total-cart-price");

  const total = cartItem.reduce(
    (acc, item) => acc + (item.qty || 1) * item.price,
    0
  );

  totalPrice.textContent = `$${total.toFixed(2)}`;
  return total;
}

// Delete item

function handleDelete(id) {
  cartItem = cartItem.filter((item) => item.id !== id);

  localStorage.setItem("Cart", JSON.stringify(cartItem));
  displayCartItem(cartItem);
}

const checkout = main.querySelector("#checkout");

const checkoutBtn = cart.querySelector(".checkout-btn");

checkoutBtn.addEventListener("click", () => {
  showPages("checkout");
  checkoutCart(cartItem);
  isOpen("none");
});

function isOpen(isOpen) {
  cart.style.display = cart.style.display === isOpen ? "block" : "none";
}

const checkoutItem = checkout.querySelector(".checkout-item");

const totalPrice = itemTotalPrice();

function checkoutCart(cartItem) {
  checkoutItem.innerHTML = `
  <table>
    <thead>
      <tr colspan="2">
        <th>Order Summary</th>
        <th>Total Price: $${totalPrice.toFixed(2)}</th>
      </tr>
    </thead>
    <tbody> 
    ${cartItem
      .map(
        (item) => `
      <tr>
        <td>
          <div class="img-container">
            <img src="${item.images[0].url}" alt="">
          </div>
        </td>
        <td>
          ${item.name} <br>
          <span>Qty:</span> ${item.qty || 1}
          </td>
        <td>$${((item.qty || 1) * item.price).toFixed(2)}</td>
      </tr>
      `
      )
      .join("")}
    </tbody>
  </table>
`;
}
