const models = require('./db');
const express = require('express');
const router = express.Router();

/************** 创建(create) 读取(get) 更新(update) 删除(delete) **************/

// 创建账号接口
// router.post('/api/reg/person',(req,res) => {
//     // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
//     let newAccount = new models({
//         name : req.body.name,
//         password : req.body.password
//     });
//     // 保存数据newAccount数据进mongoDB
//     newAccount.save((err,data) => {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send('createAccount successed');
//         }
//     });
// });

// 获取已有账号接口
//1.管理员登录
router.get('/api/admin/login',(req,res) => {
    console.log(req.query);
    console.log(res);
    let wherestr = {
        'admin':req.query.username,
        'password':req.query.password,
    };
    console.log('wherestr:'+wherestr);
    // 通过模型去查找数据库
    models.adminModel.find(wherestr,(err,data) =>{
        console.log('data:'+data);
        if (err) {
            res.send(err);
        } else {
            if (data.length == 0) {
                res.send({
                    "status":-1,
                    "msg":'用户名或密码错误',
                    "data":'1'
                });
            } else{
                res.send({
                    status:1,
                    msg:'success',
                    user:{
                        'name':data[0].admin,
                        'password':data[0].password
                    }
                });
            }
        }
    });
});
//2.个人登录
router.get('/api/person/login',(req,res) => {
    console.log(req.query);
    // console.log(res);
    let wherestr = {
        'pname':req.query.username,
        'password':req.query.password,
    };
    console.log('wherestr:'+JSON.stringify(wherestr));
    // 通过模型去查找数据库
    models.personModel.find(wherestr,(err,data) =>{
        console.log('data:'+data);
        if (err) {
            res.send(err);
        } else {
            if (data.length == 0) {
                res.send({
                    "status":-1,
                    "msg":'用户名或密码错误',
                    "data":'1'
                });
            } else{
                res.send({
                    status:1,
                    msg:'success',
                    user:{
                        'name':data[0].pname,
                        'password':data[0].password
                    }
                });
            }
        }
    });
});
//3.企业登录
router.get('/api/company/login',(req,res) => {
    console.log(req.query);
    // console.log(res);
    let wherestr = {
        'cname':req.query.username,
        'password':req.query.password,
    };
    console.log('wherestr:'+wherestr);
    // 通过模型去查找数据库
    models.companyModel.find(wherestr,(err,data) =>{
        console.log('data:'+data);
        if (err) {
            res.send(err);
        } else {
            if (data.length == 0) {
                res.send({
                    "status":-1,
                    "msg":'用户名或密码错误',
                    "data":'1'
                });
            } else{
                res.send({
                    status:1,
                    msg:'success',
                    user:{
                        'name':data[0].cname,
                        'password':data[0].password
                    }
                });
            }
        }
    });
});

//4.个人用户注册
router.post('/api/person/reg',(req,res) => {
    // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
    var personReg = models.personModel({
        "pname":req.body.username,  
        "password" : req.body.password,
        "age" : req.body.age,
        "sex" : req.body.sex,
        "birthday" : req.body.birthday,
        "school" : req.body.school,
        "specialty" : req.body.specialty,
        "knowledge" : req.body.knowledge,
        "email" : req.body.email,
        "resume" : req.body.resume,
    });
    //验证用户名是否已经注册
    let wherestr = {
        "pname":req.body.username,  
    };
    models.personModel.find(wherestr,(preventRepeaterr,preventRepeatdata) =>{
        if (preventRepeaterr) {
            console.log(preventRepeaterr);
        } else {
            if (preventRepeatdata.length == 0) {
                // 保存数据newAccount数据进mongoDB
			    personReg.save((err,data) => {
			        if (err) {
			            res.send(err);
			        } else {
			            res.send({
			                "msg":"success",
			                "status":1,
			                "user":{
			                	'name':req.body.username,
			                    'password':req.body.password
			                }
			            });
			        };
			    });
            } else{
            	//不能重复注册
                res.send({
		    		"msg":"不能重复注册",
		            "status":-1,
		    	});
            };
        }
    });
});

