/**
 * Created by Jaime on 24/06/2017.
 */
const fs = require('fs');

exports.send404 = response => {
    console.error("Resource not found");

    response.writeHead(404, {
        'Content-Type': 'text/html'
    });
    response.end('Not Found');
};

exports.sendJson = (data, response) => {
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(data));
};

exports.send500 = (data, response) => {
    console.error(data.read);

    response.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    response.end(data);
};

exports.staticFile = staticPath => {
    return (data, response) => {
        let readStream;
        data = data.replace(/^(\/home)(.html)?$/i, '$1.html');
        data = '.' + staticPath + data;
        fs.stat(data, (error, stats) => {
            if (error || stats.isDirectory()) {
                return exports.send404(response);
            }
            readStream = fs.createReadStream(data);
            return readStream.pipe(response);
        });
    }
};