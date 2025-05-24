const logout = document.getElementById("logout");
const token = localStorage.getItem("token");
const form = document.getElementById("chatForm");
const list = document.getElementById("chatting-list");
const createGroupBtn = document.getElementById("create-group");
const groupForm = document.getElementById("create-group-form");
const submitGroupBtn = document.getElementById("submit-group");
const groupNameInput = document.getElementById("group-name");
const groupSelect = document.getElementById("group-select");
const usernameHeading = document.getElementById("username");

usernameHeading.textContent = localStorage.getItem("username");

let selectedGroupId = null;
let lastMessageId = 0;

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

// Save chat to localStorage (per group, limit last 10)
function saveChatToLocal(chat) {
  const groupChats = JSON.parse(localStorage.getItem(`chats-${selectedGroupId}`)) || [];
  groupChats.push(chat);
  if (groupChats.length > 10) groupChats.splice(0, groupChats.length - 10);
  localStorage.setItem(`chats-${selectedGroupId}`, JSON.stringify(groupChats));
}

// Load chats from localStorage
function loadChatsFromLocal() {
  const chats = JSON.parse(localStorage.getItem(`chats-${selectedGroupId}`)) || [];
  list.innerHTML = "";
  chats.forEach((chat) => renderChat(chat));
  return chats;
}

// Create group form toggle
createGroupBtn.addEventListener("click", () => {
  groupForm.style.display = "block";
});

// Submit new group
submitGroupBtn.addEventListener("click", async () => {
  const name = groupNameInput.value.trim();
  if (!name) return;

  try {
    await axios.post("/api/groups", { name }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    groupForm.style.display = "none";
    groupNameInput.value = "";
    await fetchGroups();
    alert("Group created!");
    groupFrom.style.display = "none";
  } catch (err) {
    console.log("Error creating group:", err);
  }
});

// Fetch all joined groups
async function fetchGroups() {
  try {
    const res = await axios.get("/api/group/joined", {
      headers: { Authorization: `Bearer ${token}` },
    });

    groupSelect.innerHTML = "";
    res.data.forEach((group) => {
      const option = document.createElement("option");
      option.value = group.id;
      option.textContent = group.name;
      groupSelect.appendChild(option);
    });

    if (res.data.length > 0) {
      selectedGroupId = res.data[0].id;
      await loadGroupChats();
    }
  } catch (err) {
    console.log("Error fetching groups", err);
  }
}

// Handle group change
groupSelect.addEventListener("change", async (e) => {

  selectedGroupId = e.target.value;
  lastMessageId = 0;
  loadChatsFromLocal();
  await fetchNewChats();
  await showMembers(selectedGroupId);
});

async function showMembers(groupId) {
  try {
    const res = await axios.get(`/api/groups/${groupId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const memberList = document.getElementById("member-list");
    memberList.innerHTML = "";

    res.data.forEach(member => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span><strong>${member.username}</strong></span>
        ${member.isAdmin ? `<span style="margin-left: 10px;">(Admin)</span>` : `
          <button onclick="makeAdmin(${groupId}, ${member.id})">Make Admin</button>`}
        <button onclick="removeMember(${groupId}, ${member.id})">Remove</button>
      `;
      memberList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading members", err);
  }
}

async function makeAdmin(groupId, userId) {
  try {
    await axios.post(`/api/groups/${groupId}/make-admin`, { userId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("User promoted to admin");
    await showMembers(groupId);
  } catch (err) {
    alert("Failed to make admin");
  }
}

async function removeMember(groupId, userId) {
  try {
    await axios.delete(`/api/groups/${groupId}/remove-user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("User removed");
    await showMembers(groupId);
  } catch (err) {
    alert("Failed to remove user");
  }
}




// Submit chat message
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value.trim();
  if (!message || !selectedGroupId) return;

  try {
    const response = await axios.post(
      `/api/message?groupId=${selectedGroupId}`,
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
    console.log("Error sending message", err);
  }
});

// Fetch new chats
async function fetchNewChats() {
  if (!selectedGroupId) return;

  try {
    const res = await axios.get(`/api/allchat?groupId=${selectedGroupId}&after=${lastMessageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
   
    
    const newChats = res.data;
    newChats.forEach((chat) => {
      renderChat(chat);
      saveChatToLocal(chat);
      lastMessageId = chat.id;
    });
  } catch (err) {
    console.log("Error fetching new chats", err);
  }
}

async function loadGroupChats() {
  const cachedChats = loadChatsFromLocal();
  if (cachedChats.length > 0) {
    lastMessageId = cachedChats[cachedChats.length - 1].id;
  }
  await fetchNewChats();
}





const inviteForm = document.getElementById("invite-form");
const inviteUserIdInput = document.getElementById("invite-user-id");
const inviteSubmitBtn = document.getElementById("submit-invite");

// Toggle invite form (optional)
document.getElementById("show-invite-form").addEventListener("click", () => {
  inviteForm.style.display = "block";
});

// Submit invite
inviteSubmitBtn.addEventListener("click", async () => {
  const userId = inviteUserIdInput.value.trim();
  if (!userId || !selectedGroupId) return alert("Enter user ID and select a group");

  try {
    await axios.post(`/api/groups/${selectedGroupId}/invite`, { userId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("User invited successfully");
    inviteForm.style.display = "none";
    inviteUserIdInput.value = "";
  } catch (err) {
    console.error("Error inviting user:", err);
    alert("Failed to invite user");
  }
});








// Load everything on page load
window.addEventListener("DOMContentLoaded", async () => {
 
  await fetchGroups();
  // setInterval(fetchNewChats, 1000);
});