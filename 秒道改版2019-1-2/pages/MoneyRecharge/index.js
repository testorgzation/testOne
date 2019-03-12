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
    //设备商品列表
    my.httpRequest({
      url: 'https://miaodaokeji.com/index.php/Home/Clock/get_shopes',
      data: { shebei_id: app.globalData.dv_id },
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        this.setData({
          list: res.data.info,
        });
      },

    });

  },
  //点击商品发起支付
  wxpay (event) {
    var shop_id = event.currentTarget.dataset.shop_id;
    var shebei_id = app.globalData.dv_id;
    var openid = app.globalData.openId;

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
          fail(res){
            my.showToast({
              content: '支付失败',
            })
          }
        })

      },
      fail(res){
        console.log(res);
      }
    });

  },
  bindpurchase () {
    my.navigateTo({

      url: '../Setmeal/index'
    })
  },
})