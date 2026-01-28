let products = JSON.parse(localStorage.getItem("products")) || [];

function addProduct() {

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  if (!name || !price || !image) return;
  products.push({ name, price: `₹ ${price}`, image });
  localStorage.setItem("products", JSON.stringify(products));
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
  renderProducts();
}
function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach((p, i) => {
    list.innerHTML += `
      <div class="product-item">
        <img src="${p.image}">
        <div>
          <p class="p-name">${p.name}</p>
          <p class="p-price">${p.price}</p>
        </div>
        <button onclick="deleteProduct(${i})">Delete</button>
      </div>
    `;
  });
}
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}
renderProducts();
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "admin.html";
}