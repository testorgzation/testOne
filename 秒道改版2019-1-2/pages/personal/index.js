var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayBlock: "none"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    var that = this;
    var shebei_id = app.globalData.dv_id;
    var openid = app.globalData.openId;
    //console.log("个人信息:",openid);
    //var openid = "ot4mo5X__MRwnrqdOGNrxUH9dwIs";
    //获取个人信息
    my.httpRequest({
      url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/personal',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "post",
      data: { dv_id: shebei_id, openid: openid },
      success (res) {
        if (res.data.status == 1) {
          that.setData({
            headerimg: res.data.msg.img,
            phone: res.data.msg.phone
          })
        }

      },
      fail (res) {
        console.log(res);
      }
    })
  },
  qb () {
    my.navigateTo({
      title: "goback",
      url: '../qb/index',
    })
  },
  myorder () { //我的订单
    my.navigateTo({
      url: '../DingDanLeiBiao/index',
    })
  },
  suggest () { //意见反馈
    my.navigateTo({
      url: '../feedback/index',
    })
  },
  //拨打电话
  pledge(e){
   
    my.makePhoneCall({
      number: e.currentTarget.dataset.phone
    })
  },
  displayFuCeng() {
    this.setData({
      displayBlock: "block"
    })
  },
  displayNone() {
    this.setData({
      displayBlock: "none"
    })
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