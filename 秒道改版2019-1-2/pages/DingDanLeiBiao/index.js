//index.js
//获取应用实例
var app = getApp();
import register from '../../utils/refreshLoadRegister.js';
Page({
  data: {
    currentSize: 0,
    words: []
  },
  onLoad () {
    var _this = this;
    register.register(this);
    //获取words  
    this.doLoadData(0, 10);
  },
  doLoadData(currendSize, PAGE_SIZE) {
    my.showLoading({
      content: 'loading...',
    });
    var that = this;
    //计算页码
    var p = currendSize/10;
    var dv_id = app.globalData.dv_id;  //设备id
    var openid = app.globalData.openId; //用户openid
    my.httpRequest({
      url: 'https://www.miaodaokeji.com/miaodao.php/Mdminiprogramt/orderlist',
      headers:{
        'content-type': 'application/x-www-form-urlencoded' 
      },
      method:'post',
      data:{dv_id:dv_id,p:p,openid:openid},
      success(res){
        console.log(res)
          if(res.data.status == 1){  //成功
            if (res.data.msg == ""){
                my.hideLoading();
                register.loadFinish(that, false, "没有更多了");
              }else{
                var content = res.data.msg;
                for (var i = 0; i < res.data.num; i++) {
                  that.data.words.push(content[i]);
                }
                var words = that.data.words;
                that.data.currentSize += res.data.num;
                that.setData({
                  words: words
                });
                my.hideLoading();
                register.loadFinish(that, true);
              }
          }else{
             my.hideLoading();
            register.loadFinish(that, false,"查询失败");
          }
      },
      fail(res){
        my.hideLoading();
        register.loadFinish(that, false,"请求失败,请检查网络");
      }
    })
  },
  //模拟刷新数据
  refresh () {

    this.setData({
      words: [],
      currentSize: 0
    });
    this.doLoadData(0, 10);
  },
  //模拟加载更多数据
  loadMore () {
    this.doLoadData(this.data.currentSize, 10);
  }
})
