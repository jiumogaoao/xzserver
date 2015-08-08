function get(socket,data,fn){
	console.log("announcement/get");
	console.log(data)
	var result={
		code:0,
		time:0,
		data:[]
		};
		var returnFn=function(){
			if(socket){
			 	socket.emit("announcement_get",result);
			 }
			 	else if(fn){
			 		var returnString = JSON.stringify(result);
			 		fn(returnString);
			 	}
		}
		//returnFn();
		//return;
		data_mg.updateTime.find({"parentKey":"announcement"},function(err,doc){
		if(err){
			result.code=0;
			returnFn()
		}else{
			if(doc&&doc.length&&doc[0].childKey>data.data){
				result.time=doc[0].childKey;
				data_mg.announcement.find({},function(err,docA){
					if(err){
						result.code=0
					}else{
						result.code=1;
						result.data=docA;
					}
					returnFn();
				})
			}else{
				result.code=2;
				returnFn();
			}
		}
	})

		
};

function add(socket,data,fn){
	console.log("announcement/add");
	//data.data={
		//"id":uuid(),/*id*/
		//"title":"eee",/*标题*/
		//"message":"rewr",/*内容*/
		//"start":0,/*生效时间*/
		//"end":0/*结束时间*/
		//}
		if(typeof(data.data)=="string"){
			data.data=JSON.parse(data.data)
			}
	var result={code:0};
	var returnFn=function(){
		if(socket){
		 	socket.emit("announcement_add",result);
		 }
		 	else if(fn){
		 		var returnString = JSON.stringify(result);
		 		fn(returnString);
		 	}	
	}
	var newAnnouncement=new data_mg.announcement(data.data);
	console.log("添加公告")
	newAnnouncement.save(function(err){
		if(err){
			console.log(err)
			result.code=0;
			returnFn()
		}else{
			console.log("更新时间")
			data_mg.updateTime.update({"parentKey":"announcement"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
				if(errA){
					console.log(errA)
					result.code=0
				}else{
					result.code=1
				}
				returnFn();
			})
		}
	})
	
};

function edit(socket,data,fn){
	console.log("announcement/edit");
	if(typeof(data.data)=="string"){
			data.data=JSON.parse(data.data)
			}
	console.log(data.data)
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("announcement_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	console.log("更新公告")
	data_mg.announcement.update({"id":data.data.id},{$set:data.data},{},function(err){
		if(err){
			console.log(err)
			result.code=0;
			returnFn();
		}else{
			console.log("更新时间")
			data_mg.updateTime.update({"parentKey":"announcement"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
				if(errA){
					console.log(errA)
					result.code=0
				}else{
					result.code=1
				}
				returnFn();
			})
		}
	})
	
};

function remove(socket,data,fn){
	console.log("announcement/remove");
	//data.data="ehdjk"/*id*/
	console.log(data.data);
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("announcement_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	console.log("删除公告")
	data_mg.announcement.remove({"id":data.data},function(err){
		if(err){console.log(err)
			result.code=0;
			returnFn();
		}else{console.log("更新时间")
			data_mg.updateTime.update({"parentKey":"announcement"},{$set:{"childKey":new Date().getTime()}},function(errA){
				if(errA){console.log(errA)
					result.code=0
				}else{
					result.code=1
				}
				returnFn();
			})
		}
	})
	
};

exports.get=get;
exports.add=add;
exports.edit=edit;
exports.remove=remove;