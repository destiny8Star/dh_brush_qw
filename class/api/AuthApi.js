import BaseApi from './BaseApi.js';
import { hex_md5 } from '../utils/md5.js';
import config from '../config/Index.js';

/**
 * 环境
 * */
const baseURL3 = config.baseURL3  //本地商户相关
const baseURL2 = config.baseURL2   //本地支付相关
const pay_key = config.pay_key  //测试
const h5_activy = config.h5_activy  //h5活动
const targetAppid = config.targetAppid//发送目标小程序appid



export default class AuthApi extends BaseApi {
  constructor() {
    super();
  }
  /**
 * 登录
 * */
  login(data) {
    return this.post(baseURL3 + '/public/user/login', data)
  }
  /**
   * 给前屏小程序发送信息
   */
  sendMsg(cont){
    let data = {}
    // let token = wx.getStorageSync("token")
    data={
      // token:token,
      cont:cont
    }
    return new Promise((resolve,reject)=>{
      wxfaceapp.postMsg({
        targetAppid: targetAppid,
        content: data,
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        }
      })
    })
  
  }
  /**
 *判断是否过期
 */
  isOverdue() {
    return this.get(baseURL3 + '/mer/applet/user/check/login')
  } 
  /*
    获取商户信息
  */
  getMinfo() {
    return this.post(baseURL3 + '/mer/applet/user/info')
  }

}