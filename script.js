const socket = io("http://localhost:3000"); // connect to the server using socket io
const messageContainer = document.getElementById("message-container");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("send-container");

// Get name value from session storage
var username = sessionStorage.getItem("username"); // from user.js
let name = document.getElementById("display-username").innerHTML;

// Get the notification box and the close button
const notificationBox = document.getElementById("notification-box");
const closeButton = document.getElementById("notification-close");
const messageElement = document.getElementById("notification-message");

function showNotification(notification) {
  // Set the message text for the notification box
  messageElement.innerText = notification;
  // Show the notification box
  notificationBox.style.display = "block";

  // close button to hide the notification box when clicked
  closeButton.addEventListener("click", () => {
    notificationBox.style.visibility = "hidden";
  });
}

socket.on("update-online-users", (users) => {
  // Clear the existing user list
  const userList = document.getElementById("user-list");
  userList.innerHTML = "";

  // Add each online user to the user list
  users.forEach((user) => {
    const li = document.createElement("li");
    const text = document.createTextNode(user);
    li.appendChild(text);
    userList.appendChild(li);
  });
});

// Listen for the "notification" event
socket.on("notification", (data) => {
  console.log("New notification:", data.message);
  // Check if the Notification API is supported by the browser
  if (Notification.permission === "granted") {
    console.log("You allowed notifications.");
    socket.on("user-connected", (name) => {
      // notification if other users joined the chat
      showNotification(`${name} joined the chat.`);
      notificationBox.style.visibility = "visible";
      // console.log(`${name} joined the chat.`);
    });
  } else if (Notification.permission != "denied") {
    Notification.requestPermission().then((permission) => {
      console.log(permission);
    });
  }
});

appendMessage("You joined the chat."); // You joined for your screen
socket.emit("new-user", name);

socket.on("chat-message", (data) => {
  appendMessageDiffUser(`${data.name}: ${data.message}`); // message of others
});

socket.on("user-connected", (name) => {
  // diff user connected for other screen
  appendMessage(`${name} joined the chat.`);
});

socket.on("user-disconnected", (name) => {
  // name disconnected for other screen
  appendMessage(`${name} disconnected.`);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessageUser(message); // your message
  socket.emit("send-chat-message", message);
  messageInput.value = ""; // empty the input
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.style.fontWeight = "bold";
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function appendMessageUser(message) {
  const messageElement = document.createElement("div");
  messageElement.style.textAlign = "right";
  messageElement.style.backgroundColor = "#FFFFFF";
  messageElement.style.borderRadius = "25px";
  messageElement.style.padding = "5px";
  messageElement.style.marginBottom = "5px";
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function appendMessageDiffUser(message) {
  const messageElement = document.createElement("div");
  messageElement.style.textAlign = "left";
  messageElement.style.backgroundColor = "#e9e9e9";
  messageElement.style.borderRadius = "25px";
  messageElement.style.padding = "5px";
  messageElement.style.marginBottom = "5px";
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function updateTime() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();

  // Pad the minutes and seconds with leading zeros if necessary
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  // Build the time string in 12-hour format with AM/PM
  var timeString = (hours % 12) + ":" + minutes + ":" + seconds;
  var ampm = hours >= 12 ? "PM" : "AM";
  timeString += " " + ampm;

  // Update the DOM with the new time
  document.getElementById("current-time").innerHTML = timeString;
}

// Call updateTime() once per second to update the time display
setInterval(updateTime, 1000);

// function setItem(key, item) {
//   localStorage.setItem(key, JSON.stringify(item));
// }

// function getItem(key) {
//   const item = localStorage.getItem(key);
//   return JSON.parse(item);
// }
