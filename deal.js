function get(socket,data,fn){
	console.log("deal/get");
	var result={code:0,
		time:0,
		data:{},
		success:true,
		message:""};
if(socket){
	 	socket.emit("deal_getdeal",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}		
};

function add(socket,data,fn){
	console.log("deal/add");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={success:false,
		code:0,
		message:"",
		data:{},
		time:0};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_add",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		};
	var deal=new data_mg.deal(data.data);
	deal.save(function(err){
		if(err){
			console.log(err)
			result.success=false;
			result.message=err;
			returnFn();
			}else{
				console.log("开始修改product")
				data_mg.product.findOne({id:data.data.productId},function(errA,product){
					if(errA){
						console.log(errA);
						result.success=false;
						result.message="没有该产品";
						returnFn();
						}else{
							var payedCount=product.payedCount+data.data.count;
							var payed=product.payed+(data.data.buyPrice*data.data.count);
							data_mg.product.update({id:data.data.productId},{$set:{payedCount:payedCount,payed:payed}},{},function(errB){
								
								if(errB){
									console.log(errB);
									result.success=false;
									result.message="更新产品数量失败";
									returnFn();
									}else{
										console.log("更新product时间")
										var lastTime=new Date().getTime();
										data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":lastTime}},{},function(errC){
											if(errC){
												console.log(errC);
												result.success=false;
												result.time=lastTime;
												result.message="更新产品时间失败";
												}else{
													result.success=true;
													}
													returnFn();
											})
										}
								})
							}
					})
				}
			
		});
		
};

function edit(socket,data,fn){
	console.log("deal/edit");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFn=function(){
		if(socket){
	 	socket.emit("deal_edit",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		data_mg.deal.update({"id":data.data.id},{$set:data.data},{},function(err){
			if(err){
				console.log(err)
				result.success=false;
				result.message="修改失败";
				returnFn();
				}else{
					if(data.data.endTime){
						console.log("开始修改product")
				data_mg.product.findOne({id:data.data.productId},function(errA,product){
					if(errA){
						console.log(errA)
						result.success=false;
						result.message="没有该产品";
						returnFn();
						}else{
							var payedCount=product.payedCount-data.data.count;
							var payed=product.payed-(data.data.buyPrice*data.data.count);
							data_mg.product.update({id:data.data.productId},{$set:{payedCount:payedCount,payed:payed}},{},function(errB){
								
								if(errB){
									console.log(errB);
									result.success=false;
									result.message="修改产品出错";
									returnFn();
									}else{
										console.log("更新product时间")
										data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":new Date().getTime()}},{},function(errC){
											if(errC){
												console.log(errC);
												result.success=false;
												result.message="更新产品出错";
												}else{
													result.success=true;
													result.code=1;
													}
													returnFn();
											})
										}
								})
							}
					})
						}else{
							result.success=true;
							returnFn();
							}
					
					}
					
			})
		
};

function remove(socket,data,fn){
	console.log("deal/remove");
	var result={code:0,
		time:0,
		data:{},
		success:true,
		message:""};
if(socket){
	 	socket.emit("deal_remove",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}		
};

function list(socket,data,fn){
	console.log("deal/getdealList");
	console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:false,
		message:""};
	var returnFN=function(){
		if(socket){
	 	socket.emit("deal_getdealList",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
		data_mg.deal.find({userId:data.data},function(err,doc){
			if(err){
				console.log(err)
				result.success=false;
				result.message("获取交易列表失败")
				}else{
					result.success=true;
					result.data=doc;
					result.code=1
					}
			returnFN();		
			})
};

exports.get=get;
exports.add=add;
exports.edit=edit;
exports.remove=remove;
exports.list=list;

