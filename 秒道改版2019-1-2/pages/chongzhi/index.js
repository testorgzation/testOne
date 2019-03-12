var app = getApp();
// var reportTypeList = [
//   { text: "100元", id: "1" },
//   { text: "100元", id: "2" },
//   { text: "100元", id: "3" },
//   { text: "100元", id: "4" },
//   { text: "100元", id: "5" },
//   { text: "100元", id: "6" },
//   ] 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportTypeList:null,
    id:0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    var that = this;
    console.log(app.globalData.dv_id);
      //请求信息
      my.httpRequest({
        url: 'https://miaodaokeji.com/index.php/Home/Clock/get_shopes',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method:'post',
        data: { shebei_id:app.globalData.dv_id},
        success(res){
          console.log(res);
          that.setData({
            reportTypeList: res.data.info,
          });
        },
        
      })
  },
  click (e) {
    var ids = e.currentTarget.dataset.id;  //获取自定义的id  
    this.setData({
      id: ids  //把获取的自定义id赋给当前组件的id(即获取当前组件)  
    })
  },

  //点击充值
  wxpay (event) {
    var shop_id = this.data.id;
    var shebei_id = app.globalData.dv_id;
    var openid = app.globalData.openId;
    if(shop_id == 0){
       my.showToast({
         content: '请先选择金额',
       })
       return;
    }
    //调起支付
    my.httpRequest({
      url: 'https://miaodaokeji.com/index.php/Home/Clock/wxpay',
      data: { shebei_id: shebei_id, shop_id: shop_id, openid: openid },
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        my.httpRequestPayment({
          timeStamp: res.data.info.timeStamp,
          nonceStr: res.data.info.nonceStr,
          package: res.data.info.package,
          signType: res.data.info.signType,
          paySign: res.data.info.paySign,
          success (res) {
            my.showToast({
              content: '支付成功',
            })
            //跳转启动设备页面
            my.redirectTo({
              url: '../Setmeal/index',
            })
          },
          fail (res) {
            my.showToast({
              content: '支付失败',
            })
          }
        })

      },
      fail (res) {
        console.log(res);
      }
    });

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