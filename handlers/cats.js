const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds');
const cats = require('../data/cats');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/cats/add-cat' && req.method === 'GET') {
        const filePath = path.normalize(
            path.join(__dirname, '../views/addCat.html')
        );
        readHtml(filePath, req, res);
    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
        const filePath = path.normalize(
            path.join(__dirname, '../views/addBreed.html')
        );
        readHtml(filePath, req, res);
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {

    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = '';
        req.on('data', data => {
            formData += data;
        });

        req.on('end', () => {
            const body = qs.parse(formData);
            console.log(body.breed);
        });

        res.writeHead(301, { 'location': '/' });
        res.end();
    }
    else {
        return true;
    };
};

function readHtml(filePath, req, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('404 File Not Found');
            res.end();
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
};
