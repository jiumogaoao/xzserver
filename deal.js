function get(socket,data,fn){
	console.log("deal/get");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
		console.log(data.data)
	var result={code:0,
		time:0,
		data:{},
		success:true,
		message:""};
	function returnFn(){
		if(socket){
	 	socket.emit("deal_getdeal",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}	
		}	
	if(tokenArry[data.data.token]&&tokenArry[data.data.token].user&&tokenArry[data.data.token].user.type==2){
		data_mg.deal.find({},function(err,doc){
			if(err){
				console.log(err);
				result.success=false;
				result.message="获取交易列表失败";
				}else{
					result.success=true;
					result.data=doc;
					}
				returnFn();
			});
		}else{
				result.success=false;
				result.message="登陆信息超时或不是管理员帐号";
				returnFn();
				}
};
/**************************************************************************************************/
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
		console.log(tokenArry[data.data.tk])
	if(tokenArry[data.data.tk]&&tokenArry[data.data.tk].user&&tokenArry[data.data.tk].user.id){
		console.log("已登陆")
		data_mg.client.findOne({id:tokenArry[data.data.tk].user.id},function(err,member){
			if(err){
				console.log(err);
				result.success=false;
				result.message="获取用户信息失败";
				returnFn();
			}else{
				console.log("用户信息正确")
				var restMoney=member.balance+member.redpacket;
				var totalPay=data.data.buyPrice*data.data.count;
				var moneySet={balance:0,redpacket:0}
				if(restMoney>=totalPay){console.log("余额足够")
					if(member.redpacket>=totalPay){
						moneySet={balance:member.balance,redpacket:(member.redpacket-totalPay)}
					}else{
						moneySet={balance:member.balance+member.redpacket-totalPay,redpacket:0}
					}
					data_mg.client.update({id:tokenArry[data.data.tk].user.id},{$set:moneySet},{},function(errA){
						if(errA){
							consol.log(errA);
							result.success=false;
							result.message="修改金额失败";
							returnFn();
						}else{console.log("修改余额成功")
							data_mg.updateTime.update({parentKey:"client"},{$set:{childKey:new Date().getTime()}},{},function(errB){
								if(errB){
									console.log(errB);
									result.success=false;
									result.message="更新用户信息失败";
									returnFn();
								}else{console.log("更新余额时间成功")
									/********************************************/
									var deal=new data_mg.deal(data.data);	
									deal.save(function(errC){
		if(errC){
			console.log(errC)
			result.success=false;
			result.message="添加交易纪录失败";
			returnFn();
			}else{
				console.log("开始修改product")
				data_mg.product.findOne({id:data.data.productId},function(errD,product){
					if(errD){
						console.log(errD);
						result.success=false;
						result.message="没有该产品";
						returnFn();
						}else{console.log("有产品")
							var payedCount=product.payedCount+data.data.count;
							var payedMoney=product.payedMoney+(data.data.buyPrice*data.data.count);
							var payedMember=product.payedMember+1;
							data_mg.product.update({id:data.data.productId},{$set:{payedCount:payedCount,payedMoney:payedMoney,payedMember:payedMember}},{},function(errE){
								if(errE){
									console.log(errE);
									result.success=false;
									result.message="更新产品数量失败";
									returnFn();
									}else{
										console.log("更新product时间")
										var lastTime=new Date().getTime();
										data_mg.updateTime.update({"parentKey":"product"},{$set:{"childKey":lastTime}},{},function(errF){
											if(errF){
												console.log(errF);
												result.success=false;
												result.message="更新产品时间失败";
												}else{
													result.time=lastTime;
													result.success=true;
													result.code=1;
													}
													returnFn();
											})
										}
								})
							}
					})
				}
			
		});
									/********************************************/
								}
							})
						}
					})
				}else{
					console.log("余额不足");
					result.success=false;
					result.message="余额不足";
					returnFn();
				}
			}
		})	
		}else{
				result.success=false;
				result.message="登陆信息超时或不是管理员帐号";
				returnFn();
				}		
};
/*****************************************************************************************************/
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
		if(tokenArry[data.data.token]&&tokenArry[data.data.token].user){
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
			}else{
				result.success=false;
				result.message="登陆信息超时或不是管理员帐号";
				returnFn();
				}
		
		
};

function list(socket,data,fn){
	console.log("deal/getdealList");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
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
		if(tokenArry[data.data.token]&&tokenArry[data.data.token].user){
			data_mg.deal.find({userId:tokenArry[data.data.token].id},function(err,doc){
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
			}else{
				result.success=false;
				result.message="登陆信息超时或不是管理员帐号";
				returnFn();
				}
		
};
/*****************************************************/
function money(socket,data,fn){
	console.log("deal/money");
	if(typeof(data.data)=="string"){
		data.data=JSON.parse(data.data)
		}
	console.log(data.data)
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
	 	socket.emit("deal_money",result);
	 }
	 	else if(fn){
	 		var returnString = JSON.stringify(result);
	 		fn(returnString);
	 	}
		}
	data_mg.product.findOne({id:data.data.id},function(err,doc){
						if(errA){
							console.log(err)
							result.success=false;
							result.message="获取产品商品信息失败";
							returnFn();
							}else{
								if(doc){
									data_mg.com.find({productId:data.data.id},function(errA,docA){
										if(errA){
											console.log(errA)
											result.success=false;
											result.message="获取评论失败";
											returnFn();
										}else{
											doc.com=docA;
											data_mg.deal.find({productId:data.data.id},function(errB,docB){
												if(errB){
													console.log(errB)
													result.success=false;
													result.message="获取交易名单失败";
												}else{
													doc.member=docB;
													result.success=true;
													result.data=doc;
												}
												returnFn();
											})
										}
									})
								}else{
									reuslt.success=false;
									result.message="没有该产品"
									returnFn();
								}
								}
							
						})
		
};
exports.money=money;
exports.get=get;
exports.add=add;
exports.edit=edit;
exports.list=list;

