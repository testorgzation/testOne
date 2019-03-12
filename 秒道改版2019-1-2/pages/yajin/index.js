var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayBlock:"none",
    color:"#f9bc01",
    clickButton:"displayFuCeng"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    
     var that = this;
    var balance = options.balance;
    if (balance=="0.00"){
        that.setData({
          color: "#999",
          clickButton:""
        })
    }else{
      that.setData({
        color: "#f9bc01",
        clickButton: "displayFuCeng"
      })
    }
    that.setData({
      balance:balance
    })

  },
  //退还押金
  pledge(){
          var that = this;
          var openid = app.globalData.openId;
          var dv_id = app.globalData.dv_id;
          this.setData({
            displayBlock: "none",
          })
          my.httpRequest({
            url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/pledge',
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            data: { openid: openid, dv_id: dv_id },
            success (res) {
              if (res.data.sta == 1) {
                my.confirm({
                  title: '提示',
                  content: res.data.msg,
                })
                that.setData({
                  color: "#999",
                  clickButton: ""
                })
              } else {
                my.confirm({
                  title: '提示',
                  content: res.data.msg,
                })
              }
            },
            fail (res) {
              console.log(res);
            }
          })
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    
  },
  displayFuCeng(){
    this.setData({
      displayBlock: "block"
    })
  },
  displayNone(){
    this.setData({
      displayBlock: "none"
    })
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