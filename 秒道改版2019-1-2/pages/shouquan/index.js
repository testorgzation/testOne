
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: my.canIUse('button.open-type.getUserInfo')
  },
  MyopenSetting(res){
    console.log(res.detail.authSetting);
  },
  // 兼容不支持opentype 1.4.0基础库
  lowLogin () {
    console.log(12)
    //  支持getsetting 1.2.0
    if (my.getSetting) {
      my.getSetting({
        success (resGetting) {
          //  用户已经授权 1.2.0基础库
          if (resGetting.authSetting['scope.userInfo']) {
            my.getAuthUserInfo({
              success (UserInfo) {
                console.log(UserInfo);
                app.globalData.userInfo = UserInfo;
                my.navigateTo({
                  url: '../login/login',
                })
              }
            })
            // 用户未授权
          } else {
            // 拉取授权
            my.getAuthUserInfo({
              fail () {
                my.confirm({
                  title: '提示',
                  content: '您尚未授权,是否打开设置界面进行授权？',
                  success (res) {
                    if (res.confirm) {
                      
                      my.openSetting({
                        success (ee) {
                          //  授权成功
                          if (ee.authSetting['scope.userInfo'] == true) {
                            my.getAuthUserInfo({
                              success (userInfo) {
                                app.globalData.userInfo = UserInfo;
                                my.navigateTo({
                                  url: '../login/login',
                                })
                              }
                            })
                          } else {
                            my.confirm({
                              title: '提示',
                              content: '您未授权，若需要使用部分功能，请登录授权',
                              showCancel: false
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            })

          }
        }
      })
      //  不支持getsetting 通过调用my.getAuthUserInfo判断是否授权，若未授权则进入fail函数
    } else {
      my.getAuthUserInfo({
        success (getUserInfo) {
          console.log(getUserInfo);
          app.globalData.userInfo = UserInfo;
          my.navigateTo({
            url: '../login/login',
          })
        },
        fail () {
          // 用户未授权 弹窗通过opensetting授权
          my.confirm({
            title: '提示',
            content: '您尚未授权小程序，是否打开设置界面进行授权?',
            success (showModal) {
              //  确定打开 调用opensetting 1.1.0
              if (showModal.confirm) {
                my.openSetting({
                  success (opensetting) {
                    console.log(opensetting);
                    if (opensetting.authSetting['scope.userInfo']) {
                      my.getAuthUserInfo({
                        success (userInfo) {
                          app.globalData.userInfo = UserInfo;
                          my.navigateTo({
                            url: '../login/login',
                          })
                        }
                      })
                    } else {
                      my.confirm({
                        title: '提示',
                        content: '你未授权小程序，将无法使用部分功能，若需要使用此部分功能，请授权登录',
                        showCancel: false
                      })
                    }
                  }
                })
              }
            }

          })
        }
      })
    }
  }
})