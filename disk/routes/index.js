var express = require('express');
var router = express.Router();
var files = require('../model/files');
var checkLogin = require('../middlewares/check').checkLogin;
var http = require('http');
var querystring = require('querystring');

/* GET home page. */

/**
 * session
 * F_ID:9
 * F_RootID:3
 * F_Nickname:tommenx
 * F_Password:dasdaksdhglk
 * F_PhoneNum:
 */
router.get('/', checkLogin,function(req, res, next) {
    // console.log("user",req.session.user);
    // console.log("rootID",req.session.curID);
    // var pid = req.session.user.curID;
    // files.getChildByPid(pid,function (children) {
    //     res.render('index',{children:children});
    // });
    res.render('index');

});

/**
 * 创建文件夹请求地址
 */
router.post('/folder/create',checkLogin,function (req,res,next) {
    var name = req.body.name;
    var uid = req.session.user.F_ID;
    var pid = req.session.curID;
    var isDir = 1;
    files.getFileByName(uid,pid,name,isDir,function (select_res) {
        //父目录下已经存在该文件夹
        if(select_res.length != 0){
            var create = {
                code:0,
                message:'DUPLICATE FOLDER NAME'
            };
            res.send(create);
        }
        else{
            files.createFolder(uid,pid,name,function (create_res) {
               var create = {
                   code:1,
                   message:'CREATE FOLDER SUCCESS'
               };
               res.send(create);
            });
        }
    })
});

/**
 * 前端将文件上传至cos后，后端接收参数并写入数据库中
 * 向localhost发送请求
 *
 */
router.post('/upload',checkLogin,function (req,res,next) {
    var md5 = req.body.md5;
    var typeID = req.body.typeID;
    var guid = req.body.guid;
    var accessUrl = req.body.accessUrl;
    var sourceUrl = req.body.sourceUrl;
    var localName = req.body.localName;
    var remoteName = req.body.remoteName;
    var size = req.body.size;
    var isDir = req.body.isDir;
    var uid = req.session.user.F_ID;
    var pid = req.session.curID;
    // console.log('PPPPPPIIIIDDDD',pid);
    files.getNumByLocalName(uid,pid,localName,function (count) {
        var local_name='';
        if(count == 0){
            local_name = localName;
        }else{
            count += 1;
            local_name = localName.substr(0,localName.lastIndexOf('.')) +'('+count.toString()+')'+localName.substr(localName.lastIndexOf('.'));
        }
        //插入数据库中
        files.insertFile(uid,pid,md5,guid,typeID,local_name,remoteName,accessUrl,sourceUrl,size,isDir,function (upload_res) {
            console.log(upload_res);
            var id = upload_res.insertId;
            // console.log(id);
            // 向Localhost:8080发送请求
            var data = {
                id:id,
                userId:uid,
                typeId:typeID,
                downloadUrl:sourceUrl,
                title:local_name
            };
            var content=querystring.stringify(data);

            var options={
                hostname: '127.0.0.1',
                port: 8080,
                path: '/doAdd?' + content,
                method: 'GET'
            };

            var addreq = http.request(options,function(addres){
                console.log('STATUS:'+res.statusCode);
                console.log('HEADERS:'+JSON.stringify(res.headers));
                addres.setEncoding('utf-8');
                addres.on('data',function(chunk){
                    console.log('数据片段分隔-----------------------\r\n');
                    console.log(chunk);
                });
                addres.on('end',function(){
                    console.log('响应结束********');
                    var re = {
                        code:1,
                        msg:'UPLOAD_SUCCESS'
                    };
                    res.send(re);
                });
            });
            addreq.end();


        })


    });


});

/**
 * 上传文件时，检查数据库中是否存在MD5摘要相同的文件
 * code=0表示没有相同的文件
 * code=1表示已经通过秒传上传完成
 */
router.post('/upload/check',checkLogin,function (req,res,next) {
    var md5 = req.body.md5;
    var filename = req.body.filename;
    var uid = req.session.user.F_ID;
    var pid = req.session.curID;
    files.checkExist(md5,function (check_res) {
        var res_code = 0;
        var msg = '';
        //说明服务器中没有该文件
        if(check_res.length==0){
            res_code = 0;
            msg='FILE_NOT_EXIST';
            var result = {
                code:res_code,
                msg:msg
            };
            res.send(result);
        }
        //有该文件
        else {
            files.getNumByLocalName(uid,pid,filename,function (repeat) {
                //当前目录下没有同名文件
                var local_name='';
                if(repeat == 0){
                    local_name = filename;
                }else{
                    repeat += 1;
                    local_name = filename.substr(0,filename.lastIndexOf('.')) +'('+repeat.toString()+')'+filename.substr(filename.lastIndexOf('.'));
                }

                files.insertExistFile(uid,pid,local_name,md5,function (insert_res) {
                    res_code = 1;
                    msg = 'FILE_EXIST_AND_INSERT_SUCCESS';
                    var result = {
                        code:res_code,
                        msg:msg
                    };
                    res.send(result);
                });
            })
        }


    });

});

