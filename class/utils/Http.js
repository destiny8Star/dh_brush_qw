import Tips from './Tips.js';


export default class Http {
  constructor() {

  }

  /**
   * 
   */
  static request(method, url, data) {
    return new Promise((resolve, reject) => {
    
      let header = this.createAuthHeader();
      if (!data) {
        data = {};
      }
      // if (method.toUpperCase() == 'POST') {
      //   header = Object.assign(header, {
      //     'content-type': 'application/x-www-form-urlencoded'
      //   });
      // }

      wx.request({
        url:  url,
        method: method,
        header: header,
        data: data,
        success: (res) => {
          // console.log("总获取结果",res)
          const wxCode = res.statusCode;
          if (wxCode != 200) {
            reject(res)
          } else {
            const wxData = res.data;
            const code = wxData.code;
            if (code != 200) {
              if (code == 200302) { //重新授权的提示
                console.log('登录过期')
                return Tips.toast('登录失效，请重新登录',  function () {
                  wx.removeStorage({
                    key: 'token',
                    success: () => {
                      wx.switchTab({
                        url: '/pages/behind/login/login'
                      })
                    }
                  });
                },"none")
              }
              reject(wxData);
            } else {
              if (res.header&&res.header['refresh-auth']) {
                wx.setStorageSync('token', res.header['refresh-auth'])
              }
              resolve(res);
            }
          }
        },
        fail: (res) => {
          reject(res);
        }
      })
    });
  }

  static createAuthHeader() {
    var header = {};
    let token = wx.getStorageSync('token')
    if (token && token != '') {
      header["mer-auth"] = token;
    }
    return header;
  }

  static upload(url, file, data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        data = {};
      }
      if (wx.getStorageSync('user')) {
        let user = wx.getStorageSync('user');
        data.user_id = user.id;
      }
      wx.uploadFile({
        url: baseURL + url,
        filePath: file,
        name: 'files',
        method: 'POST',
        formData: data,
        header: {
          "content-type": "multipart/form-data"
        },
        success: (res) => {
          const wxCode = res.statusCode;
          if (wxCode != 200) {
            reject(res)
          } else {
            const wxData = res.data;
            const code = wxData.code;
            if (code != 200) {
              resolve(wxData.data);
            } else {
              const serverData = wxData.data;
              resolve(serverData);
            }
          }
        },
        fail: (res) => {
          reject(res);
        }
      })
    });
  }

  static get(url, data) {
    return this.request("GET", url, data);
  }

  static put(url, data) {
    return this.request("PUT", url, data);
  }

  static post(url, data) {
    return this.request("POST", url, data);
  }

  static patch(url, data) {
    return this.request("PATCH", url, data);
  }

  static delete(url, data) {
    return this.request("DELETE", url, data);
  }
}