//5.企业用户注册
router.post('/api/company/reg',(req,res) => {
    // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
    var companyReg = models.companyModel({
        "cname":req.body.username,  
        "password" : req.body.password,
        "email" : req.body.email,
        "tel" : req.body.tel,
        "manage" : req.body.manage,
        "address" : req.body.address,
        "cintro" : req.body.cintro,
    });
    //验证用户名是否已经注册
    let wherestr = {
        "cname":req.body.username,  
    };
    // 通过模型去查找数据库
    models.companyModel.find(wherestr,(preventRepeaterr,preventRepeatdata) =>{
        if (preventRepeaterr) {
            res.send(preventRepeaterr);
        } else {
            if (preventRepeatdata.length == 0) {
			    // 保存数据newAccount数据进mongoDB
			    companyReg.save((err,data) => {
			       if (err) {
			            res.send(err);
			       } else {
			            res.send({
			                "msg":"success",
			                "status":1,
			                "user":{
			                	'name':req.body.username,
			                    'password':req.body.password
			                }
			            });
			        }
			    });
            } else{
            	//不能重复注册
                res.send({
		    		"msg":"不能重复注册",
		            "status":-1,
		    	});
            };
        };
    });
});

//6.个人信息查询
router.get('/api/person/list',(req,res) => {
	console.log(req.query);
	// console.log(res);
	let wherestr = {};
    var total;
    var p_size = Number(req.query.p_size);//一页多少条
    var p_index = Number(req.query.p_index);//第几页
    var skipnum = (p_index - 1) * p_size;   //跳过条数
    if(req.query.pname != ''){
        wherestr.pname = req.query.pname;
    }else if(req.query.school != ''){
        wherestr.school = req.query.school;
    }else if(req.query.specialty != ''){
        wherestr.specialty = req.query.specialty;
    }else if(req.query.knowledge != ''){
        wherestr.knowledge = req.query.knowledge;
    };
	console.log('wherestr:'+JSON.stringify(wherestr));
    // 通过模型去查找数据库
    models.personModel.count(wherestr, function(counterr, count){
        if (counterr) {
            console.log("countError:" + counterr);
            res.send(counterr);
        }
        else {
            console.log("countRes:" + count);
            total = count;
            models.personModel.find(wherestr).skip(skipnum).limit(p_size).exec((err,data) =>{
		        if (err) {
		            res.send(err);
		        } else {
		            if (data.length == 0) {
		                res.send({
		                    "status":1,
		                    "msg":'success',
		                    "data":null,
		                    "total":total
		                });
		            } else{
		                res.send({
		                    "status":1,
		                    "msg":'success',
		                    "data":data,
		                    "total":total
		                });
		            }
		        }
		    });
        };
    });
});

//8.个人信息删除
router.post('/api/person/del',(req,res) => {
	// 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
	let wherestr = {};
	wherestr.pname = req.body.pname;
	models.personModel.remove(wherestr,(removeerr,removedata) => {
	   if (removeerr) {
	        res.send(removeerr);
	   }else {
	        //删除这个人求职信息
	        models.applyJobModel.remove(wherestr,(err,data) => {
			   if (err) {
			        res.send(err);
			   }else {
			        res.send({
				       	"data":req.body.pname,
				       	"msg":"success",
				       	"status":1,
			        });
			   };
			});
	   };
	});
});

//6.企业信息查询
router.get('/api/company/list',(req,res) => {
	console.log(req.query);
	// console.log(res);
	let wherestr = {};
    var total;
    var p_size = Number(req.query.p_size);//一页多少条
    var p_index = Number(req.query.p_index);//第几页
    var skipnum = (p_index - 1) * p_size;   //跳过条数
    if(req.query.cname != ''){
        wherestr.cname = req.query.cname;
    }else if(req.query.manage != ''){
        wherestr.manage = req.query.manage;
    };
	console.log('wherestr:'+JSON.stringify(wherestr));
    // 通过模型去查找数据库
    models.companyModel.count(wherestr, function(counterr, count){
        if (counterr) {
            console.log("countError:" + counterr);
            res.send(counterr);
        }
        else {
            console.log("countRes:" + count);
            total = count;
            models.companyModel.find(wherestr).skip(skipnum).limit(p_size).exec((err,data) =>{
		        if (err) {
		            res.send(err);
		        } else {
		            if (data.length == 0) {
		                res.send({
		                    "status":1,
		                    "msg":'success',
		                    "data":null,
		                    "total":total
		                });
		            } else{
		                res.send({
		                    "status":1,
		                    "msg":'success',
		                    "data":data,
		                    "total":total
		                });
		            }
		        }
		    });
        };
    });
});

//8.企业信息删除
router.post('/api/company/del',(req,res) => {
	// 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
	let wherestr = {};
	wherestr.cname = req.body.cname;
	models.companyModel.remove(wherestr,(removeerr,removedata) => {
	   if (removeerr) {
	        res.send(removeerr);
	   }else {
	        //删除这个企业的招聘信息
	        models.offerJobModel.remove(wherestr,(err,data) => {
			   if (err) {
			        res.send(err);
			   }else {
			        res.send({
				       	"data":req.body.pname,
				       	"msg":"success",
				       	"status":1,
			        });
			   };
			});
	   };
	});
});

