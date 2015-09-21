function get(socket,data,fn){
	console.log("product/get");
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
	 	socket.emit("product_get",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	data_mg.updateTime.find({"parentKey":"product"},function(err,doc){
		if(err){
			console.log(err);
			result.success=false;
			result.message="查询更新时间失败";
			returnFn()
			}else{
				if(doc&&doc.length&&doc[0].childKey>data.data.time){
					result.time=doc[0].childKey;
					data_mg.product.find({},function(errA,docA){
						if(errA){
							console.log(errA)
							result.success=false;
							result.message="获取产品商品信息失败";
							}else{
								result.success=true;
								result.code=1;
								result.data=docA
								}
							returnFn()
						})
					}else{
						result.success=true;
						result.code=0;
						returnFn()
						}
				}
		})
		
};

function add(socket,data,fn){
	console.log("product/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={
		success:false,
		code:0,
		message:"",
		data:{},
		time:0
		};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		console.log("创建商品")
	var newProduct=new data_mg.product(data.data);
	newProduct.save(function(err){
		if(err){console.log(err)
			result.success=false;
			result.message="创建商品失败";
			returnFn()
			}else{console.log("更新时间");
				var lastTime=new Date().getTime();
				data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":lastTime}},{},function(errA){
					if(errA){console.log(errA)
						result.success=false;
						result.message="更新产品时间失败";
						}else{
							result.time=lastTime;
							result.success=true;
							}
						returnFn()
					})
				}
		})
		
};

function edit(socket,data,fn){
	console.log("product/edit");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		console.log("更新产品")
	data_mg.product.update({"id":data.data.id},{$set:data.data},{},function(err){
		if(err){console.log(err)
			result.success=false;
			result.message="修改产品失败";
			returnFn()
			}else{console.log("更新时间")
				data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){console.log(errA)
						result.success=false;
			result.message="更新产品失败";
						}else{
							result.success=true;
							result.code=1
							}
						returnFn()
					})
				}
		})
		
};

function remove(socket,data,fn){
	console.log("product/remove");
	
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("product_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
		}
	data_mg.product.remove({"id":data.data.id},function(err){
		if(err){
			console.log(err)
			result.success=false;
			result.message="删除失败";
			returnFn()
			}else{
				data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":new Date().getTime()}},{},function(errA){
					if(errA){
						console.log(errA)
						result.success=false;
						result.message="更新时间失败";
						}else{
							result.success=true;
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