/**
 * 载入全部文件下的文件渲染成html
 */
router.get('/files/all',function (req,res,next) {
    var pid = req.session.curID;
    files.getChildByPid(pid,function (children) {
        res.render('all',{children:children});
    })
});

/**
 *
 */
router.post('/files/all',function (req,res,next) {
   var pid = req.body.pid;
   req.session.curID = pid;
    files.getChildByPid(pid,function (children) {
        console.log(children);
        res.render('all',{children:children});
    })
});

router.post('/files/delete',function (req,res,next) {
    // var file = '58,59';
   var file = req.body.files;
   // console.log('str',files);
   var arr = file.split(',');
   // console.log(arr);
   files.deleteFiles(arr,function (delete_res) {
       var data = {
           files:file
       };
       console.log(data);
       var content=querystring.stringify(data);
       var options={
           hostname: '127.0.0.1',
           port: 8080,
           path: '/doDelete?' + content,
           method: 'GET'
       };
       var deletereq = http.request(options,function(deleteres){
           // console.log('STATUS:'+res.statusCode);
           // console.log('HEADERS:'+JSON.stringify(res.headers));
           deleteres.setEncoding('utf-8');
           deleteres.on('data',function(chunk){
               console.log('数据片段分隔-----------------------\r\n');
               console.log(chunk);
           });
           deleteres.on('end',function(){
               console.log('响应结束********');
               var result = {
                   code:1
               };
               res.send(result);
           });
       });
       deletereq.end();
   });
});

/**
 * 无所谓是否是文件还是文件夹，反正名字不会一样，文件夹有后缀
 */
router.post('/files/rename',function (req,res,next) {
   var pid = req.session.curID;
   var uid = req.session.user.F_ID;
   var name = req.body.name;
   var id = req.body.id;
   // console.log(name,id);
    files.getFileByName(uid,pid,name,0,function (select_res) {
        //父目录下已经存在同名文件
        if(select_res.length != 0){
            var create = {
                code:0,
                msg:'DUPLICATE FOLDER NAME'
            };
            res.send(create);
        }
        //更新文件名
        else{
            files.updateFileName(id,name,function (update_res) {
                // console.log(update_res);
                var data = {
                    id:id,
                    title:name
                };
                var content = querystring.stringify(data);
                var options = {
                    hostname: '127.0.0.1',
                    port: 8080,
                    path: '/doUpdate?' + content,
                    method: 'GET'
                };
                var updatereq = http.request(options,function (updateres) {
                    updateres.setEncoding('utf-8');
                    updateres.on('data',function(chunk){
                        console.log('数据片段分隔-----------------------\r\n');
                        console.log(chunk);
                    });
                    updateres.on('end',function(){
                        console.log('响应结束********');
                        var result = {
                            code : 1,
                            msg : 'UPDATE SUCCESS'
                        };
                        res.send(result);
                    });
                });
                updatereq.end();


            })
        }
    })

});




router.get('/bread',function (req,res,next) {
    var code = {
        id:req.session.user.F_RootID
    };
    res.send(code);
});



router.get('/img',checkLogin,function (req,res,next) {
    res.render('img');
});

/**
 * 获得所有的图片文件
 */
router.post('/img',checkLogin,function (req,res,next) {
    var uid = req.session.user.F_ID;
    var type_id = 2;
    files.getAllFileById(uid,type_id,function (files) {
      res.send(files);
    })
});


router.get('/video',checkLogin,function (req,res,next) {
    res.render('video');
});

router.get('/doc',checkLogin,function (req,res,next) {
    res.render('doc');
});

router.post('/doc',checkLogin,function (req,res,next) {
    var uid = req.session.user.F_ID;
    var type_id = 5;
    files.getAllFileById(uid,type_id,function (files) {
        res.send(files);
    })
});

router.get('/torrent',checkLogin,function (req,res,next) {
    res.render('torrent');
});
router.post('/torrent',checkLogin,function (req,res,next) {
    var uid = req.session.user.F_ID;
    var type_id = 6;
    files.getAllFileById(uid,type_id,function (files) {
        res.send(files);
    })
});

router.get('/music',checkLogin,function (req,res,next) {
    res.render('music');
});

router.post('/music',checkLogin,function (req,res,next) {
    var uid = req.session.user.F_ID;
    var type_id = 4;
    files.getAllFileById(uid,type_id,function (files) {
        res.send(files);
    })
});


module.exports = router;
