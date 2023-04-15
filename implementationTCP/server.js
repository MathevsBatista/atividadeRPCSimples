const net = require('net');

function marshall(result) {
    return result.toString();
}

function unmarshall(data) {
    return data.toString().trim().split(' ');
}

function handleInvocation(args) {
    const [a, op, b] = args;
    let result;
    switch (op) {
        case '+':
            result = parseFloat(a) + parseFloat(b);
            break;
        case '-':
            result = parseFloat(a) - parseFloat(b);
            break;
        case '*':
            result = parseFloat(a) * parseFloat(b);
            break;
        case '/':
            result = parseFloat(a) / parseFloat(b);
            break;
        default:
            throw new Error('Invalid operator');
    }
    return result;
}

const server = net.createServer((client) => {
    client.on('data', (data) => {
        const args = unmarshall(data);
        const result = handleInvocation(args);
        const message = marshall(result);
        client.write(message);
    });

    client.on('end', () => {
      console.log('Client disconnected');
    });
});

server.listen(4000, () => {
    console.log('Server listening on port 4000');
});

