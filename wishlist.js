const wishList = JSON.parse(localStorage.getItem("wishList")) || [];
  const fullCard = document.querySelector(".cards-container");
  const noWish = document.querySelector(".noWish");

  if (wishList.length === 0) {
  noWish.style.display = "flex";
  fullCard.style.display = "none";
} else {
  noWish.style.display = "none";
  fullCard.style.display = "grid";
  fullCard.innerHTML = "";
}

wishList.forEach((item, index) => {
  fullCard.innerHTML += `
    <div class="card">
        <img src="${item.image}">
        <div class="card-detais">
          <p class="detail">${item.name}</p>
          <p class="rate">${item.price}</span></p>
          <div class="lower">
            <button class="addCart" onclick="addToCartFromWish(${index})">Add to Cart</button>
            <i class="fa-solid fa-trash" onclick="removeWish(${index})"></i>
          </div>
        </div>
      </div>
  `
});

function removeWish(index) {
  wishList.splice(index, 1);
  localStorage.setItem("wishList", JSON.stringify(wishList));
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.querySelector(".user-icon");
    const dropdown = document.querySelector(".dropdown");

    userIcon.addEventListener("click", (e) => {
      e.preventDefault(); // stop page reload
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu")) {
        dropdown.classList.remove("show");
      }
    });
  });



  function addToCartFromWish(index) {
  let cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  const product = wishList[index];

  const existing = cartList.find(item => item.name === product.name);

  if (existing) {
    existing.qty++;
  } else {
    cartList.push({
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  localStorage.setItem("cartList", JSON.stringify(cartList));

  // Remove from wishlist
  wishList.splice(index, 1);
  localStorage.setItem("wishList", JSON.stringify(wishList));

  updateCartBadge();
  location.reload();
}



function updateCartBadge() {
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  const span = document.querySelector(".cart-btn span");

  let total = 0;
  cartList.forEach(item => total += item.qty);

  if (total > 0) {
    span.innerText = total;
    span.style.display = "flex";
    span.classList.add("totalCart");
  } else {
    span.style.display = "none";
  }
}
updateCartBadge();
