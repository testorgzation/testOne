// pages/company/company.js
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
  voteTitleOne (e) {
    console.log(e.detail.value)
  },
  voteTitleTow (e) {
    console.log(e.detail.value)
  },
  voteTitleThree (e) {
    console.log(e.detail.value)
  },
  voteTitleFour(e){
    console.log(e.detail.value)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {
    
  },
  bindregister(){
    my.navigateTo({
      title: "goback",
      url: '../registerTishi/index'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {
    
  }
})