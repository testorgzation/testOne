var progressNum = 0; //定义一个初始值0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diaplayBlock:"none",
    money: null,
    tmlen: null,
    tuinum: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    var money = options.money;
    var tmlen = options.tmlen;
    var tuinum = options.tuinum;
    var paytype = options.paytype;
    if (paytype == 1){
      paytype = '小时计费'
    }else{
      paytype = '整晚计费'
    }
    this.setData({
      money: money,
      tmlen: tmlen,
      tuinum: tuinum,
      paytype: paytype
    })
  },
  btnclick(){
    this.setData({
      diaplayBlock:"block"
    })
    var that = this;
    var timer = setInterval(function () {
      progressNum++;
      //当进度条为100时清除定时任务
      if (progressNum >= 100) {
        clearInterval(timer);
        that.setData({
          diaplayBlock: "none"
        })
      }
      //并且把当前的进度值设置到progress中
      that.setData({
        progress: progressNum
      })
    }, )

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