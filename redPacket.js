function get(socket,data,fn){
	console.log("redPacket/get");
	
	var result={
		code:0,
		data:[]
	};
	var returnFn=function(){
		if(socket){
	 	socket.emit("redPacket_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		//returnFn();return;
	data_mg.updateTime.find({"parentKey":"redPacket"},function(err,doc){
		if(err){
			result.code=0
			returnFn()
			}else{
				if(doc&&doc.length&&doc[0].childKey>data.data){
					result.time=doc[0].childKey
					data_mg.redPacket.find({},function(errA,docA){
						if(errA){
							result.code=0
							}else{
								result.code=1
								result.data=docA
								}
								returnFn()
						})
					}
				else{
					result.code=2
					result.data=[]
			returnFn()
					}
				}
		})
		
};

function add(socket,data,fn){
	console.log("redPacket/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("redPacket_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	var newRedPacket=new data_mg.redPacket(data.data);
	newRedPacket.save(function(err){
		if(err){
			result.code=0
			returnFn();
			}else{
				data_mg.updateTime.update({"parentKey":"redPacket"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){
						result.code=0
						}else{
							result.code=1
							}
						returnFn();
					})
				}
		})
		
};

function detail(socket,data,fn){
	console.log("redPacket/detail");
	data.data = "ssfsfs"/*用户id*/
	var result={
							code:1,
							time:10086,
							data:[
								{"id":"001","userId":"001","money":0,"type":0,"strat":0,"end":0},
								{"id":"002","userId":"001","money":0,"type":0,"strat":0,"end":0},
								{"id":"003","userId":"001","money":0,"type":0,"strat":0,"end":0}
								]
							};
	data_mg.redPacket.find({"userId":data.data},function(err,doc){
		if(err){
			result.code=0
			}else{
				result.code=1;
				result.data=doc
				}
			if(socket){
	 	socket.emit("redPacket_detail",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		})
	
		
};

exports.get=get;
exports.add=add;
exports.detail=detail;