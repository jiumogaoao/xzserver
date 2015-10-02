var mongoose = require('mongoose');
var memberSchema = require('../schemas/link');
var member = mongoose.model('account',memberSchema);
module.exports = member;