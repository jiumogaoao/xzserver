var mongoose = require('mongoose');
var memberSchema = require('../schemas/imageAndWord');
var member = mongoose.model('promotion',memberSchema);
module.exports = member;