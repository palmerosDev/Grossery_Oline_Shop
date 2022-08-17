const fs = require('fs'); 
const http = require('http');
const url = require('url');

///////////////////////////////////////
//          EXTERNA FUNCTIONS
/////////////////////////////////////
const replaceTemplate = (temp,product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);

    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    }

    return output;

}

////////////////////////////////////
//          SERVER
///////////////////////////////
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard     = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const temProduct   = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');


const server = http.createServer((req,res)=>{
    const pathName = req.url;

    // OVERVIEW PAGE
    if(pathName === '/overview' || pathName==='/'){
        res.writeHead(200,{'Content-type': 'text/html'});
        const cardsHtml = dataObj.map((element)=>{return replaceTemplate(tempCard,element)}).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        console.log(cardsHtml);
        res.end(output);




    // PRODUCT PAGE
    } else if ( pathName === '/product'){
        res.end('This is the PRODUCT'); 
        
        

    // API
    } else if ( pathName === '/api'){
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

