// pages/behind.js
const app = getApp()
import Tips from "../../class/utils/Tips.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: "",
    isfocus: true, //input聚焦
  },
  //验证小数
  NumberCheck(num) {
    var str = num;
    var len1 = str.substr(0, 1);
    var len2 = str.substr(1, 1);
    //如果第一位是0，第二位不是点，就用数字把点替换掉
    if (str.length > 1 && len1 == 0 && len2 != ".") {
      str = str.substr(1, 1);
    }
    //第一位不能是.
    if (len1 == ".") {
      str = "";
    }
    //限制只能输入一个小数点
    if (str.indexOf(".") != -1) {
      var str_ = str.substr(str.indexOf(".") + 1);
      if (str_.indexOf(".") != -1) {
        str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
      }
    }
    //如果需要保留小数点后两位，则用下面公式
      str = str.replace(/\.\d{3}$/,'')
    return str;
  },
  //限制input
  limitInp(e) {
    let inp = e.detail.value
    console.log("获取参数", inp)
    inp = this.NumberCheck(inp)
    this.setData({
      price: inp
    })
  },
  //提交
  toHead(e) {
    let num = e.detail.value.amount
    console.log("ee", e,num)

    let that = this
    if(!num){
      return Tips.alert("请输入正确金额!")
    }
    Tips.toast("请等待支付", "", "none")
    app.auth.sendMsg(num)
    .then(res=>{
      console.log('发送信息suc', JSON.stringify(res))
    })
    .catch(rej=>{
      console.log('发送信息fail = ' + JSON.stringify(rej))
    })

    that.setData({
      price: "",
    })

  },
  //取消
  cancel() {
    let that = this
    app.auth.sendMsg("back")
      .then(res => {
        console.log('发送信息suc', JSON.stringify(res))
        Tips.toast("取消成功", function(){
          that.setData({
            price: "",
          })
        }, "none")
      })
      .catch(rej => {
        console.log('发送信息fail = ' + JSON.stringify(rej))
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    let token = wx.getStorageSync("token")
    // console.log("获取token",token)
    if (!token) {
      return wx.switchTab({
        url: '/pages/behind/login/login',
      })
    }
    //判断是否过期
    app.auth.isOverdue()
      .then(res => {
        this.setData({
          isfocus: true
        })
      })


    //接受另一端屏幕上的小程序发来的消息
    // wxfaceapp.onRemoteMessage(function (res) {
    //   console.log("接收前坪来的信息  = " + JSON.stringify(res), res.content)
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})