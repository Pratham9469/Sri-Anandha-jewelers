// 1. Initialize Swiper
var swiper = new Swiper(".mySwiper", {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 800,
  pagination: {
    el: ".swiper-pagination",
  },
});

// 2. Helper Functions
function isUserLoggedIn() {
  return localStorage.getItem("currentUser") !== null;
}

function updateCartBadge() {
  const spanEle = document.querySelector(".cart-btn span");
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  const totalCount = cartList.reduce((total, item) => total + item.qty, 0);

  if (totalCount <= 0) {
    spanEle.style.display = "none";
  } else {
    spanEle.innerText = totalCount;
    spanEle.style.display = "flex";
    spanEle.classList.add("totalCart");
  }
}

// 3. Main Logic Execution
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(); // Render dynamic products first
  initCartLogic();  // Initialize Cart buttons
  initWishlist();   // Initialize Heart buttons
  initUserMenu();   // Initialize Dropdown
  updateCartBadge(); // Initial badge update
});

// --- Function Definitions ---

function renderProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productContainer = document.getElementById("dynamicProductContainer");

  // Note: This adds to the existing static HTML cards.
  // If you want to replace them, use innerHTML = "";
  products.forEach(p => {
    productContainer.innerHTML += `
      <div class="fullCard">
        <div class="card">
          <img src="${p.image}">
          <div class="card-detais">
            <p class="detail">${p.name}</p>
            <p class="rate">${p.price}</p>
            <p class="delivery">FREE delivery <span class="delivery-date">${p.delivery || 'Mon, 2 Feb'}</span></p>
            <div class="lower">
              <button class="addCart">Add to Cart</button>
              <i class="fa-regular fa-heart wishlist-btn"></i>
            </div>
          </div>
        </div>
      </div>`;
  });
}

function initCartLogic() {
  const cards = document.querySelectorAll(".fullCard");
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];

  cards.forEach((cardBox) => {
    const productName = cardBox.querySelector(".detail").innerText;
    const addBtn = cardBox.querySelector(".addCart");
    const lower = cardBox.querySelector(".lower");
    const heart = cardBox.querySelector(".wishlist-btn");

    const productInCart = cartList.find(item => item.name === productName);
    if (productInCart) {
      createCounterUI(lower, addBtn, heart, productName, productInCart.qty);
    }

    addBtn.onclick = () => {
      if (!isUserLoggedIn()) {
        alert("Please login to add products to cart");
        window.location.href = "Login.html";
        return;
      }

      let list = JSON.parse(localStorage.getItem("cartList")) || [];
      list.push({
        name: productName,
        price: cardBox.querySelector(".rate").innerText,
        image: cardBox.querySelector("img").src,
        qty: 1
      });
      localStorage.setItem("cartList", JSON.stringify(list));
      createCounterUI(lower, addBtn, heart, productName, 1);
      updateCartBadge();
    };
  });
}

function createCounterUI(parent, addBtn, heart, productName, initialQty) {
  if (addBtn) addBtn.remove();
  const newChild = document.createElement('div');
  newChild.classList.add("cartAdd");

  const minusBtn = document.createElement("a");
  const inputField = document.createElement("input");
  const plusBtn = document.createElement("a");

  minusBtn.innerText = "-";
  minusBtn.classList.add("minus");
  inputField.value = initialQty;
  inputField.classList.add("inputNum");
  plusBtn.innerText = "+";
  plusBtn.classList.add("plus");

  newChild.append(minusBtn, inputField, plusBtn);
  parent.insertBefore(newChild, heart);

  plusBtn.onclick = () => {
    if (!isUserLoggedIn()) {
      alert("Please login to continue shopping");
      window.location.href = "Login.html";
      return;
    }

    let list = JSON.parse(localStorage.getItem("cartList")) || [];
    let item = list.find(i => i.name === productName);
    if (item) {
      item.qty++;
      inputField.value = item.qty;
      localStorage.setItem("cartList", JSON.stringify(list));
      updateCartBadge();
    }
};

  minusBtn.onclick = () => {
    let list = JSON.parse(localStorage.getItem("cartList")) || [];
    let itemIdx = list.findIndex(i => i.name === productName);
    if (itemIdx !== -1) {
      if (list[itemIdx].qty > 1) {
        list[itemIdx].qty--;
        inputField.value = list[itemIdx].qty;
      } else {
        list.splice(itemIdx, 1);
        newChild.remove();
        // Since original button was removed, we recreate it or re-attach
        const newAddBtn = document.createElement("button");
        newAddBtn.className = "addCart";
        newAddBtn.innerText = "Add to Cart";
        parent.insertBefore(newAddBtn, heart);
        newAddBtn.onclick = () => {
  if (!isUserLoggedIn()) {
    alert("Please login to add products to cart");
    window.location.href = "Login.html";
    return;
  }

  let list = JSON.parse(localStorage.getItem("cartList")) || [];
  list.push({
    name: productName,
    price: parent.closest(".card").querySelector(".rate").innerText,
    image: parent.closest(".card").querySelector("img").src,
    qty: 1
  });
  localStorage.setItem("cartList", JSON.stringify(list));
  createCounterUI(parent, newAddBtn, heart, productName, 1);
  updateCartBadge();
};

      }
      localStorage.setItem("cartList", JSON.stringify(list));
      updateCartBadge();
    }
  };
}

function initWishlist() {
  const hearts = document.querySelectorAll(".wishlist-btn");
  const wishList = JSON.parse(localStorage.getItem("wishList")) || [];

  hearts.forEach((heart) => {
    const card = heart.closest(".card");
    const productName = card.querySelector(".detail").innerText;

    if (wishList.some(item => item.name === productName)) {
      heart.classList.replace("fa-regular", "fa-solid");
      heart.style.color = "red";
    }

    heart.addEventListener("click", () => {
      let currentWish = JSON.parse(localStorage.getItem("wishList")) || [];
      const idx = currentWish.findIndex(item => item.name === productName);

      if (idx === -1) {
        currentWish.push({
          image: card.querySelector("img").src,
          name: productName,
          price: card.querySelector(".rate").innerText
        });
        heart.classList.replace("fa-regular", "fa-solid");
        heart.style.color = "red";
      } else {
        currentWish.splice(idx, 1);
        heart.classList.replace("fa-solid", "fa-regular");
        heart.style.color = "";
      }
      localStorage.setItem("wishList", JSON.stringify(currentWish));
    });
  });
}




function initUserMenu() {
  const userIcon = document.querySelector(".user-icon");
  const dropdown = document.querySelector(".dropdown");
  const userGreeting = document.getElementById("userGreeting");

  // 1. Check if user is logged in
  const userData = JSON.parse(localStorage.getItem("currentUser"));

  if (userData && userData.firstName) {
    // 2. Change icon to "Hello, Name"
    userGreeting.innerHTML = `Hello, ${userData.firstName}`;
    userGreeting.style.fontWeight = "600";
    userGreeting.style.fontSize = "14px";

    // 3. Change "Login/Signup" link to "Logout"
    const loginLink = dropdown.querySelector('a[href="Login.html"]');
    if (loginLink) {
      loginLink.innerText = "Logout";
      loginLink.href = "#";
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        alert("Logged out successfully!");
        window.location.reload();
      });
    }
  }

  // Handle dropdown toggle
  userGreeting.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-menu")) {
      dropdown.classList.remove("show");
    }
  });
}

const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});
