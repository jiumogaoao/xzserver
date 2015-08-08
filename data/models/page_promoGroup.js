var mongoose = require('mongoose');
var memberSchema = require('../schemas/link');
var member = mongoose.model('page_promoGroup',memberSchema);
module.exports = member;