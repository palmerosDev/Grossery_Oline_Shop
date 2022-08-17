const fs = require('fs'); 
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////
//          SERVER
///////////////////////////////
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard     = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const temProduct   = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');


const server = http.createServer((req,res)=>{

 
    const {query,pathname} = url.parse(req.url,true);

    // OVERVIEW PAGE
    if(pathname === '/overview' || pathname==='/'){
        res.writeHead(200,{'Content-type': 'text/html'});
        const cardsHtml = dataObj.map((element)=>{return replaceTemplate(tempCard,element)}).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output);




    // PRODUCT PAGE
    } else if ( pathname === '/product'){
        res.writeHead(200,{'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(temProduct,product);

        res.end(output); 
        
        

    // API
    } else if ( pathname === '/api'){
            res.writeHead(200,{'Content-type': 'application/json'});
            res.end(data);


    // NOT FOUND
    } else {
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page cannot be found</h1>');
    }
});
            // PORT, callback function 
server.listen(8080,'127.0.0.1',()=>{
    console.log("Listening to request on port 8080");
});

