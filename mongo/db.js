// Schema、Model、Entity或者Documents的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。
const mongoose = require('mongoose');
// 连接数据库 如果不自己创建 默认test数据库会自动生成
const DB_URL = 'mongodb://localhost:27017/zhaopin';
mongoose.connect(DB_URL);

// 为这次连接绑定事件
const db = mongoose.connection;
//连接异常
db.on('error',() => console.log('Mongo connection error'));
//打开连接
db.once('open',() => console.log('Mongo connection successed'));
//连接成功
db.on('connected',() => console.log('Mongoose connection open to ' + DB_URL));
//连接断开
db.on('disconnected',() => console.log('Mongoose connection disconnected'));
/************** 定义模式 **************/
//管理员登录
const adminSchema =new mongoose.Schema({
    admin : { type: String },
    password : { type: String },
});
//个人
const personSchema =new mongoose.Schema({
    pname : { type: String },
    password : { type: String },
	age:{ type: Number },
	sex:{ type: String },
	birthday:{ type: String },
	school:{ type: String },
	specialty:{ type: String },
	knowledge:{ type: String },
	email:{ type: String },
	resume:{ type: String }
});
//公司
const companySchema =new mongoose.Schema({
    cname : { type: String },
    password : { type: String },
	email:{ type: String },
	tel:{ type: String },
	manage:{ type: Number },
	address:{ type: String },
	cintro:{ type: String },
});

//查询招聘信息
const offerJobSchema =new mongoose.Schema({
    offerid : { type: Number },
    sname : { type: String },
    manage : { type: Number },
    job : { type: String },
    salary : { type: Number },
    email : { type: String },
    tel : { type: String },
    ptime : { type: String},
    other : { type: String },
    p_index: { type: Number },
    p_size: { type: Number },
    is_del:{type: Boolean},
});

//查询求职信息
const applyJobSchema =new mongoose.Schema({
    applyid : { type: Number },
    sname : { type: String },
	specialty:{ type: String },//专业
	job:{ type: String },
	salary:{ type: Number },
	email:{ type: String },
	ptime:{ type: String },
	resume:{ type: String },//简历
	other:{ type: String },
	p_index: { type: Number },
    p_size: { type: Number },
});

//查询链接信息
const linkSchema =new mongoose.Schema({
    applyid : { type: Number },
    offerid : { type: Number },
});


/************** 定义模型Model **************/
const Models = {
    adminModel : mongoose.model('adminModel',adminSchema,'admin'),
    personModel : mongoose.model('personModel',personSchema,'person'),
    companyModel : mongoose.model('companyModel',companySchema,'company'),
    offerJobModel : mongoose.model('offerJobModel',offerJobSchema,'offerjob'),
    applyJobModel : mongoose.model('applyJobModel',applyJobSchema,'applyjob'),
    linkModel : mongoose.model('linkModel',linkSchema,'link'),
}

module.exports = Models;