//6.招聘信息查询
router.get('/api/offerjob/list',(req,res) => {
	console.log(req.query);
	// console.log(res);
	let wherestr = {};
    var total;
    var sort = {'offerid':1};//排序（按offerid）
    var p_size = Number(req.query.p_size);//一页多少条
    var p_index = Number(req.query.p_index);//第几页
    var skipnum = (p_index - 1) * p_size;   //跳过条数
    if(req.query.offerid != ''){
        wherestr.offerid = req.query.offerid;
    }else if(req.query.sname != ''){
        wherestr.sname = req.query.sname;
    }else if(req.query.manage != ''){
        wherestr.manage = req.query.manage;
    }else if(req.query.job != ''){
        wherestr.job = req.query.job;
    }else if(req.query.salary != ''){
        wherestr.salary = Number(req.query.salary);
    }else if(req.query.ptime != ''){
        wherestr.ptime = req.query.ptime;
    };
	console.log('wherestr:'+JSON.stringify(wherestr));
    // 通过模型去查找数据库
    models.offerJobModel.count(wherestr, function(counterr, count){
        if (counterr) {
            console.log("countError:" + counterr);
            res.send(counterr);
        }
        else {
            console.log("countRes:" + count);
            total = count;
        };
    });
    models.offerJobModel.find(wherestr).skip(skipnum).limit(p_size).sort(sort).exec((err,data) =>{
        console.log('offerJobdata:'+data);
        if (err) {
            res.send(err);
        } else {
            if (data.length == 0) {
                res.send({
                    "status":1,
                    "msg":'success',
                    "data":null,
                    "total":total
                });
            } else{
                res.send({
                    "status":1,
                    "msg":'success',
                    "data":data,
                    "total":total
                });
            }
        }
    });
});

//7.添加招聘信息
router.post('/api/offerjob/add',(req,res) => {
    // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
    var total;
    // console.log('req.body:'+JSON.stringify(req.body));
    // console.log('req.body.sname:'+req.body.sname);
    function dateNow(){
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        month = month<10?'0'+month:month;
        let date = now.getDate();
        date = date<10?'0'+date:date;
        let hour = now.getHours();
        hour = hour<10?'0'+hour:hour;
        let minute = now.getMinutes();
        minute = minute<10?'0'+minute:minute;
        let second = now.getSeconds();
        second = second<10?'0'+second:second;
        let str = year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
        return str;
    };
    var addofferJob = models.offerJobModel({
        "offerid":req.body.offerid,  
        "sname" : req.body.sname,
        "manage" : req.body.manage,
        "job" : req.body.job,
        "salary" : req.body.salary,
        "ptime" : dateNow(),
        "other" : req.body.other,
    }); 
    console.log('addofferJob:'+JSON.stringify(addofferJob));
    // 保存数据newAccount数据进mongoDB
    addofferJob.save((err,data) => {
       if (err) {
            res.send(err);
       } else {
            res.send({
                "data":req.body.offerid,
                "msg":"success",
                "status":1,
            });
        }
    });
});

//8.更新招聘信息
router.post('/api/offerjob/update',(req,res) => {
	// 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
	let wherestr = {};
	wherestr._id = req.body._id;
	wherestr.offerid = req.body.offerid;
//	console.log('req.body:'+JSON.stringify(req.body));
    if(req.body.is_del == false){
	    let updatestr = {
	        "sname" : req.body.sname,
	        "manage" : req.body.manage,
	        "job" : req.body.job,
	        "salary" : req.body.salary,
	        "other" : req.body.other,
	    };
	//  console.log('updatestr:'+JSON.stringify(updatestr));
		// 保存数据newAccount数据进mongoDB
		models.offerJobModel.update(wherestr,updatestr,(err,data) => {
		   if (err) {
		        res.send(err);
		   } else {
		        res.send({
			       	"data":req.body.offerid,
			       	"msg":"success",
			       	"status":1,
		        });
		    }
		});
    }else if(req.body.is_del == true){
    	models.offerJobModel.remove(wherestr,(err,data) => {
		   if (err) {
		        res.send(err);
		   } else {
		        res.send({
			       	"data":req.body.offerid,
			       	"msg":"success",
			       	"status":1,
		        });
		    }
		});
    };
});

