import Login from './views/Login.vue'
import Reg from './views/reg.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
//个人信息管理
import personInfoMange from './views/personInfoMange/personInfoMange.vue'
// //企业信息管理
import companyInfoMange from './views/companyInfoMange/companyInfoMange.vue'
// //招聘信息管理
import inviteInfoManage from './views/inviteInfoManage/inviteInfoManage.vue'
// //求职信息管理
import applyJobInfoMange from './views/applyJobInfoMange/applyJobInfoMange.vue'
//所有企业信息
import allCompany from './views/allCompany/allCompany'
//所有个人信息
import allPerson from './views/allPerson/allPerson.vue'
//企业的招聘信息
import companyInvite from './views/companyInvite/companyInvite'
//个人的求职信息
import personApply from './views/personApply/personApply.vue'
//个人用户已应聘的招聘信息
import alreadyApply from './views/alreadyApply/alreadyApply.vue'
//企业用户已招聘的应聘信息
import alreadyInvite from './views/alreadyInvite/alreadyInvite.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true,
        adminSite:true,
        personSite:true,
        conpanySite:true,
    },
    {
        path: '/reg',
        component: Reg,
        name: '',
        hidden: true,
        adminSite:true,
        personSite:true,
        conpanySite:true,
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true,
        adminSite:true,
        personSite:true,
        conpanySite:true,
    },
    //一个個人信息
    {
        path: '/',
        component: Home,
        name: '本人信息管理',
        iconCls: 'fa fa-address-card',//图标样式class
        leaf: true,
        adminSite:false,
        personSite:true,
        conpanySite:false,
        children: [
            { path: '/personInfoMange', component: personInfoMange, name: '本人信息' },
        ]
    },
    //所有個人信息
    {
        path: '/',
        component: Home,
        name: '个人信息管理',
        iconCls: 'fa fa-address-card',//图标样式class
        leaf: true,
        adminSite:true,
        personSite:false,
        conpanySite:false,
        children: [
            { path: '/allPerson', component: allPerson, name: '个人信息' },
        ]
    },
    // 一个企业信息页面
    {
        path: '/',
        component: Home,
        name: '本企业信息管理',
        iconCls: 'fa fa-building',//图标样式class
        leaf: true,
        adminSite:false,
        personSite:false,
        conpanySite:true,
        children: [
            { path: '/companyInfoMange', component:companyInfoMange, name: '本企业信息' },
        ]
    },
    // 所有企业信息页面
    {
        path: '/',
        component: Home,
        name: '企业信息管理',
        iconCls: 'fa fa-building',//图标样式class
        leaf: true,
        adminSite:true,
        personSite:false,
        conpanySite:false,
        children: [
            { path: '/allCompany', component:allCompany, name: '企业信息' },
        ]
    },
    //所有招聘信息
    {
        path: '/',
        component: Home,
        name: '招聘信息管理',
        iconCls: 'fa fa-arrow-circle-left',
        leaf: true,
        adminSite:true,
        personSite:true,
        conpanySite:false,
        children: [
            { path: '/inviteInfoManage', component: inviteInfoManage, name: '招聘信息' }
        ]
    }, 
    //一个企业的招聘信息
    {
        path: '/',
        component: Home,
        name: '本企招聘信息管理',
        iconCls: 'fa fa-arrow-circle-left',
        leaf: true,
        adminSite:false,
        personSite:false,
        conpanySite:true,
        children: [
            { path: '/companyInvite', component: companyInvite, name: '本企招聘信息' }
        ]
    },  
    //所有求职信息
    {
        path: '/',
        component: Home,
        name: '求职信息管理',
        iconCls: 'fa fa-arrow-circle-right',
        leaf: true,
		adminSite:true,
        personSite:false,
        conpanySite:true,
        children: [
            { path: '/applyJobInfoMange', component: applyJobInfoMange, name: '求职信息' },
        ]
    }, 
    //一个个人的求职信息
    {
        path: '/',
        component: Home,
        name: '本人求职信息管理',
        iconCls: 'fa fa-arrow-circle-right',
        leaf: true,
		adminSite:false,
        personSite:true,
        conpanySite:false,
        children: [
            { path: '/personApply', component: personApply, name: '本人求职信息' },
        ]
    },  
    ////个人用户已应聘的招聘信息
    {
        path: '/',
        component: Home,
        name: '已应聘信息管理',
        iconCls: 'fa fa-hand-peace-o',
        leaf: true,
		adminSite:false,
        personSite:true,
        conpanySite:false,
        children: [
            { path: '/alreadyApply', component: alreadyApply, name: '已应聘信息' },
        ]
    },  
    //企业用户已招聘的应聘信息
    {
        path: '/',
        component: Home,
        name: '已招聘信息管理',
        iconCls: 'fa fa-hand-peace-o',
        leaf: true,
		adminSite:false,
        personSite:false,
        conpanySite:true,
        children: [
            { path: '/alreadyInvite', component: alreadyInvite, name: '已招聘信息' },
        ]
    },  
//  {
//      path: '/',
//      component: Home,
//      name: '导航一',
//      iconCls: 'el-icon-message',//图标样式class
//      children: [
//         // { path: '/main', component: Main, name: '主页', hidden: true },
//          { path: '/table', component: Table, name: 'Table' },
//          { path: '/form', component: Form, name: 'Form' },
//          { path: '/user', component: user, name: '列表' },
//      ]
//  },    
//  {
//      path: '/',
//      component: Home,
//      name: '',
//      iconCls: 'fa fa-address-card',
//      leaf: true,//只有一个节点
//      children: [
//          { path: '/page6', component: Page6, name: '导航三' }
//      ]
//  },
//  {
//      path: '/',
//      component: Home,
//      name: 'Charts',
//      iconCls: 'fa fa-bar-chart',
//      children: [
//          { path: '/echarts', component: echarts, name: 'echarts' }
//      ]
//  },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;