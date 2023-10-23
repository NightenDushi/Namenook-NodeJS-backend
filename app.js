const http = require('http');
const path = require('path');
const fs = require('fs');

const express = require('express');
const contact_router = require('./routes/contact')
const upload_router = require('./routes/upload')
const proxy_router = require('./routes/proxy')
const app = express();

app.use((req, res, next)=>{
    const clientUrl = req.get('origin');
    console.log(clientUrl);
    const accepted_url = ["http://localhost:8081", "http://localhost:8080", "https://nighten.fr", "https://nathan-guilhot.com", "https://api.nathan-guilhot.com", "https://namenook.nathan-guilhot.com"]

    res.header("Access-Control-Allow-Origin", (accepted_url.includes(clientUrl)) ? clientUrl : "https://nighten.fr/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
    next();
})

app.use(express.json({limit: '1mb'}));

app.use("/api/contacts", contact_router);
app.use("/api/upload", upload_router);
app.use("/api/proxy", proxy_router);

const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log(`Listening to port ${port}...`)
    console.log(`   Environement: ${process.env.NODE_ENV}`)
    console.log("   __dirname", __dirname)
})

//Serve namenook static file
const namenook_app = express();
const namenook_PORT = 3000;
const namenook_path = path.join(__dirname,'../namenook/dist');

namenook_app.use(express.static(namenook_path));
namenook_app.use((req, res, next)=>{
    fs.readFile(path.join(namenook_path, '/index.html'), 'utf-8', (err, content) => {
        if (err) {
        console.log('We cannot open "index.html" file.')
        }
        console.log("Serve not found file")

        res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        })

        res.end(content)
    })
});
namenook_app.listen(namenook_PORT, () => {
    console.log(`Namenook served on port: ${namenook_PORT}`)
    console.log(namenook_path)
});