//9.求职信息查询
router.get('/api/applyjob/list',(req,res) => {
	console.log(req.query);
	// console.log(res);
	let wherestr = {};
    var total;
    var sort = {'applyid':1};//排序（按offerid）
    var p_size = Number(req.query.p_size);//一页多少条
    var p_index = Number(req.query.p_index);//第几页
    var skipnum = (p_index - 1) * p_size;   //跳过条数
    if(req.query.applyid != ''){
        wherestr.applyid = req.query.applyid;
    }else if(req.query.sname != ''){
        wherestr.sname = req.query.sname;
    }else if(req.query.specialty != ''){//专业
        wherestr.specialty = req.query.specialty;
    }else if(req.query.job != ''){
        wherestr.job = req.query.job;
    }else if(req.query.salary != ''){
        wherestr.salary = Number(req.query.salary);
    }else if(req.query.ptime != ''){
        wherestr.ptime = req.query.ptime;
    };
	console.log('wherestr:'+JSON.stringify(wherestr));
    // 通过模型去查找数据库
    models.applyJobModel.count(wherestr, function(counterr, count){
        if (counterr) {
            console.log("countError:" + counterr);
            res.send(counterr);
        }
        else {
            console.log("countRes:" + count);
            total = count;
        };
    });
    models.applyJobModel.find(wherestr).skip(skipnum).limit(p_size).sort(sort).exec((err,data) =>{
        console.log('applyJobdata:'+data);
        if (err) {
            res.send(err);
        } else {
            if (data.length == 0) {
                res.send({
                    "status":1,
                    "msg":'success',
                    "data":null,
                    "total":total
                });
            } else{
                res.send({
                    "status":1,
                    "msg":'success',
                    "data":data,
                    "total":total
                });
            }
        }
    });
});

//10.添加求职信息
router.post('/api/applyjob/add',(req,res) => {
    // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
    var total;
    // console.log('req.body:'+JSON.stringify(req.body));
    // console.log('req.body.sname:'+req.body.sname);
    function dateNow(){
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        month = month<10?'0'+month:month;
        let date = now.getDate();
        date = date<10?'0'+date:date;
        let hour = now.getHours();
        hour = hour<10?'0'+hour:hour;
        let minute = now.getMinutes();
        minute = minute<10?'0'+minute:minute;
        let second = now.getSeconds();
        second = second<10?'0'+second:second;
        let str = year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
        return str;
    };
    var addapplyJob = models.applyJobModel({
        "applyid":req.body.applyid,  
        "sname" : req.body.sname,
        "specialty" : req.body.specialty,
        "job" : req.body.job,
        "salary" : req.body.salary,
        "email" : req.body.email,
        "ptime" : dateNow(),
        "other" : req.body.other,
        "resume" : req.body.resume,
    }); 
    // 保存数据newAccount数据进mongoDB
    addapplyJob.save((err,data) => {
       if (err) {
            res.send(err);
       } else {
            res.send({
                "data":req.body.applyid,
                "msg":"success",
                "status":1,
            });
        }
    });
});

//11.更新求职信息
router.post('/api/applyjob/update',(req,res) => {
	// 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
	let wherestr = {};
	wherestr._id = req.body._id;
	wherestr.applyid = req.body.applyid;
	wherestr.sname = req.body.sname;
//	console.log('req.body:'+JSON.stringify(req.body));
    if(req.body.is_del == false || req.body.is_del == undefined){
	    let updatestr = {
	        "sname" : req.body.sname,
	        "specialty" : req.body.specialty,
	        "job" : req.body.job,
	        "salary" : req.body.salary,
	        "resume" : req.body.resume,//简历 
	        "other" : req.body.other,
	    };
	//  console.log('updatestr:'+JSON.stringify(updatestr));
		// 保存数据newAccount数据进mongoDB
		models.applyJobModel.update(wherestr,updatestr,(err,data) => {
		   if (err) {
		        res.send(err);
		   } else {
		        res.send({
			       	"data":req.body.applyid,
			       	"msg":"success",
			       	"status":1,
		        });
		    }
		});
    }else if(req.body.is_del == true){
    	models.applyJobModel.remove(wherestr,(err,data) => {
		   if (err) {
		        res.send(err);
		   } else {
		        res.send({
			       	"data":req.body.applyid,
			       	"msg":"success",
			       	"status":1,
		        });
		    }
		});
    };
});

//12.查询个人用户信息
router.get('/api/person',(req,res) => {
    console.log(req.query);
    console.log(res);
    let wherestr = {
        'pname':req.query.name,
    };
    console.log('wherestr:'+wherestr);
    // 通过模型去查找数据库
    models.personModel.find(wherestr,(err,data) =>{
        console.log('data:'+data);
        if (err) {
            res.send(err);
        } else {
            res.send({
                status:1,
                msg:'success',
                data:data[0]
            });
        }
    });
});

