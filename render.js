var fs = require('fs');
var template = require('art-template');

module.exports = function(res) {
  res.render = function (tplName, data) {
    var tplPath = './views/' + tplName + '.html';
    fs.readFile(tplPath, 'utf8', function (err, tplData) {
      if (err) {
        return res.end('Can not find template ' + tplName);
      }
      //模板渲染
      var htmlStr = template.compile(tplData)(data || {});
      res.end(htmlStr);
    })
  }
}
