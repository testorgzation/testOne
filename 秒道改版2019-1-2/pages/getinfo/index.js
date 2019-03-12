//index.js
//获取应用实例
const app = getApp()
Page({
  onLoad (options){
    var q = decodeURIComponent(options.q);
    var arr = q.split("=");
    // var dv_id = arr[1];
    var dv_id = 14213;  //7184 14212 14213 14210 14209 14208 14207 14206 14213 15669 15880 15506 15669
    if(dv_id){
       app.globalData.dv_id = dv_id;
      //获取设备名称
      my.httpRequest({
        url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogram/getdvname',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        data: { dv_id: dv_id },
        success (res) {
          console.log(res)
          if (res.data.status == 1) {
            app.globalData.dv_name = res.data.msg;
            app.globalData.openaudio = res.data.openaudio;
            app.globalData.closeaudio = res.data.closeaudio;
          }
        }
      })
    }
    
  },
  getUserInfo (e) {
var str=null;
        my.getStorage({
          key: "user",
          success: function(res) {
           str=res.data;
       
          }, 
          fail: function() {  
                     console.log("用户信息获取失败")
          }
        })
    if(str){
      app.globalData.userInfo = str;
      if (app.globalData.dv_id && app.globalData.dv_name){
        my.redirectTo({
          url: '../login/login',
        })
      }else{
        my.httpRequest({
          url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/isuser',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          data: { openid: app.globalData.openId },
          success(res){
              if(res.data.sta == 1){ //注册过
                my.redirectTo({
                  url: '../login/login',
                })
              }else{
                my.showToast({
                  content: '请扫码附近设备',
                })
              }
          }
        })
      }
    }else{
      my.showToast({
        content: '登录失败',
      })
    }

  }
})