//12.修改个人用户信息
router.post('/api/person/update',(req,res) => {
    let wherestr = {
        'pname':req.body.pname,
        "_id":req.body._id,
    };
    let updatestr = {
        "pname" : req.body.pname,
        "password" : req.body.password,
        "age" : req.body.age,
        "sex" : req.body.sex,
        "birthday" : req.body.birthday,
        "school" : req.body.school,
        "specialty" : req.body.specialty,
        "knowledge" : req.body.knowledge,
        "email" : req.body.email,
        "resume" : req.body.resume,
    };
    console.log('updatestr:'+JSON.stringify(updatestr));
    // 保存数据newAccount数据进mongoDB
    models.personModel.update(wherestr,updatestr,(err,data) => {
       if (err) {
            res.send(err);
       } else {
            res.send({
                "data":req.body.pname,
                "msg":"success",
                "status":1,
            });
        }
    });
});

//13.查询企业用户信息
router.get('/api/company',(req,res) => {
    console.log(req.query);
    console.log(res);
    let wherestr = {
        'cname':req.query.name,
    };
    console.log('wherestr:'+wherestr);
    // 通过模型去查找数据库
    models.companyModel.find(wherestr,(err,data) =>{
        console.log('data:'+data);
        if (err) {
            res.send(err);
        } else {
            res.send({
                status:1,
                msg:'success',
                data:data[0]
            });
        }
    });
});

//12.修改企业用户信息
router.post('/api/company/update',(req,res) => {
    let wherestr = {
        'cname':req.body.cname,
        "_id":req.body._id,
    };
    let updatestr = {
        "cname" : req.body.cname,
        "password" : req.body.password,
        "tel" : req.body.tel,
        "manage" : req.body.manage,
        "address" : req.body.address,
        "cintro" : req.body.cintro,
    };
    console.log('updatestr:'+JSON.stringify(updatestr));
	// 保存数据newAccount数据进mongoDB
	models.companyModel.update(wherestr,updatestr,(err,data) => {
	   if (err) {
	        res.send(err);
	   } else {
	        res.send({
		       	"data":req.body.cname,
		       	"msg":"success",
		       	"status":1,
	        });
	    }
	});
});

//13.个人用户发布求职信息
router.post('/api/applyjob/publish',(req,res) => {
	//定义当前时间函数
    function dateNow(){
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        month = month<10?'0'+month:month;
        let date = now.getDate();
        date = date<10?'0'+date:date;
        let hour = now.getHours();
        hour = hour<10?'0'+hour:hour;
        let minute = now.getMinutes();
        minute = minute<10?'0'+minute:minute;
        let second = now.getSeconds();
        second = second<10?'0'+second:second;
        let str = year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
        return str;
    };
	 models.applyJobModel.find({'sname':req.body.sname},function(finderr,finddata){
    	//查询该用户简历是否已经存在
    	if (finderr) {
            res.send(finderr);
        } else {
            if (finddata.length == 0) {
            	console.log('finddata.length == 0');
                //如果不存在就添加
			    // 保存数据newAccount数据进mongoDB
			    models.applyJobModel.count({}, function(counterr, count){
			        if (counterr) {
//			            console.log("countError:" + counterr);
			            res.send(counterr);
			        }else {
			        	var addapplyJob = models.applyJobModel({
					        "applyid":count+1,  
					        "sname" : req.body.sname,
					        "specialty" : req.body.specialty,
					        "job" : req.body.job,
					        "salary" : req.body.salary,
					        "email" : req.body.email,
					        "ptime" : dateNow(),
					        "other" : req.body.other,
					        "resume" : req.body.resume,
					    }); 
					    addapplyJob.save((err,data) => {
					       if (err) {
					            res.send(err);
					       } else {
					            res.send({
					                "data":count+1,
					                "msg":"success",
					                "status":1,
					            });
					        }
					    });
			        };
			    });
            } else{
                //如果存在就更新
                let updatestr = {
			        "sname" : req.body.sname,
			        "specialty" : req.body.specialty,
			        "job" : req.body.job,
			        "salary" : req.body.salary,
			        "email" : req.body.email,
			        "ptime" : dateNow(),
			        "other" : req.body.other,
			        "resume" : req.body.resume,
			    };
//			    console.log('updatestr:'+JSON.stringify(updatestr));
				// 保存数据newAccount数据进mongoDB
				models.applyJobModel.update({'sname':req.body.sname},updatestr,(updateerr,updatedata) => {
				   if (updateerr) {
				        res.send(updateerr);
				   } else {
				        res.send({
					       	"data":req.body.sname,
					       	"msg":"success",
					       	"status":1,
				        });
				    }
				});
            }
        }
    })
});

