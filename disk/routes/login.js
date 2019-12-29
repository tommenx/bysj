var express = require('express');
var sha1 = require('sha1');
var router = express.Router();
var users = require('../model/users');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

/**
 * code 0 用户不存在
 * code 1 登录成功
 * code 2 密码错误
 */
router.post('/',function (req,res,next) {
    var phone = req.body.phone;
    var password = req.body.password;
    var code = -1;
    var message = '';
    console.log(phone,password);
    var user = {
        phonenum:phone
    };
    users.getByPhoneNum(user,function (select_res) {
        // console.log(select_res);
        if(select_res.length == 0){
            code = 0;
            message = 'NO USER'
        }
        else if (select_res[0].F_Password == sha1(password)){
            code = 1;
            message = 'LOGIN SUCCESS'
            req.session.user = select_res[0];
            req.session.curID = req.session.user.F_RootID;
        }
        else{
            code = 2;
            message = 'WRONG PASSWORD'
        }
        var login = {
            code: code,
            message:message
        };
        res.send(login);
    });
});
module.exports = router;