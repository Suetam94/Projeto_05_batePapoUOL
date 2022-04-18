async function login() {
    const container = document.getElementById('container');
    const login = document.getElementById('login');
    const batePapo = document.getElementById('bate-papo');
    const userName = document.querySelector('#login input');
    sessionStorage.setItem('username', userName.value);

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

async function sendMessage() {
    const newMessageInput = document.getElementById('message');
    const newMessage = newMessageInput.value;
    newMessageInput.value = '';
    await sendMessageRequest(newMessage);
}

async function sendMessageRequest(message) {
    const response = await axios({
        method: 'post',
        url: 'https://mock-api.driven.com.br/api/v6/uol/messages',
        data: {
            from: sessionStorage.getItem('username'),
            to: "Todos",
            text: message,
            type: "message" // ou "private_message" para o bônus
        }
    });

    // return response.status;
}

async function isEnterPressed() {
    const id = event.target.id;
    if (id === 'username' && event.keyCode === 13) {
        await login();
    }
    if (id === 'message' && event.keyCode === 13) {
        await sendMessage();
    }
}

async function keepMessagesUpdate(username) {
    setInterval(async () => {
        const authMessages = await getMessages(username);
        await appendMessages(username, authMessages)
    }, 1000);
}

async function appendMessages(username, authMessages) {
    const messagesEl = document.getElementById('messages');

    messagesEl.innerHTML = ``;
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

    window.scrollTo(0, document.body.scrollHeight);
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

