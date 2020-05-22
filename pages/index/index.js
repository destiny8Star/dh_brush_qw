//index.js
//获取应用实例
const app = getApp()
import Tips from "../../class/utils/Tips.js"
Page({
  data: {
    isDev: app.ahead.isDev, //是否是开发版  true:是  false：不是
    logo: app.ahead.index_logo,//首页底部logo
    token:"",
    isNew:false,//是否是新零售商户
    apiHost:app.ahead.baseURL3,
  },
  onLoad: function() {
    let token=wx.getStorageSync("token")
     
    // 从缓存中获取商户信息,判断是否是开启新零售的商户
    
    let is_new_retail = wx.getStorageSync("infos").is_new_retail
    console.log("info",is_new_retail)
    if(is_new_retail){
        this.setData({
            isNew:true
        })
    }else{
      this.setData({
        isNew:false
       })
    }
    this.setData({
      token:token
    })
    console.log("token",token)
 
  },
  onShow(){
    // let token=wx.getStorageSync("token")
    // let is_new_retail = wx.getStorageSync("infos").is_new_retail
    // console.log("info",is_new_retail)
    // if(is_new_retail){
    //     this.setData({
    //         isNew:true
    //     })
    // }
    // this.setData({
    //   token:token
    // })
    // console.log("token",token)

    //接受另一端屏幕上的小程序发来的消息
    let that = this
    wxfaceapp.onRemoteMessage(function (res) {
      console.log("接收后屏信息index = " + JSON.stringify(res))
      let datas = JSON.parse(res.content)
      //如果是取消,就什么都不做
     if(datas.cont == 'back' )return;
     if(datas.cont == 'refresh'){
       console.log("要刷新了，刷不刷")
       that.onLoad()
       return 
     }
      wx.navigateTo({
        url: '/pages/index/confirm/confirm?amount=' + datas.cont,
      })
    
   
    })
  },
  //打开后屏
  openAft(){
    //启动后屏小程序
    let that = this
    wxfaceapp.launchMp({
      appId: app.ahead.appId,
      hostAppId: app.ahead.hostAppId,
      miniappType: app.ahead.miniappType,//小程序版本类型
      launchPage: "/pages/behind/behind",
      needLogin: 0,//是否需要登录态
      success(res) {
        console.log('启动成功suc', JSON.stringify(res))
      },
      fail(res) {
        console.log('启动失败 reply = ' + JSON.stringify(res))
      }
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },
//测试

  // 查看青蛙App此时是否具有登录态 - isLoginOnFaceApp
  // isLoginOnFaceApp(){
  //   wxfaceapp.isLoginOnFaceApp({
  //     success() {
  //       //成功，说明此时青蛙App具备登录态，可以进行小程序内登录
  //       console.log("[isAlreadyLogin] is login on face app, free to call [wx.login]")
  //     },
  //     fail() {
  //       //失败，说明此时青蛙App不具备登录态，需要进行刷脸登录获取登录态，然后才可以进行小程序内登录
  //       console.log("[isAlreadyLogin] not login on face app, free to call [faceLogin]")
  //     }
  //   })
  // },

  //青蛙刷脸登录 - faceLogin
  // faceLogin(){
  //   wxfaceapp.faceLogin({
  //     //开启重复登录
  //     enableMultiLogin: true,
  //     //登录成功后，自动路由至此页面
  //     relaunchUrl: "pages/index/index",
  //     success(res) {
  //       console.log("[faceLogin] success",res)
  //     },
  //     fail(res) {
  //       console.log("[faceLogin] failed",res)
  //     }
  //   })
  // },
  // //mylogin
  // mylogin(){
  //   wx.login({
  //     success(res) {
  //       console.log("获取login信息,code",res)
  //       if (res.code) {
       
  //       } else {
  //         console.log('登录失败！' + res.errMsg)
  //       }
  //     }
  //   })
  // },
  // //bindGetUserInfo
  // bindGetUserInfo(e){
  //   console.log(e)
  // },
  // //获取手机号
  // getPhoneNumber(e) {
  //   console.log("手机号",e)
  // }
})