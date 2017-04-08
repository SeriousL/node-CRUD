var fs = require('fs');

var dataPath = './data.json';
//读取数据
function getAll(callback) {
    fs.readFile(dataPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        data = JSON.parse(data);
        callback(null, data);
    })
}
//保存数据
function saveHeros(data, callback) {
    fs.writeFile(dataPath, JSON.stringify(data, null, '    '), function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

//读取全部数据
exports.getAll = getAll;

//根据id读取数据
exports.getById = function (id, callback) {
    id = parseInt(id);
    getAll(function (err, data) {
        if (err) {
            return callback(err);
        }
        var heros = data.heros;
        heros.some(function (hero) {
            if (id === hero.id) {
                callback(null, hero);
                return true;
            }
        });
    });
}

//添加数据
exports.add = function (hero, callback) {
    getAll(function (err, data) {
        if (err) {
            return callback(err);
        }
        //处理id
        //这个heros是获取到的heros
        var heros = data.heros;
        //这个hero是传进来的hero  这里 调整他的id 给他设置为数据中的最后一个对象的id加一
        hero.id = heros[heros.length - 1].id + 1;
        //push进去
        heros.push(hero);
        saveHeros(data, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    });
}

//根据id删除数据
exports.deleteById = function (id, callback) {
    id = parseInt(id);
    getAll(function (err, data) {
        if (err) {
            return callback(err);
        }
        var heros = data.heros;
        heros.some(function (hero, index) {
            if (hero.id === id) {
                //删除这条数据
                heros.splice(index, 1);
                //写入数据
                saveHeros(data, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                })
            return true;
            }
        });

    });
}

//根据id修改数据
exports.updataById = function (hero, callback) {
    hero.id = parseInt(hero.id);
    getAll(function (err, data) {
        if (err) {
            return callback(err);
        }
        //遍历 属性传进去
        //var heros = data.heros;
        data.heros.some(function (item, index) {
            if (hero.id === item.id) {
                for (var key in hero) {
                    item[key] = hero[key];
                }
                //写入
                saveHeros(data, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                })
                return true;
            }
        });
    });

}