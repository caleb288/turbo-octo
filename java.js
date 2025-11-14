/* ---------------------------------------------------
   🔍 SEARCH OVERLAY OPEN / CLOSE
----------------------------------------------------*/
const openSearch = document.getElementById("openSearch");
const closeSearch = document.getElementById("closeSearch");
const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");

// Open search overlay
openSearch.addEventListener("click", () => {
  document.body.classList.add("overlay-open");
  searchOverlay.classList.add("active");

  // Delay focus to allow animation to finish
  setTimeout(() => searchInput.focus(), 300);
});

// Close search overlay
closeSearch.addEventListener("click", () => {
  searchOverlay.classList.remove("active");
  document.body.classList.remove("overlay-open");
  searchInput.value = "";
});



/* ---------------------------------------------------
   ➖➕ PRODUCT QUANTITY BUTTONS (MINUS / PLUS)
----------------------------------------------------*/
document.querySelectorAll('.quantity-wrapper').forEach(wrapper => {
  const input = wrapper.querySelector('.quantity-input');
  const minus = wrapper.querySelector('.minus');
  const plus = wrapper.querySelector('.plus');

  // Decrease quantity (not below 1)
  minus.addEventListener('click', () => {
    let value = parseInt(input.value);
    if (value > 1) input.value = value - 1;
  });

  // Increase quantity
  plus.addEventListener('click', () => {
    let value = parseInt(input.value);
    input.value = value + 1;
  });
});



/* ---------------------------------------------------
   📤 POPUP SOCIAL ICONS INSIDE EACH PRODUCT MODAL
   - Works for MULTIPLE modals
----------------------------------------------------*/
document.querySelectorAll('.popup-container').forEach(container => {
  const toggleBtn = container.querySelector('.search-btn');
  const popupIcons = container.querySelector('.popup-icons');

  // Toggle visibility of icon popup
  if (toggleBtn && popupIcons) {
    toggleBtn.addEventListener('click', () => {
      popupIcons.classList.toggle('show');
    });
  }
});



/* ---------------------------------------------------
   👀 INTERSECTION OBSERVER (FADE/SLIDE ANIMATIONS)
   - Reveals elements when they enter the viewport
----------------------------------------------------*/
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show'); // Add animation class
    }
  });
});



// Observe all hidden elements
document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

/* ==============================
   CART HOVER
=/* ==============================
   CART HOVER
============================== */
const cartArea = document.getElementById("cartArea");

cartArea.addEventListener("mouseenter", () => {
  cartArea.classList.add("hover-active");
});

cartArea.addEventListener("mouseleave", () => {
  cartArea.classList.remove("hover-active");
});


/* ==============================
   CART ELEMENTS
============================== */
const cartCount = document.getElementById("cart-count");
const cartItemsBox = document.getElementById("cartItemsBox");
const emptyCart = document.getElementById("emptyCart");
const itemsLabel = document.getElementById("itemsLabel");
const checkoutBtn = document.querySelector(".checkout-btn");
const viewBtn = document.querySelector(".view-btn");
const toast = document.getElementById("cart-toast");

let CART = {};






/* ==============================
   ADD TO CART
============================== */
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".card-body");
    const name = card.querySelector(".card-title").textContent.trim();
    const price = parseFloat(card.querySelector(".price").textContent.replace("$", ""));

    if (CART[name]) {
      CART[name].qty++;
    } else {
      CART[name] = { price, qty: 1 };
    }

    updateCartUI();
    showToast(`${name} added to cart`);
  });
});



document.querySelectorAll(".modal").forEach(modal => {

  const minusBtn = modal.querySelector(".btn-qty.minus");
  const plusBtn  = modal.querySelector(".btn-qty.plus");
  const qtyInput = modal.querySelector(".quantity-input");
  const addBtn   = modal.querySelector(".add-to-cart-btn");

  if (!minusBtn || !plusBtn || !qtyInput || !addBtn) return;

  const productName = modal.querySelector("h3").textContent.trim();

  // Increase quantity
  plusBtn.addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;

    // 🔥 If product already exists in cart, update it LIVE
    if (CART[productName]) {
      CART[productName].qty = parseInt(qtyInput.value);
      updateCartUI();
    }
  });

  // Decrease quantity
  minusBtn.addEventListener("click", () => {
    let qty = parseInt(qtyInput.value);
    if (qty > 1) qtyInput.value = qty - 1;

    // 🔥 Update cart LIVE if item already exists
    if (CART[productName]) {
      CART[productName].qty = parseInt(qtyInput.value);
      updateCartUI();
    }
  });

  // Add to cart button
  addBtn.addEventListener("click", () => {
    const name  = productName;
    const price = parseFloat(modal.querySelector(".text-orange").textContent.replace("$", ""));
    const qty   = parseInt(qtyInput.value);

    // If product exists → update quantity only
    if (CART[name]) {
      CART[name].qty += qty;
    } else {
      CART[name] = { price, qty };
    }

    updateCartUI();
    showToast(`${qty} × ${name} added to cart`);

    qtyInput.value = 1;
  });

});


/* ==============================
   UPDATE CART UI
============================== */
function updateCartUI() {

  let totalItems = Object.values(CART).reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  if (totalItems === 0) {
    emptyCart.style.display = "block";
    cartItemsBox.style.display = "none";
    itemsLabel.style.display = "none";
    checkoutBtn.style.display = "none";
    viewBtn.style.display = "none";
    return;
  }

  emptyCart.style.display = "none";
  cartItemsBox.style.display = "block";
  itemsLabel.style.display = "block";
  checkoutBtn.style.display = "block";
  viewBtn.style.display = "block";

  cartItemsBox.innerHTML = "";

  for (let key in CART) {
    const item = CART[key];

    const row = document.createElement("div");
    row.classList.add("cart-item");

    row.innerHTML = `
      <div>
        <p class="cart-item-title">${key}</p>
        <p class="cart-item-price">${item.qty} × $${item.price}</p>
      </div>
      <span class="remove-item">✕</span>
    `;

    row.querySelector(".remove-item").addEventListener("click", () => {
      delete CART[key];
      updateCartUI();
    });

    cartItemsBox.appendChild(row);
  }
}


/* ==============================
   TOAST FUNCTION    */

function showToast(itemName) {
  const toast = document.getElementById("cart-toast");
  const messageBox = document.getElementById("toast-message");

  messageBox.textContent = `${itemName} added to cart`;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {

    const card = btn.closest(".card-body");
    const name = card.querySelector(".card-title").textContent.trim();
    const price = parseFloat(card.querySelector("p").textContent.replace("$",""));

    if (CART[name]) {
      CART[name].qty += 1;
    } else {
      CART[name] = { price, qty: 1 };
    }

    updateCartUI();
    showToast(name);   // ✅ This passes the product name
  });
});
