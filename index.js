/**
 * Created by Jaime on 23/06/2017.
 */
const http = require('http');
const employeeService = require('./lib/employees');
const responder = require('./lib/responseGenerator');
const Vue = require('vue');

// const staticFile = responder.staticFile('/public');

http.createServer((req, res) => {
    //A parsed url to work with in case there are parameters
    let _url;
    //In case the client uses lower case for methods
    res.writeHead(200, {'Content-Type': 'text/html'});
    req.method = req.method.toUpperCase();
    console.log(req.method + ' ' + req.url);


    if (req.method !== 'GET') {
        res.writeHead(501, {
            'Content-Type': 'text/html'
        });
        return res.end(req.method + ' is not implemented by this server.');
    }

    // res.end('The current time is ' + Date.now());

    if (_url = /^\/employees$/i.exec(req.url)) {
        //return a list of employees
        employeeService.getEmployees((error, data) => {
            if (error) {
                return responder.send500(error, res);
            }

            /*res.writeHead(200);
             return res.end('employee list');*/

            return responder.sendJson(data, res);
        })
    } else if (_url = /^\/employees\/(\d+)$/i.exec(req.url)) {
        // find the employee by the id in the route
        employeeService.getEmployee(_url[1], (error, data) => {
            if (error) {
                return responder.send500(error, res);
            } else if (!data) {
                return responder.send404(res);
            }
            /*
             res.writeHead(200);
             return res.end('a single employee');
             */
            return responder.sendJson(data, res);
        });
    } else {
        res.writeHead(404);
        return res.end('static file maybe');
    }
}).listen(1555, '127.0.0.1');

let app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue.js!'
    }
});