var express = require('express');
var sha1 = require('sha1');
var users = require('../model/users');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('signup', { title: 'Express' });
});


/**
 * code 1 注册成功
 * code 0 重复手机号
 */
router.post('/', function(req, res, next) {
    var phonenum = req.body.phonenum;
    var username = req.body.username;
    var password = sha1(req.body.password);
    var user = {
        nickname:username,
        phonenum:phonenum,
        password:password
    };
    users.getByPhoneNum(user,function (search_res) {
        if(search_res.length == 0){
            users.create(user,function (create_res) {
                console.log(create_res);
                var insert = {
                    code:1
                };
                res.send(insert);
            });
        }else{
            var insert = {
                code: 0
            };
            res.send(insert);
        }
    });
});

module.exports = router;