async function login() {
    const container = document.getElementById('container');
    const login = document.getElementById('login');
    const batePapo = document.getElementById('bate-papo');
    const userName = document.querySelector('#login input');

    const loginStatus = await loginRequest(userName.value);

    if (loginStatus !== 200) {
        location.reload();
    }

    container.classList.remove('login');
    login.style.display = 'none';
    batePapo.style.display = 'block';
}

async function loginRequest(name) {
    const response = await axios({
        method: 'post',
        url: 'https://mock-api.driven.com.br/api/v6/uol/participants',
        data: {
            name: name
        }
    });

    return response.status;
}