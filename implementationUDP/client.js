const dgram = require('dgram');
const client = dgram.createSocket('udp4');

function marshall(args) {
    return args.join(' ');
}

function unmarshall(data) {
    return parseFloat(data.toString());
}

function invoke(server, args) {
    return new Promise((resolve, reject) => {
        const message = marshall(args);
        client.send(message, server.port, server.host, (err) => {
            if (err) {
                reject(err);
            }
        });

        client.on('message', (msg, rinfo) => {
            const result = unmarshall(msg);
            resolve(result);
        });
    });
}

async function main() {
    let [a = 0, op = '+', b = 0] = process.argv.slice(2);
    const server = {
        host: 'localhost',
        port: 4000,
    };
    while (true) {
        const result = await invoke(server, [a, op, b]);
        console.log(result);
        [a, op, b] = await new Promise((resolve) => {
            process.stdin.once('data', (input) => {
                const [a = 0, op = '+', b = 0] = input.toString().trim().split(/\s+/);
                resolve([a, op, b]);
            });
        });
    }
}

main();

