const users = [];

const send = (ws, data) => {
    const d = JSON.stringify({
        jsonrpc: '2.0',
        ...data
    })

    ws.send(d);

    //console.log(d)
}

const isUsernameTaken = (username) => {
    let taken = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            taken = true;
            break;
        }
    }
    return taken;
}

module.exports = (ws, req) => {
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);

        switch (data.method) {
            case 'username':
                if (isUsernameTaken(data.params.username)) {
                    send(ws, { id: data.id, error: { message: 'Username is already taken' } });
                } else {
                    users.push({
                        username: data.params.username,
                        ws: ws,
                    });
                    send(ws, { id: data.id, result: { status: 'success' } });

                }
                //store user with select username
                break;
            case 'message':
                // send message to all connect user
                const username = users.find(user => user.ws == ws).username;
                users.forEach(user => {
                    send(user.ws, { method: 'update', params: { message: data.params.message, username: username } });


                })
                // console.log(data.params.message)
                // data.params.message = ''
                // console.log(data.params.message)
                break;
            case 'popup':
                // send message to all connect user
                //const username = users.find(user => user.ws == ws).username;
                users.forEach(user => {
                    send(user.ws, { method: 'update', params: { message: data.params.message, username: "Chatbot" } });


                })
                // console.log(data.params.message)
                // data.params.message = ''
                // console.log(data.params.message)
                break;
            case 'leave':
                // send message to all connect user
                //const username = users.find(user => user.ws == ws).username;
                users.forEach(user => {
                    send(user.ws, { method: 'update', params: { message: data.params.message, username: "Chatbot" } });


                })
                // console.log(data.params.message)
                // data.params.message = ''
                // console.log(data.params.message)
                break;

        }
    })
}