var mongoose = require('mongoose');
var MemberSchema = new mongoose.Schema({
		"id":String,/*id*/
		"type":Number,/*类型,1普通用户2管理用户*/
		"userName":String,/*用户名*/
		"userType":String,/*用户类型0普通用户，1机构*/
		"image":String,/*头像*/
		"sex":String,/*性别*/
		"place":String,/*地址*/
		"phone":String,/*手机*/
		"email":String,/*邮箱*/
		"name":String,/*真实姓名*/
		"contacts":String,/*联系人*/
		"contactsPhone":String,/*联系人电话*/
		"record":String,/*学历*/
		"university":String,/*毕业院校*/
		"job":String,/*职位*/
		"company":String,/*公司*/
		"introducer":String,/*介绍人*/
		"lastTime":Number,/*上次登录时间*/
		"lastIp":String,/*上次登录IP*/
		"time":Number,/*当前登录时间*/
		"ip":String/*当前登录ip*/
	})
module.exports = MemberSchema;