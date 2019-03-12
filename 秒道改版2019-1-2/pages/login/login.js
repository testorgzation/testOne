var app = getApp();
Page({
  data: {
    disabled: true,
    btnstate: 'default',
    account: '',
    password: '',
    voteTitle:null
  },
  onLoad (options) {
    my.showLoading({
      content: '登录中',
      mask:true
    })
    
    //重写登录注册
    var openId = app.globalData.openId;
    var userInfo = app.globalData.userInfo;
    var dv_id = app.globalData.dv_id;
    if(openId && userInfo){
      var that = this;
      my.httpRequest({
        url: 'https://www.miaodaokeji.com/miaodao.php/Mdminiprogramt/register',
        method: 'post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: { openid: openId, nickname:userInfo.nickName, avatarurl:userInfo.avatarUrl, dv_id: dv_id },
        success (res) {
          if (res.data.sta == 1) { //商品页面
            my.redirectTo({
              url: '../Setmeal/index',
            })
          }
          if (res.data.sta == 5) {  //绑定手机
            my.redirectTo({
              url: '../mobile/index',
            })
          }
          if (res.data.sta == 6) {  //注册失败
            my.showToast({
              content: '注册失败,请退出重新登入',
              type: 'loading',
              duration: 1000
            })
            return
          }
          if (res.data.sta == 2){  //跳转倒计时
             my.navigateTo({
               url: '../Mathtimer/index?tm='+res.data.tm,
             })
             return;
          }
          if (res.data.sta == 3) {  //跳转代还锁页面
            my.redirectTo({
              url: '../StillLock/index?uptm=' + res.data.uptm,
            })
          }
          if (res.data.sta == 4){  //有使用中的设备
            my.showToast({
              content: '您有使用中的设备',
            })
          }
          if (res.data.sta == 0){
            my.showToast({
              content: '查找设备失败!请扫码重试',
            })
          }

        },
        fail (res) {
          my.showToast({
            content: '请求注册失败',
            type: 'loading',
            duration: 1000
          })
        }
      })
    }else{
      my.showToast({
        content: '登录失败',
      })
    }
  },

})