const http = require("http");
const path = require("path");
const fs = require("fs");
const mongo_client= require('mongodb').MongoClient;
const mongoconnection_details = require('./connection/mongoconnection.js');
const mongo_client_connection = new mongo_client(mongoconnection_details.connectionurl);

const server = http.createServer((req, res) => {
    
    /*

        

        we can Navigate to different pages via different requests. 
        if / then goto index.html
        if /about about then goto about.html
        if /api then laod the JSON file  /  ;) this might be something you need for your exam. 



    */
   
    
    
    if (req.url === '/') {
        // read public.html file from public folder
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
                    (err, content) => {
                                    
                                    if (err) throw err;
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    res.end(content);
                        }
              );
     }

    else if (req.url === '/api') {
        const headers =
        {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Content-Type": 'application/json'
        };
        (async(req,res)=>{
            try
            {
                await mongo_client_connection.connect();
                const database = mongo_client_connection.db(mongoconnection_details.database);
                const collection = database.collection(mongoconnection_details.collection);
                if (req.method === 'GET') {
                    var docs_json = await collection.find({}).toArray();
                    docs_json = JSON.stringify(docs_json, null, 2);
                    fs.writeFile('./public/db.json', docs_json, () => {});
                    res.writeHead(200, headers);
                    res.end(docs_json);
                    console.log(docs_json);
                  }
                  else {
                    res.writeHead(405, {'Content-Type': 'text/plain'});
                    res.end('Method Not supported');
                  } 
            }catch (err) {
                console.error(err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('server failed to handle the request');
              }
        })(req,res);


        // read the about.html file public folder
        // fs.readFile(
        //     path.join(__dirname, 'public', 'about.html'),
        //             (err, content) => {
                                    
        //                             if (err) throw err;
        //                             res.writeHead(200, { 'Content-Type': 'text/html' });
        //                             res.end(content);
        //                 }
        //       );
     }
    else if (req.url==='/api')
    {
        fs.readFile(
            path.join(__dirname, 'public', 'db.json'),'utf-8',
                    (err, content) => {
                                    
                                    if (err) throw err;
                                    // Please note the content-type here is application/json
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(content);
                        }
              );
    }
    else{
        res.end("<h1> 404 nothing is here</h1>");
    }

    /*

        But what if we have  1000 pages/urls ? do we need to write 1000 if-else statements?

    /*/
});

// it will first try to look for
// environment variable, if not found then go for 5959
const PORT= 2908;

// port, callback
server.listen(PORT,()=> console.log(`Great our server is running on port ${PORT} `));