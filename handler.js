// var handler = module.exports;
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var model = require('./model');

//显示主页
exports.showIndex = function (req, res) {
    //读取模板
    model.getAll(function (err, data) {
        if (err) {
            return res.json({
                err_code: 500,
                message: err.message
            })
        }
        res.render('index', data);
    });
}
//显示添加页面
exports.shouAdd = function (req, res) {
    res.render('add');
}
//添加操作
exports.doAdd = function (req, res) {

    //使用文件上传处理第三方包 formidable
    //创建实例
    var form = new formidable.IncomingForm();
    //配置属性
    //配置上传文件保存路径
    form.uploadDir = './img/';
    //配置保存扩展名
    form.keepExtensions = true;
    //调用parse方法  数据存在了回调函数中了
    //三个参数 第一个是错误信息 第二个是存放字段(也就是普通数据) 第三个存放上传文件的信息.
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err
        }
        //body是一个对象 用来存储用户上传的数据   
        //先把普通信息存起来
        var body = fields;
        //处理图片路径信息
        //console.log(files);
        var avatarPath = files.avatar.path;
        avatarPath = avatarPath.substr(avatarPath.lastIndexOf('\\') + 1);
        //存储路径信息
        body.avatar = 'img/' + avatarPath;
        //读取数据
        model.add(body, function (err) {
            if (err) {
                return res.json({
                    err_code: 500,
                    message: err.message
                })
            }
            res.json({
                err_code: 0
            })
        });
    });
}
//输出静态资源
exports.loadStatic = function (req, res) {
    var filePath = '.' + req.url;
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return res.end('404 Not Found.')
        }
        res.end(data)
    })

}
//查看信息
exports.showInfo = function (req, res) {
    //获取id
    var id = req.query.id;
    //console.log(typeof id);//string
    model.getById(id, function (err, hero) {
        if (err) {
            return res.json({
                err_code: 500,
                message: err.message
            })
        }
        res.render('info', {
            hero: hero
        });
    });
}
//显示编辑页面
exports.showEdit = function (req, res) {
    var id = req.query.id;
    model.getById(id, function (err, hero) {
        if (err) {
            return res.json({
                err_code: 500,
                message: err.message
            })
        }
        res.render('edit', {
            hero: hero
        })
    });
}

//操作编辑页面
exports.doEdit = function (req, res) {
    //获得页面数据
    var form = new formidable.IncomingForm();
    form.uploadDir = './img/';
    //配置保存扩展名
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.json({
                err_code: 500,
                message: err.message
            })
        }
        var body = fields;
        //判断图片是否更改
        if (files.avatar.size === '') {
            //页面隐藏域存储原图片路径
            body.avatar = body.origin_avatar;
            //删掉空文件
            fs.unlink(files.avatar.path);
        } else {
            //使用新图片路径
            body.avatar = path.join('img/', path.basename(files.avatar.path));
        }

        //上传修改
        model.updataById(body, function (err) {
            if (err) {
                return res.json({
                    err_code: 500,
                    message: err.message
                })
            }
            res.json({
                err_code: 0
            })
        });
    });
}

//图片上传
exports.doUpload = function (req, res) {
    //使用formidable接收传过来的图片
    //获得页面数据
    var form = new formidable.IncomingForm();
    //存放路径
    form.uploadDir = './uploads/';
    //配置保存扩展名
    form.keepExtensions = true;

    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.json({
                err_code: 500,
                message: err.message
            })
        }
        //返回一个路径 设置给图片src
        res.json({
            err_code: 0,
            result: '/' + files.avatar.path.replace('\\', '/')
        });
    });
}

//删除操作
exports.doDelete = function (req, res) {
    var id = req.query.id
    model.deleteById(id, function (err) {
        if (err) {
            return res.json({
                err_code: 500,
                message: err.message
            })
        }
        res.json({
            err_code: 0
        })
    })
}

//返回数据
exports.getHeros = function (req, res) {
    model.getAll(function (err, data) {
        if (err) {
            return res.json({
                err_code: 500,
                message: err.message
            })
        }
        res.json({
            err_code: 0,
            result: data
        })
    })
}