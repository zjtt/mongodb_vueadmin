<template>
	<section>
		<br /><br />
		<!--列表-->
		<div v-if="alreadyOffer">
			<el-table :data="tableData"  highlight-current-row v-loading="listLoading"style="width: 100%;">
				<el-table-column type="index" width="70" label="序号" >
        		<template scope="scope">
                    <p>{{scope.$index+1+(p_index-1)*p_size}}</p>
                </template>
			</el-table-column>
			<el-table-column prop="applyid" width="120" label="求职编号" sortable :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="sname" label="求职者" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="specialty" label="专业" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="job" label="职位" width="100"  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="salary" label="薪资" width="140" sortable :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="160" sortable :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="ptime" label="发布日期" width="170" sortable  :formatter="formatfield">
			</el-table-column>
			<el-table-column prop="resume" label="简历" min-width="100">
				<template scope="scope">
			        <el-popover trigger="hover" width="300" placement="top" v-if="scope.row.other!=''">
			          <p>{{ scope.row.resume}}</p>
			          <div slot="reference" class="name-wrapper">
			            <el-tag>简历内容</el-tag>
			          </div>
			        </el-popover>
			        <p v-if="scope.row.other==''">--</p>
			    </template>
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
			</el-table>
	
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange"  :current-page="p_index" :page-size="p_size" :total="total" style="float:right;">
				</el-pagination>
			</el-col>
		</div>
		
		<div class="box-card"  v-if="!alreadyOffer" style="text-align:center;">
			<br /><br /><h2>您还没有已招聘信息</h2>
		</div>
	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import { get,put,post} from '../../api/api';
	
	export default {
		data() {
			return {
				alreadyOffer:true,
				tableData:[],
				total:1,
				p_index: 1,
				p_size:10,
				access:true,//handleCurrentChange函数关卡
				getPara:{
				    sname :JSON.parse(sessionStorage.getItem('user')).name,//求职者
				},
				listLoading: false,
			}
		},
		methods:{
			formatfield:function(row,column) {
				if(column.property == 'salary'){
					if (row.salary == '') {
						return '--';
					} else{
						return '￥'+row.salary.toFixed(2);
					}
				}else{
					return row[column.property]===''?'--':row[column.property];
				}
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
				get('/api/company/alreadyInvite',this.getPara).then((response) => {//请求成功
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
							this.alreadyOffer = false;
						};
						//设置页数变化门卡允许通过
						this.access = true;
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
						//设置页数变化门卡允许通过
						this.access = true;
					};
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
		},
		mounted() {
			this.getData();
		}
	}

</script>

