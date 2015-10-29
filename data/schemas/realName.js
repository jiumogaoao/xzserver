var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"name":String,/*真实姓名*/
		"sex":Number,/*性别*/
		"cardType":Number,/*证件类型*/
		"place":Number,/*地区*/
		"birthday":Number,/*生日*/
		"cardNumber":Number,/*证件号*/
		"startTime":Number,/*开始时间*/
		"endTime":Number,/*结束时间*/
		"image":String,/*证件照*/
		"state":Number/*审核状态*/
	})
module.exports = MemberSchema;