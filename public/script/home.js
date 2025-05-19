const logout = document.getElementById('logout');
const token = localStorage.getItem('token');

logout.addEventListener('click', async (e)=>{
    e.preventDefault();

    localStorage.clear();
    window.location.href = './login.html';
})


const form = document.getElementById('chatForm');

form.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const message = document.getElementById('message').value;
    try{
         const response = await axios.post('/api/message', {message}, {
            headers: { Authorization: `Bearer ${token}` }
         })
         console.log(response);
         await showAllChat();
         form.reset();
    }catch(err){
        console.log("error at message send frontend",err);
    }
})

async function showAllChat(){
    try{
       const response  = await axios.get('/api/allchat', {
        headers: {Authorization:  `Bearer ${token}`}
       })
       const chats = response.data;
       const list = document.getElementById('chatting-list');
       list.innerHTML = "";
       chats.forEach((chat)=>{
        const li = document.createElement('li');
        const p = document.createElement('p');
        p.textContent = chat.userId;
        li.textContent = chat.message;
        list.appendChild(p);
        list.appendChild(li);
       })
    }catch(err){
        console.log("error at showAllChat: ", err);
    }
}


window.addEventListener('DOMContentLoaded', showAllChat);