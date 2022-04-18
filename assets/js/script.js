async function login() {
    const container = document.getElementById('container');
    const login = document.getElementById('login');
    const batePapo = document.getElementById('bate-papo');
    const userName = document.querySelector('#login input');

    const loginStatus = await loginRequest(userName.value);

    if (loginStatus !== 200) {
        location.reload();
    }
    await keepLoginAlive(userName);

    const authMessages = await getMessages(userName);
    await appendMessages(userName, authMessages);
    await keepMessagesUpdate(userName);

    container.classList.remove('login');
    login.style.display = 'none';
    batePapo.style.display = 'block';
}

async function keepMessagesUpdate(username) {
    setInterval(async () => {
        const authMessages = await getMessages(username);

        if (authMessages.length > sessionStorage.getItem('messagesLength')) {
            await appendMessages(username, authMessages)
        }
    }, 1000);
}

async function appendMessages(username, authMessages) {
    sessionStorage.setItem('messagesLength', authMessages.length);
    const messagesEl = document.getElementById('messages');

    authMessages.forEach(message => {
        if (message) {
            if (message.type === 'status') {
                messagesEl.innerHTML += `<div class="${message.type}">
                                        <span class="time">(${message.time})</span>
                                        <span class="username"><strong>${message.from}</strong> ${message.text}</span>
                                    </div>`;
            } else {
                messagesEl.innerHTML += `<div class="${message.type}">
                                        <span class="time">(${message.time})</span>
                                        <span class="username"><strong>${message.from}</strong> para <strong>${message.to}</strong> ${message.text}</span>
                                    </div>`;
            }
        }
    })

}

async function getMessages(username) {
    const messages = await messagesRequest();

    return messages.data.map(message => {
        if (message.to === 'Todos' || message.to === username.value) {
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

async function keepLoginAlive(username) {
    setInterval(async () => await statusAliveRequest(username.value), 3000);
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

