<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleInquiry">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="tableData" highlight-current-row v-loading="listLoading"style="width: 100%;">
			<el-table-column type="index" width="70" label="序号" >
        		<template scope="scope">
                    <p>{{scope.$index+1+(p_index-1)*p_size}}</p>
                </template>
			</el-table-column>
			<el-table-column prop="cname" width="100" label="企业名称" :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="password" label="密码" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="tel" label="联系电话" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="manage" label="所属行业" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="address" label="公司地址" min-width="100">
				<template scope="scope">
			        <el-popover trigger="hover" width="300" placement="top" v-if="scope.row.address!=''">
			          <p>{{ scope.row.address}}</p>
			          <div slot="reference" class="name-wrapper">
			            <el-tag>地址内容</el-tag>
			          </div>
			        </el-popover>
			        <p v-if="scope.row.address==''">--</p>
			    </template>
			</el-table-column>
			<el-table-column prop="cintro" label="公司简介" min-width="100">
				<template scope="scope">
			        <el-popover trigger="hover" width="300" placement="top" v-if="scope.row.cintro!=''">
			          <p>{{ scope.row.cintro}}</p>
			          <div slot="reference" class="name-wrapper">
			            <el-tag>简介内容</el-tag>
			          </div>
			        </el-popover>
			        <p v-if="scope.row.cintro==''">--</p>
			    </template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="80" v-if="userType==1">
				<template scope="scope">
					<el-button size="small" type="danger" @click="handledel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange"  :current-page="p_index" :page-size="p_size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		
		<!--查询界面-->
		<el-dialog title="查询" v-model="inquiryFormVisible" :close-on-click-modal="false">
			<el-form :model="inquiryForm" label-width="90px" :rules="inquiryFormRules" ref="inquiryForm">
				<el-form-item label="企业名称" prop="cname">
					<el-input v-model="inquiryForm.pname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属行业" prop="manage">
					<el-select v-model="inquiryForm.manage" clearable placeholder="请选择">
					    <el-option
					      v-for="item in manages"
					      :label="item.label"
					      :value="item.value"
					      :key="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="inquiryFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="inquirySubmit" :loading="inquiryLoading">查询</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import { get,put,post} from '../../api/api';
	
	export default {
		data() {
			return {
				tableData:[],
				total:1,
				p_index: 1,
				p_size:10,
				userType:JSON.parse(sessionStorage.getItem('user')).userType,
				access:true,//handleCurrentChange函数关卡
				getPara:{
					cname : '',//姓名
					manage:'',//所属行业 1：互联网 2：金融 3：房地产
				},
				listLoading: false,
				
				inquiryFormVisible: false,//查询界面是否显示
				inquiryLoading: false,
				inquiryFormRules: {
					cname: [
						{ message: '请输入以上字段',trigger: 'blur' }
					],
				},
				//查询界面数据
				inquiryForm: {
					cname : '',//姓名
					manage:'',//所属行业 1：互联网 2：金融 3：房地产
				},
				//所属行业
				manages:[{
		          value: 1,
		          label: 'IT互联网'
		        },{
		          value: 2,
		          label: '金融'
		        },{
		          value: 3,
		          label: '房地产'
		        },],
			}
		},
		methods:{
			formatfield:function(row,column) {
				if(column.property == 'manage'){
					//所属行业显示转换
					switch (row.manage){
			        	case 1:
			        		return 'IT互联网';
			        	break;
			        	case 2:
			        	  	return '金融';
			        	break;
			        	case 3:
			        	  	return '房地产';
			        	break;
			        	case '':
			        		return '--';
			        	break;
			        }
				}else if(column.property == 'sex'){
					if (row.sex === 1) {
						return '男'
					} else if(row.sex === 0){
						return '女'
					};
				}else{
					return row[column.property]===''?'--':row[column.property];
				}
			},
			//显示查询界面
			handleInquiry: function () {
				this.inquiryFormVisible = true;
				this.inquiryForm = {
					cname : '',//姓名
					manage:'',//所属行业 1：互联网 2：金融 3：房地产
				};
			},
			handleCurrentChange(val) {
				//如果允许通过
				if(this.access == true){
					console.log(this.p_index);
					this.p_index = val;
					console.log('当前页：'+val);
					this.getData();
				};
			},
			//获取用户列表
			getData() {
				//设置门卡禁止通过当前页数改变的方法
				this.access = false;
				this.getPara.p_index = this.p_index;
				this.getPara.p_size = this.p_size;
				this.listLoading = true;
				NProgress.start();
				console.log(JSON.stringify(this.getPara));
				get('/api/company/list',this.getPara).then((response) => {//请求成功
					this.listLoading = false;
					NProgress.done();
					if (response.data.status == 1){
						if(response.data.data != null){
	//						console.log(JSON.stringify(response.data.data));
							this.tableData = response.data.data;
							this.total = response.data.total;
						}else{
							this.tableData.length = 0;
							this.total = 0;	
						};
						this.$notify({
							title: '成功',
							message: '加载成功',
							type: 'success'
						});
					}else{
						this.$notify({
							title: '失败',
							message: '加载失败',
							type: 'error'
						});
					};
					//设置页数变化门卡允许通过
					this.access = true;
				}).catch((err) => {//请求失败
					this.listLoading = false;
					NProgress.done();
					console.log('失败'+err);
					this.$notify({
						title: '失败',
						message: '加载失败',
						type: 'error'
					});
					//设置页数变化门卡允许通过
					this.access = true;
				});
			},
			//查询
			inquirySubmit: function () {
				this.$refs.inquiryForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {//Message box确认提交
							let para = Object.assign({}, this.inquiryForm);
							this.getPara = Object.assign({}, para);
							this.getPara.p_index = this.p_index;
							this.getPara.p_size = this.p_size;
							this.inquiryLoading = true;
							NProgress.start();
							console.log(JSON.stringify(this.getPara));
							get('/api/company/list',this.getPara).then((response) => {//请求成功
								//loading消失
								this.inquiryLoading = false;
								//头部加载进度条消失
								NProgress.done();
								//设置门卡允许通过
								this.access = true;
								if (response.data.status == 1){
									this.inquiryFormVisible = false;
									if(response.data.data != null){
		//								console.log(JSON.stringify(response.data.data));
										this.tableData = response.data.data;
										this.total = response.data.total;
									}else{
										this.tableData.length = 0;
										this.total = 0;	
									};
									this.$refs['inquiryForm'].resetFields();//清空表单
									this.$notify({
										title: '成功',
										message: '查询成功',
										type: 'success'
									});
								}else{
									this.$notify({
										title: '失败',
										message: '查询失败',
										type: 'error'
									});
								};
							}).catch((err) => {//请求失败
								console.log('失败'+err);
								this.$notify({
									title: '失败',
									message: '查询失败',
									type: 'error'
								});
								//头部加载进度条消失
								NProgress.done();
								//loading消失
								this.inquiryLoading = false;
								//设置门卡允许通过
								this.access = true;
							});
						}).catch(() => {
							//取消提交
						});
					}
				});
			},
			//删除
			handledel: function (index, row) {
				this.$confirm('确认删除吗？', '提示', {}).then(() => {//Message box确认提交
					NProgress.start();
					post('/api/company/del',{'cname':row.cname}).then((response) => {
						NProgress.done();
						if(response.data.status == 1){
							this.$message({
								message:'删除成功!',
								type:'success',
							});
							//重新加载
							this.getData();
						}else{
							this.$message.error('删除失败!'); 
						};
					}).catch((err) => {
						NProgress.done();
						console.log(err);
						this.$message.error('删除失败!'); 
					});
				}).catch(() => {
						//取消提交
				});
			}
		},
		mounted() {
			this.getData();
		}
	}

</script>

