//app.js
App({
  onLaunch () {
    // 展示本地存储能力
    // var logs = my.getStorageSync({key:{key:'logs'}}) || []
    // logs.unshift(Date.now())
    // my.setStorageSync({key:{key:'logs',data:data:logs}})
    var that = this;
    // 登录
    my.getAuthCode({
       scopes:'auth_user',
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.authCode){
            my.httpRequest({
              url: "https://miaodaokeji.com/miaodao.php/Mdminiprogram/login",
              method:'post',
              headers:{
                'content-type':'application/x-www-form-urlencoded' 
              },
              data: { code: res.authCode },
              success(res){
                console.log(res);
                var openid = res.data.errcode;
                that.globalData.openId = openid;
              },
              fail(res){
                that.globalData.loginstatus = 4;   //换取信息
              }
            })
        }
         if(res.authSuccessScope[0]=='auth_user'){
                    my.getAuthUserInfo({
                            success: res => {
                              // 可以将 res 发送给后台解码出 unionId
                              console.log(res);
                                       my.setStorage({
                                          key:"user",
                                          data:res,
                                          success: function() {   
                                               console.log("用户数据储存成功")             
                                          },
                                          fail: function() {
                                               console.log("用户数据储存失败")       
                                          }
                                        })
                              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                              // 所以此处加入 callback 以防止这种情况
                              if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                              }
                            }
                    })
          }
      },fail(){
        console.log("登录失败");
      }
    })
  },
  globalData: {
    userInfo: null,
    userid:'',
    openId:'',
    dv_id: null,
    dv_name:null,
    deviceId:'00:18:31:E5:1C:00',
    device_id:null,
    serviceId:'0000FFF0-0000-1000-8000-00805F9B34FB',
    characteristicId:'0000FFF6-0000-1000-8000-00805F9B34FB',
    connectedsta:false,
    onconnectedsta:false,
    issearch:false,
    characteristicvalue:null,
    alsolock:false,
    openaudio: null,    //开锁语音
    closeaudio: null    //关锁语音
  }
})