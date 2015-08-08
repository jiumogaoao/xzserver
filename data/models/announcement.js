var mongoose = require('mongoose');
var memberSchema = require('../schemas/message');
var member = mongoose.model('announcement',memberSchema);
module.exports = member;