var app = getApp();
Page({
  data: {
    flag: 0,
    flag1: 0,
    noteMaxLen: 100, // 最多放多少字
    info: "",
    noteNowLen: 0,//备注当前字数
    phone:"",
  },
  // 监听字数
  bindTextAreaChange (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({ info: value, noteNowLen: len })

  },
  // 提交清空当前值
  onSubmit () {
    var that = this;
    var cleanline = that.data.flag;
    var comfortline = that.data.flag1;
    var suggest = that.data.info;
    var phone = that.data.phone;
    var dv_id = app.globalData.dv_id;
    var openid = app.globalData.openId;
    my.httpRequest({
      url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/feedback',
      headers:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'post',
      data:{cleanline:cleanline,comfortline:comfortline,suggest:suggest,phone:phone,dv_id:dv_id,openid:openid},
      success(res){
         if(res.data.status == 1){
            my.confirm({
              title: '提示',
              content: '感谢您的反馈',
              success(res){
                if (res.confirm){
                    my.redirectTo({
                      url: '../personal/index',
                    })
                }else{
                  that.setData({ info: '', noteNowLen: 0, flag: 0, flag1: 0, phone: null })
                }
              }
            })
         }else{
           my.confirm({
             title: '提示',
             content: '提交失败',
           })
         }
      },
      fail(res){
        my.confirm({
          title: '提示',
          content: '提交失败',
        })
      }
    })

  },
  ceshi(){
    //my.open
    app.globalData.dv_name = '5555';
    console.log(app.globalData.dv_name);
  },
  changeColor1 () {
    var that = this;
    that.setData({
      flag: 1
    });
  },
  changeColor2 () {
    var that = this;
    that.setData({
      flag: 2
    });
  },
  changeColor3 () {
    var that = this;
    that.setData({
      flag: 3
    });
  },
  changeColor4 () {
    var that = this;
    that.setData({
      flag: 4
    });
  },
  changeColor5 () {
    var that = this;
    that.setData({
      flag: 5
    });
  },
  changeColort1 () {
    var that = this;
    that.setData({
      flag1: 1
    });
  },
  changeColort2 () {
    var that = this;
    that.setData({
      flag1: 2
    });
  },
  changeColort3 () {
    var that = this;
    that.setData({
      flag1: 3
    });
  },
  changeColort4 () {
    var that = this;
    that.setData({
      flag1: 4
    });
  },
  changeColort5 () {
    var that = this;
    that.setData({
      flag1: 5
    });
  },
  passWdInput(e){  //手机号码
    console.log(e.detail.value)
    this.setData({ 
      phone: e.detail.value
      })
  }

})
