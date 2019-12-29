/**
 * 
 * @param {Object} file 从input中获取的文件
 * @param {Object} callback MD5摘要
 */
function calculate(file,callback) {
	var fileReader = new FileReader();
	var blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
	var chunkSize = 2097152;
	var chunks = Math.ceil(file.size / chunkSize);
	var currentChunk = 0;
	var spark = new SparkMD5();

	fileReader.onload = function(e) {
		console.log("read chunk nr", currentChunk + 1, "of", chunks);
		spark.appendBinary(e.target.result); // append binary string  
		currentChunk++;

		if(currentChunk < chunks) {
			loadNext();
		} else {
			var md5 = spark.end();
			console.log("finished loading");
			console.info("computed hash", md5); // compute hash
			callback(md5);
		}
	};

	function loadNext() {
		var start = currentChunk * chunkSize,
			end = start + chunkSize >= file.size ? file.size : start + chunkSize;

		fileReader.readAsBinaryString(blobSlice.call(file, start, end));
	};
	loadNext();
	
}
/**
 * 
 * @param {Object} size 文件的大小
 * @param {Object} callback size,unit 保留一位小数
 */

function size2str(size,callback) {
	var c = 0;
	var unit = "";
	while(size > 1024){
		size = size/1024.0;
		c++;
	}
	switch(c){
		case 0:unit='B';break;
		case 1:unit='KB';break;
		case 2:unit='M';break;
		case 3:unit='G';break;
	}
	size = size.toFixed(1);
	callback(size,unit);
}

/**
 * 通过文件的名字返回文件的类型码
 * @param name
 * @returns {number}
 */
function getFileType(name){
	var i = name.lastIndexOf('.');
	var type = name.slice(i+1).toLowerCase();
	var typeID = 7;
	if(type == 'doc' || type == 'docx' || type=='xls' || type=='xlsx'|| type == 'ppt' || type=='pptx' || type == 'pdf' || type == 'txt'){
		typeID = 5;
	}
	else if(type == 'mp4' || type == 'avi' || type == 'mov'|| type=='rmvb'|| type=='flv'||type=='mov'){
		typeID = 3;
	}
	else if(type == 'jpg' || type == 'jpeg' || type=='png' || type=='bmp'){
		typeID = 2;
	}
	else if(type=='mp3'||type=='wmv'){
		typeID = 4;
	}
	else if (type=='torrent'){
		typeID = 6
	}
	return typeID;
}

function formatName(name){
	var len = -1;
	if(name.length>25){
		len = 25;
	}
	else{
		len = name.length;
	}
	var after = name.substr(0,len);
	after += '...';
	console.log(after);
	return after;
}

/**
 *
 * @param name 文件的名字
 * @param num 文件大小的数值
 * @param unit 文件大小的单位
 */
function createRow(name, num, unit) {
    var rowIndex = $('#table-upload-list tr:last').attr("data-row");
    if (rowIndex == '' || rowIndex == null) {
        rowIndex = parseInt('0');
    } else {
        rowIndex = parseInt(rowIndex) + 1;
    }
    var htmlList = '<tr class="up-list" data-row=' + rowIndex + '>';
    htmlList += '<td class="name"><span>' + name + '</span></td>';
    htmlList += '<td class="size"><span>' + num + unit + '</span></td>';
    htmlList += '<td class="pro">'
    htmlList += '<div class="progress">'
    htmlList += '<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
    htmlList += '0%';
    htmlList += '</div></div></td>';
    htmlList += '<td class="op">';
    htmlList += ' <span class="upload-status">正在上传</span>';
    htmlList += '</td></tr>';
    $('#table-upload-list tr:last').after(htmlList);
    // console.log(htmlList);
    htmlList = '';
}


/**
 * 取到最后一行文件列表，更改进度条
 */
