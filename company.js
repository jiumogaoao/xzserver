function get(socket,data,fn){
	console.log("company/get");
	data.data = null;/*不传*/
	var result={
						code : 0,
						time : 0,
						data : []
						};
	var returnFn=function(){
		if(socket){
	 	socket.emit("company_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	//returnFn();
	//return;
	data_mg.updateTime.find({"parentKey":"company"},function(err,doc){
		if(err){
			result.code=0;
			returnFn()
		}else{
			if(doc&&doc.length&&doc[0].childKey>data.data){
				result.time=doc[0].childKey
				data_mg.company.find({},function(errA,docA){
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
	console.log("company/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("company_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
	}
	var newCompany=new data_mg.company(data.data);
	newCompany.save(function(err){
		if(err){
			result.code=0;
			returnFn();
		}else{
			data_mg.updateTime.update({"parentKey":"company"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
				if(errA){
					result.code=0
				}else{
					result.code=1
				}
				returnFn();
			})
		}
	});
		
};

function edit(socket,data,fn){
	console.log("company/edit");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("company_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
	}
	data_mg.company.update({"id":data.data.id},{$set:data.data},{},function(err){
		if(err){
			result.code=0;
			returnFn()
		}else{
			data_mg.updateTime.update({"parentKey":"company"},{$set:{"childKey":new Date().getTime()}},{},function(err){
				if(err){
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
	console.log("company/remove");

	var result={code:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("company_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
	}
	data_mg.company.remove({"id":data.data},function(err){
		if(err){
			result.code=0;
			returnFn()
		}else{
			data_mg.updateTime.update({"parentKey":"company"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
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

exports.get=get;
exports.add=add;
exports.edit=edit;
exports.remove=remove;