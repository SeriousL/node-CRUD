var fs = require('fs')
var handler = require('./handler');
var url = require('url');

module.exports = function (req, res) {
    //使用url模块处理路径
    //var url = req.url;
    var parseObj = url.parse(req.url, true);
    //路径 
    var pathname = parseObj.pathname;
    //传递的参数  把这个参数绑到req 可以传递到其他页面 方便操作
    req.query = parseObj.query;
    // console.log(req.query.id);
    //转换格式方法
    res.json = function (jsonObj) {
        res.end(JSON.stringify(jsonObj))
    }

    var method = req.method.toLowerCase(); //转化为小写
    if (method == 'get' && pathname == '/') {
        handler.showIndex(req, res);
    } else if (method == 'get' && pathname == '/add') {
        handler.shouAdd(req, res);
    } else if (method == 'post' && pathname == '/add') {
        handler.doAdd(req, res);
    } else if (method == 'get' && pathname == '/info') {
        handler.showInfo(req, res);
    } else if (method == 'get' && pathname == '/edit') {
        handler.showEdit(req, res);
    } else if (method == 'post' && pathname == '/edit') {
        handler.doEdit(req, res);
    } else if (method == 'post' && pathname == '/upload') {
        handler.doUpload(req, res);
    } else if (method == 'get' && pathname == '/delete') {
        handler.doDelete(req, res);
    } else if (method == 'get' && pathname.indexOf('/node_modules/') == 0 || pathname.indexOf('/img/') == 0 || pathname == '/favicon.ico' || pathname.indexOf('/uploads/') == 0) {
        handler.loadStatic(req, res);
    }
}