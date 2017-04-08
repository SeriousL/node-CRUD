var render = require('./render');
var http = require('http');
var router = require('./router');
var server = http.createServer();

server.on('request', function (req, res) {
  //调用函数render 为res绑定一个render的方法
    render(res);

    router(req,res);
}).listen(3000, function () {
  console.log('runnning')
})

