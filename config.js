function get(socket,data,fn){
	console.log("config/get");
	console.log(data)
	//data.data = 10086/*不用传*/
	var result={
		code:0,
		time:0,
		data:{},
		success:false,
		message:""
		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("config_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	data_mg.updateTime.find({"parentKey":"config"},function(err,doc){
		if(err){
			console.log(err)
			result.success=false;
			result.message="获取更新时间失败"
			returnFn()
			}else{
				if(doc&&doc.length&&doc[0].childKey>data.data.time){
					result.time=doc[0].childKey;
					data_mg.config.findOne({},function(errA,docA){
						console.log(docA)
						if(errA){
							console.log(errA)
							result.success=false;
			result.message="获取配置信息错误"
							}else{
								result.success=true;
								result.code=1;
								result.data=docA.any
								}
							returnFn()
						})
					}else{
						result.success=true;
						result.code=0
						returnFn()
						}
				}
		})
		
};



function edit(socket,data,fn){
	console.log("config/edit");
	if(typeof(data.data)=="string"){
		data.data={any:JSON.parse(data.data)}
		}
		console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("config_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		console.log("更新配置")
	data_mg.config.update({},{$set:data.data},{},function(err){
		if(err){console.log(err)
			result.success=false;
			result.message="修改失败"
			returnFn()
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"config"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){console.log(errA)
						result.success=false;
						result.message="更新时间失败"
						}else{
							result.success=true;
							}
						returnFn()
					})
				}
		})
		
};



exports.get=get;

exports.edit=edit;