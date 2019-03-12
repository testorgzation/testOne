var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alls:null,
    all1: null,
    all2: null,
    all3: null,
    all4: null,
    txts:"",
    list:[],
    num:""
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
  ColorStyle(e){

    var mid = e.target.id;
    var name = e.target.dataset.userName;
    if (this.data.alls==true){
      var temp = this.data.list;
        for(var x in temp){
          if(mid == temp[x].id){
            this.data.list.splice(x,1);
          }
        }
        this.setData({
          alls:false
        })
    }else{
        this.setData({
          alls: true
        })
        this.data.list.push({id:mid,name:name});
    }
  },
  ColorStyle1 (e) {
  var mid = e.target.id;
    var name = e.target.dataset.userName;
    if (this.data.all1 == true) {
      var temp = this.data.list;
      for (var x in temp) {
        if (mid == temp[x].id) {
          this.data.list.splice(x, 1);
        }
      }
      this.setData({
        all1: false
      })
    } else {
      this.setData({
        all1: true
      })
      this.data.list.push({ id: mid, name: name });
    }
  },
  ColorStyle2 (e) {
  var mid = e.target.id;
    var name = e.target.dataset.userName;
    if (this.data.all2 == true) {
      var temp = this.data.list;
      for (var x in temp) {
        if (mid == temp[x].id) {
          this.data.list.splice(x, 1);
        }
      }
      this.setData({
        all2: false
      })
    } else {
      this.setData({
        all2: true
      })
      this.data.list.push({ id: mid, name: name });
    }
  },
  ColorStyle3 (e) {
  var mid = e.target.id;
    var name = e.target.dataset.userName;
    if (this.data.all3 == true) {
      var temp = this.data.list;
      for (var x in temp) {
        if (mid == temp[x].id) {
          this.data.list.splice(x, 1);
        }
      }
      this.setData({
        all3: false
      })
    } else {
      this.setData({
        all3: true
      })
      this.data.list.push({ id: mid, name: name });
    }
  },
  ColorStyle4 (e) {
    var mid = e.target.id;
    var name = e.target.dataset.userName;
    if (this.data.all4 == true) {
      var temp = this.data.list;
      for (var x in temp) {
        if (mid == temp[x].id) {
          this.data.list.splice(x, 1);
        }
      }
      this.setData({
        all4: false
      })
    } else {
      this.setData({
        all4: true
      })
      this.data.list.push({ id: mid, name: name });
    }
  },
  bindTextAreaChange(e){
    var value = e.detail.value;
    this.setData({
      txts:value
    })
  },
  num(e){
    var value = e.detail.value;
    this.setData({
      num:value
    })
  },
  bindSubmit(){
    var that = this;
    var temp = that.data.list;
    var an = '';   //故障按钮点击的
    for (var x in temp){
      an+=temp[x].name+'|';
    }
    var devicenum = that.data.num;
    var txts = that.data.txts;
    var dv_id = app.globalData.dv_id;
    var openid = app.globalData.openId;
    my.httpRequest({
      url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/fault',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      data: { an: an, devicenum: devicenum, txts: txts, dv_id: dv_id, openid: openid},
      success(res){
          if(res.data.sta == 1){
            my.confirm({
              title: '提示',
              content: res.data.msg
            })
            my.navigateBack({
              delta:1
            })
          }else{
            my.confirm({
              title: '提示',
              content: res.data.msg
            })
          }
      },
      fail(){
        my.confirm({
          title: '提示',
          content: '提交失败',
        })
      }
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