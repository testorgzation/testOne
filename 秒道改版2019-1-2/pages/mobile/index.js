var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',//手机号
    code: '',//验证码
    iscode: null,//用于存放验证码接口里获取到的code
    disabled:true,
    codename: '发送验证码',
    tm:null,  //发送时间
    fcode:null,  //发送的验证码
    fphone:null,  //发送的手机
    i:0
  },
  //获取input输入框的值
  getNameValue (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhoneValue (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode () {
    var phone = this.data.phone;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      my.showToast({
        content: '手机号不能为空',
        type: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      my.showToast({
        content: '请输入正确的手机号',
        type: 'none',
        duration: 1000
      })
      return false;
    } else {
      my.httpRequest({
        url: 'https://www.miaodaokeji.com/miaodao.php/Xlogin/sendsms',//接口地址
        method: 'get',
        data: { mobile: phone },
        success(res) {
         if(res.data.status == 1){
           _this.setData({
             disabled: false,
             iscode:res.data.code,
             tm:res.data.tm,
             fphone:res.data.phone
           })
            var num = 61;
            var timer = setInterval(function () {
              num--;
              if (num <= 0) {
                clearInterval(timer);
                _this.setData({
                  codename: '重新发送',
                  disabled: true
                })

              } else {
                _this.setData({
                  codename: num + "s"
                })
                str()
                return false;
              }
            }, 1000)
           var i = 0;
            function str(){
              i++;
              if(i==1){
                my.showToast({
                  content: '发送验证码成功',
                  type: 'none',
                  duration: 1000
                })
              }
            }
         }
        }
      })

    }
  },
  //获取验证码
  getVerificationCode() {
    var _this = this
    if (_this.data.disabled){
      this.getCode();
    }else{
       console.log("没有执行");
    }
  },
  //提交表单信息 即绑定
  save () {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;

    if (this.data.phone == "") {
      my.showToast({
        content: '手机号不能为空',
        type: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      my.showToast({
        content: '请输入正确的手机号',
        type: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      my.showToast({
        content: '验证码不能为空',
        type: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.code != this.data.iscode) {
      my.showToast({
        content: '验证码错误',
        type: 'none',
        duration: 1000
      })
      return false;
    } else {
      var dv_id = app.globalData.dv_id;    //设备id
      var openId = app.globalData.openId;  //用户openid
      var code = this.data.code;
      var fcode = this.data.iscode;
      var phone = this.data.phone;
      var fphone = this.data.fphone;
      var tm = this.data.tm;
      //提交
      my.httpRequest({
        url: 'https://www.miaodaokeji.com/miaodao.php/Mdminiprogramt/bindmobile',
        headers:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        method:'post',
        data: { dv_id: dv_id, openid: openId, code: code, phone: phone, tm: tm, fcode: fcode, fphone: fphone},
        success(res){

          if(res.data.sta == 1){  //购买页面
            my.redirectTo({
              url: '../Setmeal/index',   //购买页面
            })
          }else if(res.data.sta == 2){  //本人正在使用当前设备
            my.redirectTo({
              url: '../Mathtimer/index?tm=' + res.data.tm,
            })
          }else if(res.data.sta == 3){  //设备使用中 代还锁
            my.redirectTo({
              url: '../StillLock/index',
            })
          }else if(res.data.sta == 4){   //您有使用中的设备
            my.showToast({
              content: '您有使用中的设备',
            })
          }else{
            my.showLoading({
              content: res.data.msg,
              mask: true
            })
          }
        },
        fail(res){
            my.confirm({
              title: '提示',
              content: '绑定失败',
            })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {

  }
})
