function get(socket,data,fn){
	console.log("recruit/get");
	console.log(data)
	var result={
						code:0,
						time:0,
						data:[
						
						]
						};
	var returnFn=function(){
		if(socket){
	 	socket.emit("recruit_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}

		
	data_mg.updateTime.find({"parentKey":"recruit"},function(err,doc){
		if(err){
			result.code=0
			returnFn()
			}else{
				if(doc&&doc.length&&doc[0].childKey>data.data){
					result.time=doc[0].childKey
					data_mg.recruit.find({},function(errA,docA){
						if(errA){
							result.code=0
							}else{
								result.code=1;
								result.data=docA
								}
						returnFn()
						})
					}else{
						result.code=2
						returnFn()
						}
				}
		})
		
};

function add(socket,data,fn){
	console.log("recruit/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("recruit_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
		}
		console.log("添加招聘")
	var newRecruit=new data_mg.recruit(data.data);
	newRecruit.save(function(err){
		if(err){console.log(err)
			result.code=0
			returnFn()
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"recruit"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){console.log(errA)
						result.code=0
						}else{
							result.code=1
							}
						returnFn()
					})
				}
		});
	
	
};

function edit(socket,data,fn){
	console.log("recruit/edit");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:1};
	var returnFn=function(){
		if(socket){
	 	socket.emit("recruit_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
		}
		console.log("更新招聘")
	data_mg.recruit.update({"id":data.data.id},{$set:data.data},{},function(err){
		if(err){console.log(err)
			result.code=0
			returnFn()
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"recruit"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){console.log(errA)
						result.code=0
						}else{
							result.code=1
							}
					returnFn()
					})
				}
		})
	
};


function remove(socket,data,fn){
	console.log("recruit/remove");
	console.log(data.data);
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("recruit_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
		}
	data_mg.recruit.remove({"id":data.data},function(err){
		if(err){
			result.code=0
			returnFn()
			}else{
				data_mg.updateTime.update({"parentKey":"recruit"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){
						result.code=0
						}else{
							result.code=1
							}
						returnFn()
					})
				}
		})
	
};

exports.get=get;
exports.add=add;
exports.edit=edit;
exports.remove=remove;