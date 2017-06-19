<template>
	<section>
		<br /><br />
		<section  v-if="companyformVisible">
			<!--列表-->
			<el-table :data="tableData" highlight-current-row v-loading="listLoading"style="width: 100%;">
				<el-table-column type="index" width="70" label="序号" >
	        		<template scope="scope">
	                    <p>{{scope.$index+1+(p_index-1)*p_size}}</p>
	                </template>
				</el-table-column>
				<el-table-column prop="offerid" width="120" label="招聘编号" sortable :formatter="formatfield">
				</el-table-column>
				<el-table-column prop="sname" label="企业名称" width="100"  :formatter="formatfield">
				</el-table-column>
				<el-table-column prop="manage" label="所属行业" width="100"  :formatter="formatfield">
				</el-table-column>
				<el-table-column prop="job" label="职位" width="100"  :formatter="formatfield">
				</el-table-column>
				<el-table-column prop="email" label="邮箱" width="160"  :formatter="formatfield">
				</el-table-column>
				<el-table-column prop="tel" label="联系电话" width="160"  :formatter="formatfield">
				</el-table-column>
				<el-table-column prop="salary" label="薪资" width="140" sortable :formatter="formatfield">
				</el-table-column>
				<el-table-column prop="ptime" label="发布日期" width="170" sortable  :formatter="formatfield">
				</el-table-column>
				<el-table-column prop="other" label="其他说明" min-width="100">
					<template scope="scope">
				        <el-popover trigger="hover" width="300" placement="top" v-if="scope.row.other!=''">
				          <p>{{ scope.row.other}}</p>
				          <div slot="reference" class="name-wrapper">
				            <el-tag>说明内容</el-tag>
				          </div>
				        </el-popover>
				        <p v-if="scope.row.other==''">--</p>
				    </template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" width="80">
					<template scope="scope">
						<el-button size="small" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
	
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange"  :current-page="p_index" :page-size="p_size" :total="total" style="float:right;">
				</el-pagination>
			</el-col>
		</section>
		<div class="box-card"  v-if="!companyformVisible" style="text-align:center;">
			<br /><br /><h2>您还未发布招聘信息，请到信息管理界面发布招聘信息</h2>
		</div>
		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
				<el-form-item label="职位" prop="job">
					<el-input v-model="editForm.job" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="薪资" prop="salary">
					<el-input v-model.number="editForm.salary" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="其他说明" prop="other">
					<el-input type="textarea" v-model="editForm.other"></el-input>
				</el-form-item>
				<el-form-item label="是否删除">
					<el-switch
					  v-model="editForm.is_del"
					  on-color="#13ce66"
					  off-color="#ff4949">
					</el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import { get,put,post} from '../../api/api';
	
	export default {
		data() {
			var validateToolong = (rule, value, callback) => {
				if(rule.field == 'salary' || rule.field == 'offerid'){
					if(value != ''){
				        if (typeof(value) != "number"){
				          callback(new Error('该字段为数字类型'));
				        } else {
				          callback();
				        };
					}else{
						 callback();
					}
				};
		    };
			return {
				companyformVisible:true,
				tableData:[],
				total:1,
				p_index: 1,
				p_size:10,
				access:true,//handleCurrentChange函数关卡
				editIndex:1,//编辑得第几条
				//设置禁止选择大于当前时间的时间
			    pickerOptions:{
			    	disabledDate:(time) => {
						return time.getTime() > Date.now();
					},
			    },
				getPara:{
					offerid : '',//招聘编号
				    sname : JSON.parse(sessionStorage.getItem('user')).name,//企业名称
					manage:'',//所属行业 1：互联网 2：金融 3：房地产
				    job : '',//职位
				    salary : '',//薪资
				    ptime : '',//发布日期
				},
				listLoading: false,
				
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					salary: [
						{ validator:validateToolong, trigger: 'change' }
					],
					sname: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					job: [
						{ required: true, message: '请输入以上字段',trigger: 'blur' }
					],
					salary: [
						{ required: true, message: '请输入正确的薪资',type:'number', trigger: 'change' }
					],
					manage: [
						{ required: true, message: '请选择所属行业',type:'number', trigger: 'change' }
					],
				},
				//编辑界面数据
				editForm: {
				    sname : '',//企业名称
					manage:'',//所属行业 1：互联网 2：金融 3：房地产
				    job : '',//职位
				    salary : '',//薪资
				    other:'',//其他说明
				    is_del:false,//是否删除
				},
			}
		},
		methods:{
			changeInqueryDate(val){
				this.inquiryForm.c_time = val;
				console.log('this.inquiryForm.c_time:'+this.inquiryForm.c_time);
			},
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
				}else if(column.property == 'salary'){
					if (row.salary == '') {
						return '--';
					} else{
						return '￥'+row.salary.toFixed(2);
					}
				}else{
					return row[column.property]===''?'--':row[column.property];
				}
			},
			//显示编辑界面
			handleEdit: function (index, row) {
            	this.editIndex = index;//编辑的第几条数据
				this.editFormVisible = true;
				row.is_del = false;
				this.editForm = Object.assign({}, row);
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
				get('/api/offerjob/list',this.getPara).then((response) => {//请求成功
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
							this.companyformVisible = false;
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
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							NProgress.start();
							let para = Object.assign({}, this.editForm);
							console.log('para:'+JSON.stringify(para));
							post('/api/offerjob/update',para).then((response) => {
								this.editLoading = false;
								NProgress.done();
								if(response.data.status == 1){
									this.$message({
										message:'修改成功!',
										type:'success',
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									//重新请求当前页
									//重新加载
									this.getData();
								}else{
									this.$message.error('修改失败!'); 
								};
							}).catch((err) => {
								this.editLoading = false;
								NProgress.done();
								console.log(err);
								this.$message.error('修改失败!'); 
							});
						});
					}
				});
			},
		},
		mounted() {
			this.getData();
		}
	}

</script>

