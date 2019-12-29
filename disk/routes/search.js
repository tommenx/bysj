var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
var http = require('http');
var querystring = require('querystring');


/* GET home page. */
// router.get('/',checkLogin, function(req, res, next) {
//     res.render('search', { title: 'Express' });
// });

router.get('/',checkLogin,function (req,res,next) {
   res.render('searchres');
});


router.post('/keyword',function (req,res,next) {
    var keyword = req.body.key;
    // var keyword = "工业设备";
    var data = {
        key:keyword
    };
    console.log(data);
    var content = querystring.stringify(data);
    var options={
        hostname: '127.0.0.1',
        port: 8080,
        path: '/doSearch?' + content,
        method: 'GET'
    };
    var searchreq = http.request(options,function(searchres){
        // console.log('STATUS:'+res.statusCode);
        // console.log('HEADERS:'+JSON.stringify(res.headers));
        searchres.setEncoding('utf-8');
        searchres.on('data',function(chunk){
            console.log('数据片段分隔-----------------------\r\n');
            console.log(chunk);
            var obj = JSON.parse(chunk)
            res.render('searchitem',{items:obj.search});
        });
    });
    searchreq.end();

});
module.exports = router;