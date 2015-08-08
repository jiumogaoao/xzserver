var mongoose = require('mongoose');
var memberSchema = require('../schemas/message');
var member = mongoose.model('company',memberSchema);
module.exports = member;