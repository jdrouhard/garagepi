"use strict";

var fs                = require('fs')
  , path              = require('path')
  , Sequelize         = require('sequelize')
  , config            = require(path.join(__dirname, '..', 'config'));

var sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', config.db.filename)
});

var db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
