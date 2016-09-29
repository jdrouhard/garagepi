"use strict";

var passportSequelize = require('passport-local-sequelize');

module.exports = function(sequelize, DataTypes) {
    return passportSequelize.defineUser(sequelize);
};
