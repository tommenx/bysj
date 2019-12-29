var db = require('../utils/dbConnection');
var uuid = require('uuid');
var util = require('../utils/util');
var moment = require('moment');

module.exports = {
    /**
     * 通过session获取uid，为新创建的用户创建一个root
     * @param uid
     * @param callback
     */
    createRoot:function (uid,callback) {
        var timestamp = new Date().getTime();
        var guid = uuid.v4();
        var sql = 'INSERT INTO T_File(F_ID,F_UserID,F_PID,F_TypeID,F_Guid,F_LocalName,F_IsDir,F_CreateTime)' +
            'VALUES(0,?,-1,1,?,?,1,?)';
        var params = [uid,guid,'全部文件',timestamp];
        // console.log(timestamp);
        db.connection.query(sql,params,function (err,res) {
           if(err){
               console.log(err.message);
               return;
           }
           // console.log('INSERT SUCCESS',res.insertId);
           callback(res.insertId);
        });
    },

    /**
     * 查找在相同路径下有没有相同名字的文件/文件夹夹
     * @param uid
     * @param pid
     * @param name
     * @param callback
     */
    getFileByName:function (uid,pid,name,isDir,callback) {
        var sql = 'SELECT * FROM T_File WHERE F_UserID = ? AND F_PID = ? AND F_LocalName = ?';
        var params = [uid,pid,name];
        db.connection.query(sql,params,function (err,res) {
            if(err) {
                console.log(err.message);
                return;
            }
            console.log(res);
            callback(res);
        })
    },
    /**
     * 创建文件夹
     * @param uid
     * @param pid
     * @param folderName
     * @param callback
     */
    createFolder:function (uid,pid,folderName,callback) {
        var timestamp = new Date().getTime();
        var guid = uuid.v4();
        var sql = 'INSERT INTO T_File(F_ID,F_UserID,F_PID,F_TypeID,F_Guid,F_LocalName,F_IsDir,F_CreateTime)' +
            'VALUES(0,?,?,1,?,?,1,?)';
        var params = [uid,pid,guid,folderName,timestamp];
        db.connection.query(sql,params,function (err,res) {
           if(err){
               console.log(err.message);
               return;
           }
           console.log('INSERT SUCCESS');
           callback(res);
        });
    },

    /**
     * 通过检查md5找到是否有相同的文件，返回文件的信息
     * @param callback T_File
     * @param md5
     */
    checkExist:function (md5,callback) {
        var sql = 'SELECT * FROM T_File WHERE F_MD = ?';
        var params=[md5];
        db.connection.query(sql,params,function (err,res) {
           if(err){
               console.log(message);
               return;
           }
           console.log(res);
           console.log(res.length);
           callback(res);
        });
    },

    /**
     * 通过uid,pid检查当前目录下同名的文件夹的数量
     * @param uid
     * @param pid
     * @param callback 同名文件的数量
     */
    getNumByLocalName:function (uid,pid,filename,callback) {
        var sql = 'SELECT * FROM T_File WHERE F_UserID = ? AND F_PID = ? AND F_LocalName = ?';
        var params = [uid,pid,filename];
        db.connection.query(sql,params,function (err,res) {
            if(err){
                console.log(err.message);
                return;
            }
            callback(res.length);
        });
    },
    
    
    insertFile:function (uid,pid,md5,guid,typeID,local,remote,access,source,size,isDir,callback) {
        var createTime = new Date().getTime();
        var sql = 'INSERT INTO T_File(F_ID,F_UserID,F_PID,F_TypeID,F_MD,F_Guid,F_AccessUrl,F_SourceUrl,' +
            'F_LocalName,F_RemoteName,F_Size,F_IsDir,F_CreateTime)' +
            'VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?)';
        var params = [uid,pid,typeID,md5,guid,access,source,local,remote,size,isDir,createTime];
        db.connection.query(sql,params,function (err,res) {
            if(err){
                console.log(err);
                return;
            }
            callback(res);

        })
    },

    /**
     *插入一个存在的文件
     * @param uid
     * @param pid
     * @param filename
     * @param md5
     * @param callback
     */
    insertExistFile:function (uid,pid,filename,md5,callback) {
        var sql = 'SELECT * FROM T_File WHERE F_MD = ?';
        var params=[md5];
        db.connection.query(sql,params,function (err,infos) {
            if(err){
                console.log(err.message);
                return;
            }
            var typeID = infos[0].F_TypeID,
                md5 = infos[0].F_MD,
                guid = infos[0].F_Guid,
                accessUrl = infos[0].F_AccessUrl,
                sourceUrl = infos[0].F_SourceUrl,
                remoteName = infos[0].F_RemoteName,
                size = infos[0].F_Size,
                isDir = infos[0].F_IsDir,
                createTime = new Date().getTime();
            var sql = 'INSERT INTO T_File(F_ID,F_UserID,F_PID,F_TypeID,F_MD,F_Guid,F_AccessUrl,F_SourceUrl,' +
                    'F_LocalName,F_RemoteName,F_Size,F_IsDir,F_CreateTime)' +
                    'VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?)';
            var params = [uid,pid,typeID,md5,guid,accessUrl,sourceUrl,filename,remoteName,size,isDir,createTime];
            db.connection.query(sql,params,function (err,res) {
                if(err){
                    console.log(err.message);
                    return;
                }
                callback(res);
            });

        });
    },
    /**
     * 查询当前选中目录下的所有的文件的信息
     * @param pid
     * @param callback
     */
    getChildByPid:function (pid,callback) {
        var sql = 'SELECT * FROM T_File WHERE F_PID = ? ORDER BY F_isDir DESC';
        var params = [pid];
        db.connection.query(sql,params,function (err,res) {
           if(err){
               console.log(err.message);
               return;
           }
           res.forEach(function (value) {
               if(value.F_Size!=null) {
                   value.F_Size = util.size2str(value.F_Size);
               }
               value.F_ShowName = util.formatName((value.F_LocalName));
               value.F_CreateTime = moment(value.F_CreateTime).format('YYYY-MM-DD HH:mm');
           });
           callback(res);
        });
    },
    deleteFiles:function (arr,callback) {
        var sql = 'DELETE FROM T_File WHERE F_ID IN(';
        for(var i =0;i<arr.length;i++){
            sql += arr[i];
            if(i!=arr.length-1){
                sql += ',';
            }
        }
        sql += ')';
        console.log(sql);
        db.connection.query(sql,function (err,res) {
            if(err){
                console.log(err);
                return;
            }
            callback(res);
        })
        // callback('hahaha')
    },
    /**
     * 通过Id来更新文件得名字
     * @param id
     * @param name
     * @param callback
     */
    updateFileName:function (id,name,callback) {
        var sql = 'UPDATE T_File SET F_LocalName = ? WHERE F_ID = ?';
        var params = [name,id];
        db.connection.query(sql,params,function (err,res) {
            if(err){
                console.log(err.message);
                return;
            }
            console.log(res);
            callback(res);
        })
    },
    /**
     * 根据用户id获取某类型的所有文件
     * @param uid
     * @param callback
     */
    getAllFileById:function (uid,type_id,callback) {
        var sql = 'SELECT * FROM T_File WHERE F_UserID = ? AND F_TypeID = ?';
        var params = [uid,type_id];
        db.connection.query(sql,params,function (err,res) {
            if(err){
                console.log(err.message);
                return;
            }
            res.forEach(function (value) {
                if(value.F_Size!=null) {
                    value.F_Size = util.size2str(value.F_Size);
                }
                value.F_ShowName = util.formatName((value.F_LocalName));
                value.F_CreateTime = moment(value.F_CreateTime).format('YYYY-MM-DD HH:mm');
            });
            callback(res);
        })
    }
};