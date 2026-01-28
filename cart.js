const fullCart = document.querySelector(".fullCart");
  const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  const fullCard = document.querySelector(".cards-container");
  const checkoutContainer = document.querySelector(".checkout-container");

  if (cartList.length === 0) {
  fullCart.style.display = "flex";
  fullCard.style.display = "none";
  checkoutContainer.style.display = "none";
} else {
  fullCart.style.display = "none";
  fullCard.style.display = "grid";
  checkoutContainer.style.display = "block";
  fullCard.innerHTML = "";
  calculateCheckout();
}

cartList.forEach((item, index) => {
  fullCard.innerHTML += `
    <div class="card">
        <img src="${item.image}">
        <div class="card-detais">
          <p class="detail">${item.name}</p>
          <p class="rate">${item.price}</p>
          <p class="quantity">Quantity: ${item.qty}</p>
          <div class="lower">
            <i class="fa-solid fa-trash" onclick="removeCart(${index})"></i>
          </div>
        </div>
      </div>
  `
});

function calculateCheckout() {
  let subTotal = 0;

  cartList.forEach(item => {
    const priceText = item.price.split("(")[0];
    const price = Number(priceText.replace(/\D/g, ""));
    subTotal += price * item.qty;
  });

  let finalTotal = subTotal;
  document.getElementById("subTotal").innerText = `₹ ${subTotal}`;
  document.getElementById("discount").innerText = `- ₹ 0`;
  document.getElementById("total").innerText = `₹ ${finalTotal}`;
  document.getElementById("save").innerText = `₹ 0`;
}

function removeCart(index) {
  cartList.splice(index, 1);
  localStorage.setItem("cartList", JSON.stringify(cartList));
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    const userIcon = document.querySelector(".user-icon");
    const dropdown = document.querySelector(".dropdown");

    userIcon.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu")) {
        dropdown.classList.remove("show");
      }
    });
  });

  const confirm = document.querySelector(".confirm-btn");

  confirm.addEventListener("click", () => {
    confirm.innerText = "Processing...";
    setTimeout(() => {
      confirm.innerText = "Please wait..."
    }, 2000);
    setTimeout(() => {
      confirm.innerText = "Confirmed";

    },4000);
    setTimeout(() => {
      window.location.href = "index.html";
    },5000);
  });



const apply_btn = document.querySelector(".apply-btn");
const couponApply = document.querySelector(".inputCoupon");
const couponContainer = document.querySelector(".coupon-container");

let appliedCoupon = false;

apply_btn.addEventListener("click", () => {
   if (appliedCoupon) return;

   const premiumCoupon = localStorage.getItem("quizCoupon");
   const standardCoupon = localStorage.getItem("quizCoupon2");

   const enteredCoupon = couponApply.value.trim();

  const newEle = document.createElement("p");

  const subTotalEl = document.getElementById("subTotal");
  const discountEl = document.getElementById("discount");
  const totalEl = document.getElementById("total");
  const saveEl = document.getElementById("save");

  let subTotal = Number(subTotalEl.innerText.replace(/\D/g, ""));
  let discount = 0;

  if(enteredCoupon === ""){
    newEle.classList.add("notPara");
    newEle.innerText = "Please enter a coupon code.";
  }
  else if(enteredCoupon === premiumCoupon){
    discount = Math.round(subTotal * 0.10); // 10% off
    discountEl.innerText = `- ₹ ${discount.toFixed(2)}`;
    totalEl.innerText = `₹ ${(subTotal - discount).toFixed(2)}`;
    saveEl.innerText = `₹ ${discount.toFixed(2)}`;
    newEle.classList.add("neweleP");
    newEle.innerText = "Premium Coupon Applied! 10% off.";
    appliedCoupon = true;
  }
  else if(enteredCoupon === standardCoupon){
    discount = Math.round(subTotal * 0.05); // 5% off
    discountEl.innerText = `- ₹ ${discount.toFixed(2)}`;
    totalEl.innerText = `₹ ${(subTotal - discount).toFixed(2)}`;
    saveEl.innerText = `₹ ${discount.toFixed(2)}`;
    newEle.classList.add("neweleP");
    newEle.innerText = "Coupon Applied! 5% off.";
    appliedCoupon = true;
  }
  else{
    newEle.classList.add("notPara");
    newEle.innerText = "Invalid coupon code.";
  }
  const oldMsg = couponContainer.querySelector(".neweleP");
  if (oldMsg) oldMsg.remove();

  apply_btn.parentElement.after(newEle);

});

const premiumCoupon = localStorage.getItem("quizCoupon"); // SAJ10...
const standardCoupon = localStorage.getItem("quizCoupon2"); // SAJ05...
