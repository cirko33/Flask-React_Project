import dgram from 'dgram';

export const server = dgram.createSocket('udp4');
export var isServerSet = false;

export const set = () => {
    if(isServerSet)
        return;

    isServerSet = true;
    server.bind('0.0.0.0', 5001);
    server.on('message', (mess, rinfo) => {
        window.location.reload();
    });
}

