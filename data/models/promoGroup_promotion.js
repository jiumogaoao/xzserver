var mongoose = require('mongoose');
var memberSchema = require('../schemas/link');
var member = mongoose.model('promoGroup_promotion',memberSchema);
module.exports = member;