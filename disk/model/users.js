var db = require('../utils/dbConnection');
var files = require('./files');


module.exports = {
    create:function (user,callback) {
        var sql = 'INSERT INTO T_User(F_ID,F_Nickname,F_Password,F_PhoneNum)' +
            'VALUES(0,?,?,?)';
        var params = [user.nickname,user.password,user.phonenum];
        db.connection.query(sql,params,function (err,res) {
            if (err){
                console.log(err.message);
                return;
            }
            files.createRoot(res.insertId,function (rid) {
                var sql2 = 'UPDATE T_User SET F_RootID = ? WHERE F_ID = ?';
                var params2 = [rid,res.insertId];
                db.connection.query(sql2,params2,function (error,result) {
                    if(error) {
                        console.log(error.message);
                        return;
                    }
                    callback(result);
                })
            })
        })
    },
    getByPhoneNum:function (user,callback) {
        var sql = 'SELECT * FROM T_User WHERE F_PhoneNum = ?';
        var params = [user.phonenum];
        db.connection.query(sql,params,function (err,res) {
            if(err){
                console.log(err.message);
                return;
            }
            callback(res);
        })

    }
};