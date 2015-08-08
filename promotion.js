function get(socket,data,fn){
	console.log("promotion/get");
	data.data=10086/*不用传*/
	var result={
		code : 0,
		time : 0,
		data : []

		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("promotion_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
	}
//returnFn();
//return;
	data_mg.updateTime.find({"parentKey":"promotion"},function(err,doc){
		if(err){
			result.code=0
			returnFn()
		}else{
			if(doc&&doc.length&&doc[0].childKey>data.data){
				result.time=doc.childKey;
				data_mg.promotion.find({},function(errC,docC){
									if(errC){
										result.code=0
										returnFn()
									}else{
										result.code=1;
										result.data=docC;
										returnFn()
									}
								})
			}else{
				result.code=2
				returnFn()
			}
		}
	})
	
	
};

function edit(socket,data,fn){
	console.log("promotion/edit");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data);
		}
		console.log(data.data)
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("promotion_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
	}
console.log("更新宣传")
		data_mg.promotion.update({"id":data.data.id},{$set:data.data},{},function(err){
			if(err){
				console.log("err")
				result.code=0
			returnFn();
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"promotion"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
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


exports.get=get;
exports.edit=edit;
