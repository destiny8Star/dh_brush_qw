import AheadBaseApi from './AheadBaseApi.js';
import { hex_md5 } from '../utils/md5.js';
import config from '../config/Index.js';

/**
 * 环境
 * */
const baseURL3 = config.baseURL3  //本地商户相关
const baseURL2 = config.baseURL2   //本地支付相关
const pay_key = config.pay_key  //测试
const h5_activy = config.h5_activy  //h5活动
const isDev = config.isDev  //是否是开发版  true：是  false：不是
const index_logo = config.index_logo

const appId = config.appId  //小程序appid  启动后屏小程序用
const hostAppId = config.hostAppId //hostAppid  启动后屏小程序用
const miniappType = config.miniappType //小程序版本类型  0:正式版;1:开发版;2:体验版  启动后屏小程序用




export default class AheadApi extends AheadBaseApi {
  constructor() {
    super();
    this.appId = appId
    this.hostAppId = hostAppId
    this.miniappType = miniappType
    this.isDev = isDev
    this.index_logo = index_logo
    this.baseURL3 = baseURL3 
  }
 
  /**
   * 付款接口
   */
  pay(authcode, price, user_no = '', couponId = '') {
    let sign = '';
    let times = new Date().getTime()
    sign += 'authCode=' + authcode + '&timestamp=' + times + '&totalPrice=' + price + '&key=' + pay_key
    sign = hex_md5(sign).toUpperCase()
    console.log('参数',authcode,sign,price,user_no,couponId)
    return this.post(baseURL2 + '/api/aliFacePay/createFaceOrder', {
      "authCode": authcode,
      "sign": sign,
      "timestamp": times,
      "totalPrice": price,
      "userNo": user_no,
      "couponId": couponId
    })
  }
  /**
   * 查询支付结果
   * */
  getPayres(orderNo) {
    return this.post(baseURL2 + '/api/aliFacePay/facePayOrderQuery', {
      orderNo: orderNo
    })
  }



}