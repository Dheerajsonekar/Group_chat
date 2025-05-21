const logout = document.getElementById("logout");
const token = localStorage.getItem("token");
const form = document.getElementById("chatForm");
const list = document.getElementById("chatting-list");

// Logout functionality
logout.addEventListener("click", async (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = "./login.html";
});

// Render a chat message
function renderChat(chat) {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${chat.username}:</strong> ${chat.message}`;
  list.appendChild(li);
  list.scrollTop = list.scrollHeight;
}

// Save chat to localStorage (limit to last 10)
function saveChatToLocal(chat) {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.push(chat);
  if (chats.length > 10) chats = chats.slice(chats.length - 10);
  localStorage.setItem("chats", JSON.stringify(chats));
}

// Load chats from localStorage
function loadChatsFromLocal() {
  const chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.forEach((chat) => renderChat(chat));
  return chats;
}

let lastMessageId = 0;

// Handle message submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value.trim();
  if (!message) return;

  try {
    const response = await axios.post(
      "/api/message",
      { message },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const chat = response.data;
    renderChat(chat);
    saveChatToLocal(chat);
    lastMessageId = chat.id;
    form.reset();
  } catch (err) {
    console.log("error at message send frontend", err);
  }
});

// Fetch only new messages
async function fetchNewChats() {
  try {
    const response = await axios.get(`/api/allchat?after=${lastMessageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const newChats = response.data;
    newChats.forEach((chat) => {
      renderChat(chat);
      saveChatToLocal(chat);
      lastMessageId = chat.id;
    });
  } catch (err) {
    console.log("error at fetchNewChats: ", err);
  }
}

// On page load
window.addEventListener("DOMContentLoaded", async () => {
  const cachedChats = loadChatsFromLocal();
  if (cachedChats.length > 0) {
    lastMessageId = cachedChats[cachedChats.length - 1].id;
  }
  await fetchNewChats();
  setInterval(fetchNewChats, 1000);
});
