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
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 File Not Found');
                res.end();
                return;
            }

            const placeholder = breeds.map(breed => `<option value="${breed}">${breed}</option>`);
            const modifiedData = data.toString().replace('{{catBreeds}}', placeholder);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(modifiedData);
            res.end();
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
        const filePath = path.normalize(
            path.join(__dirname, '../views/addBreed.html')
        );
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
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {

        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            };
            const oldPath = files.upload.path;
            const newPath = path.normalize(path.join(process.argv[1].replace('index.js', ''), '/content/images/' + files.upload.name));
            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`Image succesfully uploaded to: ${newPath}`)
            })
        })
    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = '';
        req.on('data', data => {
            formData += data;
        });

        req.on('end', () => {
            const body = qs.parse(formData);
            fs.readFile('./data/breeds.json', (err, data) => {
                if (err) {
                    throw err;
                }
                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                const json = JSON.stringify(breeds);
                fs.writeFile('./data/breeds.json', json, () => {
                    console.log(`${body.breed} was added successfully to the breeds.`)
                })
            })
        });

        res.writeHead(301, { 'location': '/' });
        res.end();
    }
    else {
        return true;
    };
};
