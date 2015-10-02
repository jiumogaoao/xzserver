var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"title":String,/*标题*/
		"subhead":String,/*副标题*/
		"image":Array,/*图片*/
		"price":Number,/*金额*/
		"payedCount":Number,/*已众筹笔数*/
		"payedMoney":Number,/*已众筹金额*/
		"copy":Number,/*份数*/
		"maxTime":Number,/*持有期限*/
		"tax":Number,/*税费预算*/
		"stratTime":Number,/*开始时间*/
		"yearReturn":Number,/*年收益率*/
		"more":Number,/*增值*/
		"dsc":String,//简介
		"change":Number,//债权转移费用
		"invite":String,/*介绍人*/
		"inviteMoney":String,/*介绍费*/
		"type":String,/*项目类型*/
		"tag":String,/*标签*/
		"orderTime":Number,/*预约时间*/
		"passNumber":Number/*通过份数*/
	})
module.exports = MemberSchema;