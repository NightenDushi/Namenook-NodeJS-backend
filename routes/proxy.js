/* eslint-disable @typescript-eslint/no-var-requires */
// https://stackoverflow.com/a/63602976/470749
const express = require('express');
const proxy_router = express.Router();
const https = require('https');
const http = require('http');

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
        clientResponse.writeHead(serverResponse.statusCode, serverResponse.headers);
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

module.exports = proxy_router;

