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
         form.reset();
    }catch(err){
        console.log("error at message send frontend",err);
    }
})