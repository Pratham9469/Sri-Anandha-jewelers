const adminloginLink = document.querySelector(".NotRegister");
  const adminsignupLink = document .querySelector(".goSignup");

  const signupTitle = document.getElementById("adminTitle");
  const signupSection = document.getElementById("adminSection");

  const loginTitle = document.querySelector(".newPara2");
  const loginSection = document.getElementById("adminSection2");

  adminloginLink.addEventListener("click", () => {
    signupSection.style.display = "none";
    signupTitle.style.display = "none";

    loginSection.style.display = "flex";
    loginTitle.style.display = "block";
  });

  adminsignupLink.addEventListener("click", () => {
    loginSection.style.display = "none";
    loginTitle.style.display = "none";

    signupSection.style.display = "flex";
    signupTitle.style.display = "block";
  });

  function adminLogin() {
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  const phone = document.getElementById("adminPhone").value.trim();
  const error = document.getElementById("loginError");

  if (
    email === "admin@gmail.com" &&
    password === "abc@123" &&
    phone === "0000"
  ) {
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "adminPage.html";
  } else {
    error.innerText = "Invalid admin credentials";
  }
}