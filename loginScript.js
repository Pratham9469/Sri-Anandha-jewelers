const loginLink = document.querySelector(".NotRegister");
  const signupLink = document.querySelector(".goSignup");

  const signupSection = document.getElementById("signupSection");
  const signupTitle = document.getElementById("signupTitle");

  const loginSection = document.getElementById("loginSection");
  const loginTitle = document.getElementById("loginTitle");

  // UI Toggle
  loginLink.addEventListener("click", () => {
    signupSection.style.display = "none";
    signupTitle.style.display = "none";

    loginSection.style.display = "flex";
    loginTitle.style.display = "block";
  });

  signupLink.addEventListener("click", () => {
    loginSection.style.display = "none";
    loginTitle.style.display = "none";

    signupSection.style.display = "flex";
    signupTitle.style.display = "block";
  });

  // USER STORAGE
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // SIGNUP FUNCTION
  const signupButton = signupSection.querySelector("button[type='submit']");
  signupButton.addEventListener("click", () => {
    const firstName = signupSection.querySelector("input[placeholder='Enter First Name']").value.trim();
    const lastName = signupSection.querySelector("input[placeholder='Enter Last Name']").value.trim();
    const phone = signupSection.querySelector("input[placeholder='Enter Phone Number']").value.trim();

    if (!firstName || !lastName || !phone) {
      alert("Please fill all fields!");
      return;
    }

    // Check if user already exists
    if (users.some(u => u.phone === phone)) {
      alert("User already exists! Please login.");
      return;
    }

    const newUser = { firstName, lastName, phone };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Clear form
    signupSection.querySelectorAll("input").forEach(input => input.value = "");

    // Switch to login
    loginLink.click();
  });

  // LOGIN FUNCTION
  const loginButton = loginSection.querySelector("button");
  loginButton.addEventListener("click", () => {
    const phone = loginSection.querySelector("input[placeholder='Enter phone number']").value.trim();

    const user = users.find(u => u.phone === phone);
    if (!user) {
      alert("User not found! Please signup.");
      return;
    }

    // Save current logged in user
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html"; // Redirect to main page
  });