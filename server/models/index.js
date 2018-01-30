var fs = require('fs');
var path = require('path');

module.exports = function (db, DataTypes) {
  var files = fs.readdirSync(__dirname).map(function (file) {
    return path.join(__dirname, file);
  }).filter(function (file) {
    return file !== __filename;
  });

  var models = {};

  files.forEach(function (file) {
    var model = db.import(file);
    models[model.name] = model;
  });

  Object.keys(models).forEach(function (name) {
    if ('associate' in models[name]) {
      models[name].associate(db);
    }
  });

  return models;
};