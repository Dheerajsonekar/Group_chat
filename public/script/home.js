const logout = document.getElementById('logout');
logout.addEventListener('click', async (e)=>{
    e.preventDefault();

    localStorage.clear();
    window.location.href = './login.html';
})