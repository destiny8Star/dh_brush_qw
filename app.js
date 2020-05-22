//app.js
import Auth from "/class/api/AuthApi.js"
import Ahead from "/class/api/AheadApi.js"

const auth = new Auth()
const ahead = new Ahead()

App({
  auth:auth, //后屏api
  ahead: ahead,//前屏api
  onLaunch: function () {
  },
  globalData: {
   
  },
 
})