//13.企业用户发布招聘信息
router.post('/api/offerjob/publish',(req,res) => {
	//定义当前时间函数
    function dateNow(){
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        month = month<10?'0'+month:month;
        let date = now.getDate();
        date = date<10?'0'+date:date;
        let hour = now.getHours();
        hour = hour<10?'0'+hour:hour;
        let minute = now.getMinutes();
        minute = minute<10?'0'+minute:minute;
        let second = now.getSeconds();
        second = second<10?'0'+second:second;
        let str = year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
        return str;
    };
	models.offerJobModel.find({'sname':req.body.sname,'job':req.body.job},function(finderr,finddata){
    	//查询该用户简历是否已经存在
    	if (finderr) {
            res.send(finderr);
        } else {
            if (finddata.length == 0) {
            	console.log('finddata.length == 0');
                //如果不存在就添加
			    // 保存数据newAccount数据进mongoDB
			    models.offerJobModel.count({}, function(counterr, count){
			        if (counterr) {
//			            console.log("countError:" + counterr);
			            res.send(counterr);
			        }else {
			        	var addofferJob = models.offerJobModel({
					        "offerid":count+1,  
					        "sname" : req.body.sname,
					        "manage" : req.body.manage,
					        "job" : req.body.job,
					        "salary" : req.body.salary,
					        "email" : req.body.email,
					        "tel" : req.body.tel,
					        "ptime" : dateNow(),
					        "other" : req.body.other,
					    }); 
					    addofferJob.save((err,data) => {
					       if (err) {
					            res.send(err);
					       } else {
					            res.send({
					                "data":count+1,
					                "msg":"success",
					                "status":1,
					            });
					        }
					    });
			        };
			    });
            } else{
                //如果存在就更新
                let updatestr = {
			        "sname" : req.body.sname,
			        "manage" : req.body.manage,
			        "job" : req.body.job,
			        "salary" : req.body.salary,
			        "email" : req.body.email,
			        "tel" : req.body.tel,
			        "ptime" : dateNow(),
			        "other" : req.body.other,
			    };
//			    console.log('updatestr:'+JSON.stringify(updatestr));
				// 保存数据newAccount数据进mongoDB
				models.offerJobModel.update({'sname':req.body.sname,'job':req.body.job},updatestr,(updateerr,updatedata) => {
				   if (updateerr) {
				        res.send(updateerr);
				   } else {
				        res.send({
					       	"data":req.body.sname,
					       	"msg":"success",
					       	"status":1,
				        });
				    }
				});
            }
        }
    })
});

//12.查询一个个人用户的求职信息
router.get('/api/person/applyjob',(req,res) => {
    console.log(req.query);
    console.log(res);
    let wherestr = {
        'sname':req.query.name,
    };
    console.log('wherestr:'+wherestr);
    // 通过模型去查找数据库
    models.applyJobModel.find(wherestr,(err,data) =>{
        console.log('data:'+data);
        if (err) {
            res.send(err);
        } else {
        	if (data.length==0) {
        		 res.send({
	                status:1,
	                msg:'success',
	                data:null
	            });
        	} else{
	            res.send({
	                status:1,
	                msg:'success',
	                data:data[0]
	            });
        	}
        }
    });
});

//12.查询一个企业用户的招聘信息
router.get('/api/company/offerjob',(req,res) => {
    console.log(req.query);
    console.log(res);
    let wherestr = {
        'sname':req.query.name,
    };
    console.log('wherestr:'+wherestr);
    // 通过模型去查找数据库
    models.applyJobModel.find(wherestr,(err,data) =>{
        console.log('data:'+data);
        if (err) {
            res.send(err);
        } else {
        	if (data.length==0) {
        		 res.send({
	                status:1,
	                msg:'success',
	                data:null
	            });
        	} else{
	            res.send({
	                status:1,
	                msg:'success',
	                data:data[0]
	            });
        	}
        }
    });
});

