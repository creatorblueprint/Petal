const DAILY_LIMIT = 5;

const today = new Date().toDateString();
const lastReset = localStorage.getItem("lastReset");

let repliesLeft = parseInt(localStorage.getItem("repliesLeft"));

// 🔄 Reset if new day
if (lastReset !== today) {
  repliesLeft = DAILY_LIMIT;
  localStorage.setItem("repliesLeft", repliesLeft);
  localStorage.setItem("lastReset", today);
}

// First time setup
if (isNaN(repliesLeft)) {
  repliesLeft = DAILY_LIMIT;
  localStorage.setItem("repliesLeft", repliesLeft);
  localStorage.setItem("lastReset", today);
}



// 🌸 DOM ELEMENTS
const chatContainer = document.getElementById("chat-container");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const limitModal = document.getElementById("limit-modal");

// 🌸 SHOW POPUP
function showEnergyPopup() {
  limitModal.classList.remove("hidden");
}

// 🌸 HIDE POPUP
function hideLimitModal() {
  limitModal.classList.add("hidden");
}

const closeModalBtn = document.getElementById("close-modal");

closeModalBtn.addEventListener("click", () => {
  hideLimitModal();
});



// 🌸 ADD MESSAGE BUBBLE
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerText = text;
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 🌸 SEND MESSAGE
sendBtn.addEventListener("click", async () => {
  
  const message = input.value.trim();
  if (!message) return;
  
  repliesLeft = parseInt(localStorage.getItem("repliesLeft")) || 0;
  
  
  // 💎 5 FREE CHAT LIMIT CHECK
const isPlus = localStorage.getItem("petalPlus");

if (repliesLeft <= 0 && !isPlus) {
  showEnergyPopup();
  return;
}
  
  // Show user message
  addMessage(message, "user");
  input.value = "";
  
  showTyping();
  
  try {
  const response = await fetch("https://petal-backend.onrender.com/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });
  
  // 🚨 IMPORTANT: CHECK RATE LIMIT FIRST
  if (response.status === 429) {
  typingDiv.remove();
  addMessage("Petal is feeling shy… try again 🌸", "petal");
  return;
}

  
  const data = await response.json();
  
  removeTyping();
  
  if (data.reply) {
    addMessage(data.reply, "petal");
    
    // 💎 Decrease only on SUCCESS
    repliesLeft--;
    localStorage.setItem("repliesLeft", repliesLeft);
  } else {
    addMessage("Petal is feeling shy... try again 🌸", "petal");
  }
  
} catch (error) {
  console.error(error);
  typingDiv.remove();
  addMessage("Petal is resting... try again later 🌸", "petal");
}
  
});


// 🌸 ENTER KEY SUPPORT
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// 🌸 Show Typing Indicator
function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot");
  typingDiv.id = "typing-indicator";
  
  typingDiv.innerHTML = `
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 🌸 Remove Typing Indicator
function removeTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

// 🌸watch ad

const watchAdBtn = document.getElementById("watchAdBtn");

watchAdBtn.addEventListener("click", () => {
  
  // 🎬 Simulate watching ad (2 seconds delay)
  watchAdBtn.innerText = "Watching Ad...";
  watchAdBtn.disabled = true;
  
  setTimeout(() => {
    
    repliesLeft += 2;
    localStorage.setItem("repliesLeft", repliesLeft);
    
    alert("✨ You earned +2 replies!");
    
    hideLimitModal(); // close popup
    
    watchAdBtn.innerText = "Watch Ad (+2 replies)";
    watchAdBtn.disabled = false;
    
  }, 2000);
  
});


// 🌸 Petal Plus 
const petalPlusBtn = document.getElementById("petalPlusBtn");

petalPlusBtn.addEventListener("click", () => {
  
  localStorage.setItem("petalPlus", "true");
  
  alert("💎 Petal Plus Activated!");
  
  hideLimitModal();
  
});