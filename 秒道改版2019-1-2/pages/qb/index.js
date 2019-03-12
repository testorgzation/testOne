var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    var that = this;
      var shebei_id = app.globalData.dv_id;
      var openid = app.globalData.openId;
      //查询数据
      my.httpRequest({
        url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/userinfo',
        headers:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        method:'post',
        data:{dv_id:shebei_id,openid:openid},
        success(res){
          that.setData({
            balance:res.data.balance,
            pledge:res.data.pledge
          });
        },
        fail(res){
            console.log(res);
        }
      })
  },
  //充值跳转
  chongzhi(){
      my.redirectTo({
        url: '../yajin/index?balance='+this.data.balance,
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