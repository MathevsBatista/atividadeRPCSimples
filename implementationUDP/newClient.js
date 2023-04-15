const dgram = require('dgram');

function marshall(args) {
  return args.join(' ');
}

function unmarshall(data) {
  return parseFloat(data.toString());
}

function invoke(server, args) {
  return new Promise((resolve, reject) => {
    const client = dgram.createSocket('udp4');

    const message = marshall(args);
    client.send(message, 4000, server, (err) => {
      if (err) {
        reject(err);
        return;
      }
      client.once('message', (data) => {
        const result = unmarshall(data);
        client.close();
        resolve(result);
      });
    });

    client.on('error', (err) => {
      client.close();
      reject(err);
    });
  });
}

async function main() {
  const server = process.argv[2];

  while (true) {
    const [a, op, b] = await new Promise((resolve) => {
      const stdin = process.openStdin();
      stdin.once('data', (data) => {
        resolve(data.toString().trim().split(' '));
      });
    });

    const result = await invoke(server, [a, op, b]);
    console.log(result);
  }
}

main().catch((err) => {
  console.error(err);
});

