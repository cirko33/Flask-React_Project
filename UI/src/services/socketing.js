const udp = require('dgram-promise');

const server = udp.createSocket('udp4');
server.bind('0.0.0.0', 5001);

while(true) {
    server.on('message', (mess, rinfo) => {
        window.location.reload();
    });
}