function changeProcess() {
    // var i = 0;
    // var rowIndex = $('#table-upload-list tr:last').attr("data-row");
    // if (rowIndex == '' || rowIndex == null) {
    //     rowIndex = parseInt('0');
    // } else {
    //     rowIndex = parseInt(rowIndex);
    // }
    var progress = $('#table-upload-list tr:last .progress-bar');
    for(var i = 0;i <100;i++){
        setTimeout(function(){
            progress.css('width',i+'%').text(i+'%');
        },1000);
    }
}

/**
 * 检查文件在cos中是否已经存在，若存在直接写入当前用户的当前目录下，实现秒传的功能，返回值为1
 * @param file 文件对象
 * @param callback 返回的结果
 */
function checkExist(file,callback) {
    calculate(file,function (md5) {
       var filename = file.name;
       $.ajax({
           type:'POST',
           url:'/upload/check',
           dataType:'json',
           data:{
               md5:md5,
               filename:filename
           },
           success:function (res) {
               callback(res,md5);
           }
       })
    });
}

/**
 * 生成uuid
 * @returns {string}
 */
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

/**
 * index载入以及上传了文件或新建文件夹时调用强制刷新UI
 */
function getallChildren() {
    $.ajax({
        type: 'GET',
        url: '/files/all',
        success: function (res) {
            $('#list_group').html(res);
        }
    });
}

/**
 * 设置面包屑导航区
 */
function setInitalBread() {
    $.ajax({
        type:'GET',
        url:'/bread',
        success:function (res) {
            var html = '<li data-deep="0" data-id="'+res.id+'"><span>全部文件</span></li>';
            $('#bread').html(html);
        }
    })
}

/**
 * 点击列表中文件项，传入data-id
 * @param id
 */
function addBreadCrumb(id,name) {
    var deep = $('#bread li:last').attr('data-deep');
    deep = parseInt(deep);
    deep += 1;
    var html = '<li data-deep="'+deep+'" data-id="'+id+'"><span>'+name+'</span></li>';
    $('#bread:last').append(html);
}


/**
 * 传入deep，删除deep之后所有的元素
 * @param deep
 */
function removeBreadCrumb(deep) {
    var list = $('#bread li');
    // console.log(list[0]);
    for(var i = list.length - 1;i > deep;i --){
        list[i].remove();
    }
}


/**

/**
 * 点击文件列表的触发的操作
 * @param type
 * @param id
 */
// $('.info').click(function () {
//     alert('进入');
//     var id = $(this).attr('data-type');
//     console.log(id);
// });

/**
 * 关闭上传的模态框触发的操作
 */
function completeAndRemove() {
    var html = '<tr class="up-list" style="display: none"><td class="name">' +
        '<span>xxx.zip</span></td><td class="size"><span>513MB</span></td><td' +
        ' class="pro"><div class="progress"><div class="progress-bar"' +
        ' role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"' +
        ' style="width: 60%;">60%</div></div></td><td class="op"><span class="fa fa-pause">' +
        '</span><span class="fa fa-stop"></span></td></tr>';
    $('#table-upload-list').html(html);
    $('#dropbox').removeClass('hide');
    $('#uploadTable').addClass('hide');
}

/**
 * 预览文件，传入文件在cos上的地址
 * @param fileurl
 */
function preview(fileurl) {
    var winHeight = window.document.documentElement.clientHeight-10;
    var url = 'http://localhost:8012/onlinePreview?url=' + fileurl;
    window.open(url, "_blank", "height=" + winHeight
        + ",top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes");
}

/**
 * 打开文件夹操作
 * @param id
 * @param name
 */
function openFolder(id,name) {
    $.ajax({
        type: 'POST',
        url: '/files/all',
        data:{
            pid:id
        },
        success: function (res) {
            // console.log(res);
            $('#list_group').html(res);
            addBreadCrumb(id,name);
        }
    });
}

function alertmsg(msg) {
    $('#index-alert').text(msg);
    $('#index-alert').fadeToggle(500);
    $('#index-alert').fadeToggle(100);
}

function getSearch(keyword) {
    $.ajax({
        type: 'POST',
        url: '/search/keyword',
        data:{
          key:keyword
        },
        success: function (res) {
            $('#search-res').html(res);
        }
    });
}