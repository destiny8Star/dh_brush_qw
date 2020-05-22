const app = getApp()
import Tips from '../../../class/utils/Tips'
Page({
  data: {
    canlog:false,//登录按钮是否可以点击
    name:'',
    pass:'',
    status:'0',//1，已经登录，0、未登录
    infos:{}, //商户信息
  },
  /**
   * 
   * @param {登录提交} 
   */
    onSubmit(e) {
      console.log('eee',e)
      let data={
        username:e.detail.value.name,
        pwd:e.detail.value.pass
      }
    Tips.loading()
    app.auth.login(data)
    .then(res=>{
      Tips.loaded()
      console.log('登录结果',res)
      wx.setStorageSync('token', res.data.data)
      return  app.auth.getMinfo()
    
    })
    .then(res=>{
      console.log('获取商户信息',res)
      wx.setStorageSync('infos', res.data.data)
      //传递信息
      app.auth.sendMsg("refresh")
        console.log("发送消息")
        // Tips.toast('登录成功',function(){
      wx.switchTab({
        url: '/pages/behind/behind',
      })
        // })

    
    })   
    .catch(rej=>{
      Tips.loaded()
      console.log("失败",rej)
      Tips.toast(rej.message || rej.errorMessage,"", "none")
    })
  },
  inpName(e){
     let pass=this.data.pass
     this.setData({
        name:e.detail.value
     })
     if(e.detail.value&&pass){
       this.setData({
        canlog:true 
       })
     }else{
         this.setData({
          canlog:false 
       })
     }
  },
   inpPass(e){
     let name=this.data.name
     this.setData({
        pass:e.detail.value
     })
    if(e.detail.value&&name){
       this.setData({
        canlog:true 
       })
     }else{
         this.setData({
          canlog:false 
       })
     }
    //  console.log('密码',e.detail.value,name)
  },
  onLoad() {
  },
  onShow(){
    let token=wx.getStorageSync("token")
    if(token){
      Tips.loading()
      app.auth.getMinfo()
      .then(res=>{
        Tips.loaded()
        this.setData({
          status:'1',
          infos:res.data.data
        })
        // console.log('获取信息',res)
      })
      .catch(rej=>{
        Tips.loaded()
        Tips.alert(rej.message||rej.errorMessage)
      })
    }
  },
  /**
   * 退出登录
   */
  outLogin(){
    let that = this
    wx.removeStorage({
      key: 'token',
      success: function(){
        Tips.toast('成功退出',function(){
          that.setData({
            status:0,
            infos:{}
          })
        })
      }
    });
  }
});
