const dgram = require('dgram');

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

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  const args = unmarshall(msg);
  const result = handleInvocation(args);
  const message = marshall(result);
  server.send(message, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error(err);
    }
  });
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

server.bind(4000);

