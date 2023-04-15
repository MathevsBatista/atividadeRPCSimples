const net = require('net');

function marshall(args) {
  return args.join(' ');
}

function unmarshall(data) {
  return parseFloat(data.toString());
}

function invoke(server, args) {
  return new Promise((resolve, reject) => {
    const client = net.connect({ port: 4000 }, () => {
      const message = marshall(args);
      client.write(message);
    });

    client.on('data', (data) => {
      const result = unmarshall(data);
      resolve(result);
    });

    client.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Enter a number, operator and a number (e.g. 2 + 3)');

  rl.on('line', async (input) => {
    const [a, op, b] = input.trim().split(' ');
    const result = await invoke('localhost', [a, op, b]);
    console.log(`Result: ${result}`);
  });
}

main();

