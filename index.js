//var server = require("./server");
//var router = require("./router");
//server.start(router.route);

var app = require('./server')
  , router = require('./router')
   , url = require("url")
   , query = require("querystring")
   global.server = {
   	deal : require('./deal'),
      admin : require('./admin'),
      client : require('./client'),
      product : require('./product'),
      promotion : require('./promotion'),
	  config : require('./config'),
	  obj : require('./obj'),
	  type : require('./type')
   }
/**********************************************************************************/
   var dbURL="mongodb://127.0.0.1:27017/xingzhong"
   global.db = require("mongoose").connect(dbURL);
   global.data_mg = {}
      data_mg.admin = require('./data/models/admin');//管理员表
      data_mg.client = require('./data/models/client');//客户表
      data_mg.client_password = require('./data/models/client_password');//密码表
      data_mg.client_product = require('./data/models/client_product');//购买表
      data_mg.product = require('./data/models/product');//商品表
      data_mg.promotion = require('./data/models/promotion');//宣传表
      data_mg.updateTime = require('./data/models/updateTime');//更新表
      data_mg.deal = require('./data/models/deal');//交易表
      data_mg.bind = require('./data/models/bind');//绑定表
	  data_mg.bindCode = require('./data/models/bindCode');//验证码表
	  data_mg.config = require('./data/models/config');//配置表
	  data_mg.saveQuestion = require('./data/models/saveQuestion');//安全问题表
	  data_mg.invite = require('./data/models/invite');//邀请表
	  data_mg.account = require('./data/models/account');//帐户表
	  data_mg.obj = require('./data/models/obj');//项目表
	  data_mg.type = require('./data/models/type');//类型表




/***********************************************************************************/
	global.uuid=function(){
		return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return (v.toString(16)).toUpperCase();
    	});
	}
/***********************************************************************************/
	global.tokenArry={}; 
/***********************************************************************************/
var showDB=function(){
		data_mg.product.find({},function(err,data){console.log("product")
			console.log(data)
			})
		data_mg.obj.find({},function(err,data){console.log("obj")
			console.log(data)
			})
		data_mg.type.find({},function(err,data){console.log("type")
			console.log(data)
			})
		data_mg.updateTime.find({},function(err,data){console.log("updateTime")
			console.log(data)
			})
}
/****************************************************************************************/	 
var initDB=function(){
		var totalCount=0;
		function totalCheck(){
			totalCount++;
			if(totalCount==9){
				showDB();
				}
			}
		
		var addObj0=new data_mg.obj({"id":uuid(),"name":"产权众筹"})
		addObj0.save(function(){
			console.log("Obj0 init");
			totalCheck();
			});
		var addObj1=new data_mg.obj({"id":uuid(),"name":"经营权众筹"})
		addObj1.save(function(){
			console.log("Obj1 init");
			totalCheck();
			});
		var addObj2=new data_mg.obj({"id":uuid(),"name":"众筹建房"})
		addObj2.save(function(){
			console.log("Obj2 init");
			totalCheck();
			});
		var addType0=new data_mg.type({"id":uuid(),"name":"热门地区"})
		addType0.save(function(){
			console.log("type0 init");
			totalCheck();
			});
		var addType1=new data_mg.type({"id":uuid(),"name":"热门城市"})
		addType1.save(function(){
			console.log("type1 init");
			totalCheck();
			});
		var addType2=new data_mg.type({"id":uuid(),"name":"潜力地区"})
		addType2.save(function(){
			console.log("type2 init");
			totalCheck();
			});
		/****************************************************************************/
		var addproductT=new data_mg.updateTime({"parentKey":"product","childKey":new Date().getTime()})
		addproductT.save(function(){
			console.log("productTime init");
			totalCheck();
			});
		var addObjT=new data_mg.updateTime({"parentKey":"obj","childKey":new Date().getTime()})
		addObjT.save(function(){
			console.log("objTime init");
			totalCheck();
			});
		var addTypeT=new data_mg.updateTime({"parentKey":"type","childKey":new Date().getTime()})
		addTypeT.save(function(){
			console.log("typeTime init");
			totalCheck();
			});
		
}
/***********************************************************************************/
var emptyDB=function(){
		var totalCount=0;
		function totalCheck(){
			totalCount++;
			if(totalCount==4){
				initDB();
				}
			}
		data_mg.product.remove({},function(){
			console.log("product empty");
			totalCheck();
			});
		data_mg.obj.remove({},function(){
			console.log("obj empty");
			totalCheck();
			});
		data_mg.type.remove({},function(){
			console.log("type empty");
			totalCheck();
			});
		data_mg.updateTime.remove({},function(){
			console.log("updateTime empty");
			totalCheck();
			});
}
	emptyDB();
	//showDB();
/***********************************************************************************/	
 	 var io = require('socket.io').listen(app.target)
app.target.listen(8888);
 
 io.sockets.on('connection', function (socket) {
 	console.log("连上了");
   socket.emit('connected', { hello: 'world' });
   socket.on('server',function(data){
   		if(data&&data.model&&data.action&&server[data.model]&&server[data.model][data.action]){
   			server[data.model][data.action](socket,data);
   		}
   	});


 });