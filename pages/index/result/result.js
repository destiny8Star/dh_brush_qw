// pages/result/result.js
const app = getApp()
import Tips from "../../../class/utils/Tips.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount:0, //支付金额
    status:0, //支付状态 0 等待  1、成功  2、失败
    flag: true,//true 继续  false 终止
    num:"", //倒计时
    canOut:false, //是否可以返回 true 可以  false 不可以
    it: function () { },
    token:"",// token 小程序二维码图片用
    apiHost:app.ahead.baseURL3,//域名
    isMask:false,// 是否展示广告
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let datas = JSON.parse(options.datas) 
     console.log("获取参数",datas)
     if(datas.code == 'SUCCESS'){
       this.setData({
         status:1,
         amount:datas.totalPrice,
         canOut:true
       })
       this.countDown()
     } else if (datas.subCode == "USERPAYING"){
       this.polling(30, datas.orderNo)
     }else{
       this.setData({
         status: 2,
         canOut: true
       })
       this.countDown()
     }

    //从缓存中获取商户信息,判断是否是开启新零售的商户
    let is_new_retail = wx.getStorageSync("infos").is_new_retail
    let token = wx.getStorageSync("token")
    console.log("info",is_new_retail)
    if(is_new_retail){
        this.setData({
            token:token,
            isMask:true
        })
    }
  },
  /**
 * 查询支付结果
 */
  polling(num, order) {
    console.log('在轮询', num, order)
    let that = this
    let flag = this.data.flag
    if (num > 0 && flag) {
      num -= 2
      //查询结果  
      app.ahead.getPayres(order)
        .then(res => {
          console.log('支付结果', res)
          if (res.data.code == 'SUCCESS') {
            that.setData({
              status: 1,
              amount: res.data.totalPrice,
              canOut: true
            })
            this.countDown()
            // setTimeout(function () {
            //     my.reLaunch({
            //       url: '/pages/verify/verify',
            //     });

            // }, 3000)
          } else {
            //支付失败
            if (res.data.subCode == "USERPAYING") {
              setTimeout(function () {
                that.polling(num, order)
              }, 2000)
            } else {
              that.setData({
                status: 2,
                canOut: true
              })
              that.countDown()
            }
          }
        })
        .catch(rej => {
          console.log('请求失败', rej)
          Tips.toast('网络异常', function(){
            that.setData({
              status: 2,
              canOut: true
            })
            that.countDown()
          },"none")
        })
    } else {
      this.setData({
        status:2,
        canOut: true
      })
      this.countDown()
    }
  },
  // 返回首页
  goReturn(){
    let canOut = this.data.canOut
    if(canOut){
      wx.navigateBack({
        delta: 1
      })
    }else{
      Tips.toast("请等待查询结果","","none")
    }
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //倒计时
  countDown(){
    let that = this
    let num = 5;
    let flag = this.data.flag
    if(flag){
      let it = setInterval(function () {
        num--;
        console.log('nnn', num)
        that.setData({
          num: num,
          it: it
        })
        if (num <= 0) {
          clearInterval(it)
          wx.reLaunch({ url: '/pages/index/index' })
        }
      }, 1000)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("页面隐藏")
    let it = this.data.it
    clearInterval(it) //清除定时器
    this.setData({
      flag: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("页面鞋子啊")
    let it = this.data.it
    clearInterval(it) //清除定时器
    this.setData({
      flag: false
    })
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