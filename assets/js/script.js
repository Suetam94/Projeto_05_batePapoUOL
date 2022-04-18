async function login() {
    const container = document.getElementById('container');
    const login = document.getElementById('login');
    const batePapo = document.getElementById('bate-papo');
    const userName = document.querySelector('#login input');

    const loginStatus = await loginRequest(userName.value);

    if (loginStatus !== 200) {
        location.reload();
    }

    const authMessages = await getMessages(userName.value);
    console.log(authMessages);
    await keepLoginAlive(userName.value);

    container.classList.remove('login');
    login.style.display = 'none';
    batePapo.style.display = 'block';
}

async function getMessages(name) {
    const messages = await messagesRequest();

    return messages.data.map(message => {
        if (message.to === 'Todos' || message.to === name) {
            return message;
        }
    });
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

async function keepLoginAlive(name) {
    const intervalId = setInterval(async () => await statusAliveRequest(name), 3000);
}

async function statusAliveRequest(name) {
    await axios({
        method: 'post',
        url: 'https://mock-api.driven.com.br/api/v6/uol/status',
        data: {
            name: name
        }
    });
}

async function messagesRequest() {
    return axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
}

