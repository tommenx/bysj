module.exports={
    formatName:function (name) {
        var after = '';
        if(name.lastIndexOf('.')>20){
            after = name.substr(0,20)+name.substr(name.lastIndexOf('.'))
            // console.log("after",after);
            // console.log("before",name);

        }
        else {
            after = name;
        }

        return after;
    },
    size2str:function (size) {
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
        var res = size + unit;
        return res;
    }

};