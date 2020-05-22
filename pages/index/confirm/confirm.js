// pages/index/confirm/confirm.js
const app =getApp()
import Tips from "../../../class/utils/Tips.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount:0, //传递过来的金额
    isMask:true,//是否隐藏弹框  true:隐藏  false:不隐藏
    token:"",// token 小程序二维码图片用
    apiHost:app.ahead.baseURL3,//域名
  },
  //hideMask 取消弹框
  hideMask(){
     this.setData({
      isMask:true
     })
  },
  //返回
  goBack(){
    wx.navigateBack({
       delta:1
    })
  },
  //开启刷脸支付
  openFace(){
    let price = this.data.amount
    this.toSettle(price)
  },

  //结算
  toSettle(price) {
    let that = this
    //青蛙刷脸支付
    wxfaceapp.facePay({
      requireFaceCode: true, //是否需要获取付款码返回给小程序
      success(res) {
         console.log("刷脸信息",res)
        //刷脸成功Event 建议配合facePay的调用结果进行注册
        wxfaceapp.onFacePayPassEvent(function (res) {
          console.log("刷脸成功Event retCode = " + res.faceCode)
          //后端接口支付
          app.ahead.pay(res.faceCode, price)

            .then(res => {
              console.log("支付结果", res)
              wx.navigateBack({
                delat:1
              })
            })
            .catch(rej => {
              console.log("支付失败", rej)
            })
        })
        //刷脸失败Event 建议配合facePay的调用结果进行注册
        wxfaceapp.onFacePayFailedEvent(function (res) {
          console.log("刷脸失败Event retCode = " + JSON.stringify(res))
        })
      },
      fail(res) {
        console.log("支付fail [launchFaceApp]", res)
      }
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("获取参数",options.amount)
    this.setData({
      amount: options.amount
    })
    //从缓存中获取商户信息,判断是否是开启新零售的商户，是的话弹框 0否 , 1是
    let is_new_retail = wx.getStorageSync("infos").is_new_retail
    let token = wx.getStorageSync("token")
    console.log("info",is_new_retail)
    if(is_new_retail){
        this.setData({
            token:token,
            isMask:false
        })
    }
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let that = this
    let amount = that.data.amount

    //接受另一端屏幕上的小程序发来的消息
    wxfaceapp.onRemoteMessage(function (res) {
      let datas = JSON.parse(res.content)
      console.log("在确认金额页面接收后屏信息 : " + JSON.stringify(res), res.content,datas)
      if(datas.cont == 'back'){
        wx.navigateBack({
          delta:1
        })
      }
      
    })

    // console.log("或诶参数", amount)
    //监听扫码器
    wxfaceapp.listenCodePayment({
      success(res) {
        //注册事件
        let reg = /^1[0-5]\d{16}$/  //判断微信正则
        wxfaceapp.onCodePayEvent(function (res) {
          console.log("刷卡事件 retCode = " + JSON.stringify(res))

          // if(!amount) return;  //如果不存在amount或者为0 就不让支付.
          // console.log("amount",amount)  //没办法，在index还是可以监听到
          let isWX = reg.test(res.code) //判断是否是微信
          //后端接口支付
          app.ahead.pay(res.code, amount)
            .then(res => {
              console.log("支付结果", res,isWX)
              // if(isWX){
              //     wx.navigateTo({
              //       url: '/pages/index/index',
              //     })
              // }else{
                let datas = res.data
                console.log("要去result页面",datas,JSON.stringify(datas))
                wx.redirectTo({
                  url: '/pages/index/result/result?datas=' + JSON.stringify(datas),
                })
              // }
            })
            .catch(rej => {
              console.log("支付失败", rej)
            })
        })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})