//12.个人用户应聘
router.post('/api/person/employ',(req,res) => {
//      'offerid':req.body.offerid,
    let wherestr1 = {
        'job':req.body.job,
        'sname':req.body.sname,
    };
    console.log('wherestr1:'+wherestr1);
    // 通过模型去查找数据库
    models.applyJobModel.find(wherestr1,(err,data) =>{
    	//先查找个人用户有没有对应改职位的求职信息
        if (err) {
            res.send(err);
        } else {
        	if (data.length==0) {
        		 res.send({
	                status:-1,
	                msg:'您还没有发布对应该职位的求职信息！',
	                data:null
	            });
        	} else{
        		//含有对应简历，判断link表是否有对应链接数据
        		console.log('data[0].applyid:'+data[0].applyid);
	            var applyid = data[0].applyid;
	            //简历link模型
	            let wherestr2 = {
			        'offerid':req.body.offerid,
			        "applyid":applyid,
			    };
			    models.linkModel.find(wherestr2,(err2,data2) =>{
			        if (err2) {
			            res.send(err2);
			        } else {
			            if (data2.length == 0) {
			            	//给link表添加数据
			                var addLink = models.linkModel({
						        'offerid':req.body.offerid,
						        "applyid":applyid,
						    }); 
						    addLink.save((err,data) => {
						        if (err) {
						            res.send(err);
						        } else {
						            res.send({
						                "msg":"应聘成功",
						                "status":1,
						                "data":1
						            });
						        };
						    });
			            } else{
			                res.send({
			                    "status":-1,
			                    "msg":'您已应聘',
			                    "data":1
			                });
			            }
			        }
			    });
        	}
        }
    });
});

//12.企业用户招聘
router.post('/api/company/invite',(req,res) => {
//      'applyid':req.body.applyid,
    let wherestr1 = {
        'job':req.body.job,
        'sname':req.body.sname,
    };
    console.log('wherestr1:'+wherestr1);
    // 通过模型去查找数据库
    models.offerJobModel.find(wherestr1,(err,data) =>{
    	//先查找企业用户有没有对应改职位的招聘信息
        if (err) {
            res.send(err);
        } else {
        	if (data.length==0) {
        		 res.send({
	                status:-1,
	                msg:'您还没有发布对应该职位的招聘信息！',
	                data:null
	            });
        	} else{
        		//含有对应简历，判断link表是否有对应链接数据
        		console.log('data[0].offerid:'+data[0].offerid);
	            var offerid = data[0].offerid;
	            //简历link模型
	            let wherestr2 = {
			        'applyid':req.body.applyid,
			        "offerid":offerid,
			    };
			    models.linkModel.find(wherestr2,(err2,data2) =>{
			        if (err2) {
			            res.send(err2);
			        } else {
			            if (data2.length == 0) {
			            	//给link表添加数据
			                var addLink = models.linkModel({
						        'applyid':req.body.applyid,
			        			"offerid":offerid,
						    }); 
						    addLink.save((err,data) => {
						        if (err) {
						            res.send(err);
						        } else {
						            res.send({
						                "msg":"招聘成功",
						                "status":1,
						                "data":1
						            });
						        };
						    });
			            } else{
			                res.send({
			                    "status":-1,
			                    "msg":'您已招聘',
			                    "data":1
			                });
			            }
			        }
			    });
        	}
        }
    });
});

//6.查询个人用户已应聘招聘信息
router.get('/api/person/alreadyApply',(req,res) => {
	console.log(req.query);
	// console.log(res);
	let wherestr1 = {};
    var total;
    var p_size = Number(req.query.p_size);//一页多少条
    var p_index = Number(req.query.p_index);//第几页
    var skipnum = (p_index - 1) * p_size;   //跳过条数
    if(req.query.sname != ''){
        wherestr1.sname = req.query.sname;
    };
	console.log('wherestr1:'+JSON.stringify(wherestr1));
    // 通过模型去查找数据库
    models.applyJobModel.find(wherestr1, function(finderr1, finddata1){
        if (finderr1) {
            console.log("finderr1:" + finderr1);
            res.send(finderr1);
        }else {
        	if (finddata1.length == 0) {
        		res.send({
                    "status":1,
                    "msg":'success',
                    "data":null,
                    "total":0
                });
        	} else{
        		let wherestr2 = {
        			'applyid':finddata1[0].applyid,//求职编号
        		};
        		console.log('finddata1[0].applyid:'+finddata1[0].applyid);
        		//根据求职编号找招聘编号
        		models.linkModel.find(wherestr2, function(finderr2, finddata2){
        			if (finderr2) {
			            console.log("finderr2:" + finderr2);
			            res.send(finderr2);
			        }else{
			        	if (finddata2.length == 0) {
			        		res.send({
			                    "status":1,
			                    "msg":'success',
			                    "data":null,
			                    "total":0
			                });
			        	} else{
			        		//可能找到多个招聘编号
			        		var resendData = [];
			        		console.log('finddata2:'+JSON.stringify(finddata2));
			        		for(var i=0;i<finddata2.length;i++){
			        			let wherestri = {
				        			'offerid':finddata2[i].offerid,//招聘编号
				        		};
				        		console.log('finddata2[i].offerid:'+finddata2[i].offerid);
				        		//根据招聘编号找招聘信息
				        		models.offerJobModel.find(wherestri, function(finderr3, finddata3){
				        			if(finderr3){
				        				res.send(finderr3);
				        			}else{
				        				if (finddata3.length != 0) {
							        		resendData.push(finddata3[0]);
							        	};
							        	console.log('i:'+i);
							        	console.log('finddata2.length:'+finddata2.length);
							        	if (i==finddata2.length) {
						        			console.log('resendData:'+JSON.stringify(resendData));
							        		console.log('resendData.length:'+resendData.length);
							        		if (resendData.length == 0) {
							        			res.send({
								                    "status":1,
								                    "msg":'success',
								                    "data":null,
								                    "total":0
								                });
							        		} else{
							        			res.send({
								                    "status":1,
								                    "msg":'success',
								                    "data":resendData,
								                    "total":resendData.length
								                });
							        		};			        		
						        		};
				        			}
				        		});
			        		};
			        	}
			        }
        		})
        	}
        }
    })
});

