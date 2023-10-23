/* eslint-disable @typescript-eslint/no-var-requires */
// https://stackoverflow.com/a/63602976/470749
const express = require('express');
const proxy_router = express.Router();
// const app = express();
const https = require('https');
const http = require('http');
// const { response } = require('express');

// const targetUrl = process.env.TARGET_URL || 'https://jsonplaceholder.typicode.com'; // Run localtunnel like `lt -s rscraper -p 8080 --print-requests`; then visit https://yourname.loca.lt/todos/1 .

const proxyServerPort = process.env.PROXY_SERVER_PORT || 8080;

// eslint-disable-next-line max-lines-per-function
proxy_router.use('/', async (clientRequest, clientResponse) => {
    const targetUrl = clientRequest.query.url; //clientRequest.body.url;
    console.log(targetUrl)

    const foo = fetch(targetUrl, {encoding: null}).then((foo_res)=>{
        const type = foo_res.headers.get("Content-Type");
        console.log(type);
        // clientResponse.headers['content-type'] = 
        if (type.startsWith("text/html") || type.startsWith("application/rss")){
            foo_res.text().then((result)=>{clientResponse.send(result)})
        }
        else if (type.includes("json")) {
            foo_res.json().then((result)=>{clientResponse.send(result)})
        }
        else if (type.startsWith("image")){
            console.log("That's an image")

            clientResponse.set("Content-Type", type);
            const arraybuffer = foo_res.arrayBuffer().then((arrayb)=>{
                const buff = Buffer.from(arrayb)
                // console.log(buff)
                clientResponse.write(buff);
                clientResponse.end()
            });
        }
        else{
            clientResponse.send("I don't know how to process the type: "+type)
        }
        // clientResponse.send(foo_res.blob());

    })
    .catch((err)=>{console.log(err)});
    return
  const parsedHost = targetUrl.split('/').splice(2).splice(0, 1).join('/');
  let parsedPort;
  let parsedSSL;
  if (targetUrl.startsWith('https://')) {
    parsedPort = 443;
    parsedSSL = https;
  } else if (targetUrl.startsWith('http://')) {
    parsedPort = 80;
    parsedSSL = http;
  }
  const options = {
    hostname: parsedHost,
    port: parsedPort,
    path: targetUrl,//clientRequest.url,
    method: "GET",
    headers: {
      'User-Agent': clientRequest.headers['user-agent'],
    },
  };

  const serverRequest = parsedSSL.request(options, function (serverResponse) {
    let body = '';
    if (String(serverResponse.headers['content-type']).indexOf('text/html') !== -1) {
      serverResponse.on('data', function (chunk) {
        body += chunk;
      });

      serverResponse.on('end', function () {
        // Make changes to HTML files when they're done being read.
        // body = body.replace(`example`, `Cat!`);

        clientResponse.writeHead(serverResponse.statusCode, serverResponse.headers);
        // clientResponse.WriteHeader(parsedSSL.StatusOK)
        clientResponse.end(body);
      });
    } else {
      serverResponse.pipe(clientResponse, {
        end: true,
      });
      clientResponse.contentType(serverResponse.headers['content-type']);
    }
  });

  serverRequest.end();
});

// /console.log(`Proxy server listening on port ${proxyServerPort}`);
function base64encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

module.exports = proxy_router;

