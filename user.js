// Add event listener to form submit
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("my-form").onsubmit = (event) => {
    event.preventDefault(); // Prevent form from submitting

    // Get input value
    var name = document.getElementById("username").value;

    // Set name value in session storage
    sessionStorage.setItem("username", name);

    // Navigate to other page
    window.location.href = "index.html";
  };
});