//6.查询企业用户已招聘的求职信息
router.get('/api/company/alreadyInvite',(req,res) => {
	console.log(req.query);
	// console.log(res);
	let wherestr1 = {};
    var total;
    var p_size = Number(req.query.p_size);//一页多少条
    var p_index = Number(req.query.p_index);//第几页
    var skipnum = (p_index - 1) * p_size;   //跳过条数
    if(req.query.sname != ''){
        wherestr1.sname = req.query.sname;
    };
	console.log('wherestr1:'+JSON.stringify(wherestr1));
    // 通过模型去查找数据库
    models.offerJobModel.find(wherestr1, function(finderr1, finddata1){
        if (finderr1) {
            console.log("finderr1:" + finderr1);
            res.send(finderr1);
        }else {
        	if (finddata1.length == 0) {
        		res.send({
                    "status":1,
                    "msg":'success',
                    "data":null,
                    "total":0
                });
        	} else{
				var resendData = [];//传传到前端的数据
				var jishu=1;
        		for (var j = 0; j < finddata1.length; j++) {
	        		let wherestr2 = {
	        			'offerid':finddata1[j].offerid,//招聘编号
	        		};
	        		console.log('finddata1[j].offerid:'+finddata1[j].offerid);
	        		console.log('finddata1[j].length:'+finddata1[j].length);
	        		//根据招聘编号找求职编号
	        		models.linkModel.find(wherestr2, function(finderr2, finddata2){
	        			jishu+=1;
	        			if (finderr2) {
				            console.log("finderr2:" + finderr2);
				            res.send(finderr2);
				        }else{
				        	if (finddata2.length != 0) {
				        		//可能找到多个招聘编号
				        		console.log('finddata2:'+JSON.stringify(finddata2));
				        		for(var i=0;i<finddata2.length;i++){
				        			let wherestri = {
					        			'applyid':finddata2[i].applyid,//求职编号
					        		};
					        		console.log('finddata2[i].applyid:'+finddata2[i].applyid);
					        		//根据招聘编号找招聘信息
					        		models.applyJobModel.find(wherestri, function(finderr3, finddata3){
					        			if(finderr3){
					        				res.send(finderr3);
					        			}else{
					        				if (finddata3.length != 0) {
								        		resendData.push(finddata3[0]);
								        	};
								        	console.log('jishu:'+jishu);
								        	console.log('finddata2.length:'+finddata2.length);
						        			console.log('resendData:'+JSON.stringify(resendData));
							        		console.log('resendData.length:'+resendData.length);
								        	if(jishu==finddata1.length+1 && i==finddata2.length) {
								        		if (resendData.length == 0) {
								        			res.send({
									                    "status":1,
									                    "msg":'success',
									                    "data":null,
									                    "total":0
									                });
								        		} else{
									        		console.log('sendi:'+i);
									        		console.log('sendj:'+j);
								        			res.send({
									                    "status":1,
									                    "msg":'success',
									                    "data":resendData,
									                    "total":resendData.length
									                });
									                return;
								        		};			        		
							        		};
					        			}
					        		});
				        		};
				        	}
				        }
	        		});
        		};
        	}
        }
    })
});
module.exports = router;

