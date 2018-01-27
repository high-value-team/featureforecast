// import {jsonQueryStringify, jsonQueryParse} from 'json-query-string';
var q = require('json-query-string')


const obj = {
    features: [
        {
            quantity:2,
            tags:["a"]
        },
        {
            quantity:1,
            tags:["b"]
        }
    ]
};


var queryString = q.jsonQueryStringify(obj); //{foo=%22bar%22&baz=3}, displays in browser as {foo="bar"&baz=3}
console.log(queryString);
var obj2 = q.jsonQueryParse(queryString);
console.log(obj2);

// var url = "http://mysite.org?" + queryString;
// //Later...
// jsonQueryParse(queryString); //Original object
// //Non-alphanumeric properties will be quoted:
// jsonQueryStringify({'"&={}':34.5}); //{%22%5C%22%26%3D%7B%7D%22=34.5}, displays in browser as {"%5C"%26%3D%7B%7D"=34.5} - ugly but workable