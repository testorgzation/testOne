var app = getApp();
function buf2string(buffer) {
  var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
  var str = ''
  for (var i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i])
  }
  return str
}

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yjnum: 0,
    buttname: "立即支付",
    buttap: "wxpay",
    addorder: false,
    heinY:"none",
    openlock:null,
    locktm: null,
    orderid: null,
    fuwuphone: null,
    hour:null,
    day:null,
    go_type:null,
    locknum:null,  //开锁次数
    buttontapnum: 0,

    
    colorFont:"#FFF",//免押金
    colorFontpay:"#000",//支付押金
    bacColor:"#4681ff",//免押金
    payBacColor:"#FFF",//支付押金
    borderColor:"#4681ff",//免押金
    borderColorpay:"#d6d6d6",//支付押金
    Distinguish:"1"//区分免押金还是不免押金1免押金，2不免押金
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    var that = this;
    var go_type = options.go_type;         //购买类型
    var hour = options.hour;        //每小时收费
    var day = options.day;        //每晚收费
    that.setData({
      go_type:go_type,
      hour:hour,
      day:day
    })
    //押金金額
    var dv_id = app.globalData.dv_id;
    my.httpRequest({
      url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogram/getzfj',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      data: { dv_id: dv_id },
      success (res) {
        if (res.data.status == 1) {
          that.setData({
            yjnum: parseFloat(res.data.info.advance).toFixed(2),
            fuwuphone: res.data.fuwuphone
          })
        } else {
          my.showToast({
            content: res.data.info,
          })
        }
      },
      fail (res) {
        my.showToast({
          content: '网络错误,获取信息失败',
        })
      }
    })
  },
 controlColor1(){
    //控制免押金样式
    var that=this;
    that.setData({
            colorFont:"#FFF",
            colorFontpay:"#000",
            bacColor:"#4681ff",
            payBacColor:"#FFF",
            borderColor:"#4681ff",
            borderColorpay:"#d6d6d6",
            Distinguish:"1"
    })
  },
   controlColor2(){
    //控制不免押金样式
    var that=this;

    that.setData({
            colorFont:"#000",
            colorFontpay:"#FFF",
            bacColor:"#FFF",
            payBacColor:"#4681ff",
            borderColor:"#d6d6d6",
            borderColorpay:"#4681ff",
            Distinguish:"2"
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
    
  },
  //押金
  wxpay (event) {
    var that = this;
    my.closeBluetoothAdapter();
    my.openBluetoothAdapter({
      success(res) {
        setTimeout(function(){
          my.getBluetoothAdapterState({
            success (res) {
              if(res.available){   //蓝牙适配器可用
                
                my.showLoading();
                that.setData({
                  buttontapnum: that.data.buttontapnum + 1
                })
                if (that.data.buttontapnum == 1) {
                  var shebei_id = app.globalData.dv_id;
                  var openid = app.globalData.openId;
                  //调起支付
                  my.httpRequest({
                    url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/cash_pledge',
                    data: { dv_id: shebei_id, openid: openid },
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
                          //检测用户余额
                          my.httpRequest({
                            url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/checkbalance',
                            headers: {
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            method: 'post',
                            data: {
                              dv_id: app.globalData.dv_id,
                              openid: app.globalData.openId
                            },
                            success (res) {
                              if (res.data.sta == 1 || res.data.sta == 4) {   //可以开锁
                                that.setData({
                                  addorder: true
                                })
                                //开锁
                                that.uplock();
                              } else if (res.data.sta == 2) {   //去充值
                                my.showToast({
                                  content: "余额不足",
                                })
                              } else if (res.data.sta == 3) {  //已有使用中的设备
                                my.navigateTo({
                                  url: '../Mathtimer/index',
                                })
                              } else {
                                my.showToast({
                                  content: res.data.msg,
                                })
                              }
                            },
                            fail (res) {
                              my.showToast({
                                content: '网络连接失败,请稍候再试',
                              })
                            }
                          })
                        },
                        fail (res) {                        
                          my.showToast({
                            content: '支付失败',
                          })
                          that.setData({
                            buttontapnum: 0
                          })
                        }
                      })
                    },
                    fail (res) {
                      my.showToast({
                        content: '支付失败',
                      })
                      that.setData({
                        buttontapnum: 0
                      })
                    }
                  });
                }
              }else{
                my.showToast({
                  content: '蓝牙不可用',
                })
              }
            },
          })
        },500)       
      },
      fail(res){
        my.showToast({
          content: '请先打开蓝牙',
        })
      }
    })
   
  
  },
  startBluetoothDevicesDiscovery () { //开始搜索设备
    my.startBluetoothDevicesDiscovery({
      services: ['0000FFF0-0000-1000-8000-00805F9B34FB'],
      allowDuplicatesKey: false,
      success: (res) => {
        this.onBluetoothDeviceFound()
      },
      fail (res) {
        
      }
    })
  },
  onBluetoothDeviceFound () { //监听设备是否找到
    var that = this;
    my.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (device.name == app.globalData.dv_name || device.localName == app.globalData.dv_name) {
          my.stopBluetoothDevicesDiscovery(); //停止搜索
          app.globalData.device_id = device.deviceId;
          //setTimeout(function () {
            that.createBLEConnection(device.deviceId);
          //}, 500)

        }
      })
    })
  },
  createBLEConnection (deviceId) { //建立连接
    var that = this;
    my.createBLEConnection({
      deviceId: deviceId,
      success (res) {

        that.getBLEDeviceServices(deviceId);   //获取服务和特征
        //设备连接成功 首先获取电量
        setTimeout(function () {
          var str = '[VBAT]'; //电量
          that.writeBLECharacteristicValue(deviceId, str);
        }, 500)

        //开始添加订单
        if (that.data.addorder) {
           setTimeout(function(){
             that.payshop();
          },1000)

        } else {  //直接开锁不用添加订单
          setTimeout(function () {
            var str = '[RELAY1=1]';
            that.writeBLECharacteristicValue(deviceId, str);
          }, 1000)
        }

      },
      fail (res) {
        my.hideLoading();
        that.setData({
          buttname: "重新开锁",
          buttap: "uplock",
          locknum: that.data.locknum + 1
        })
        if(that.data.locknum > 2){
            my.confirm({
              title: '提醒',
              content: '连接超时,请稍候再试,也可以前往会员中心退款',
              success(res){
                  if(res.confirm){
                      //前往退款
                      my.navigateTo({
                        url: '../personal/index',
                      })
                  }
              }
            })
        }else{
          my.confirm({
            title: '提示',
            content: '设备连接失败,请重试',
          })
        }
        
        //清除提示
        clearTimeout(that.data.openlock);
      }
    })
  },
  getBLEDeviceServices (deviceId) { //查找服务
    my.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].uuid == app.globalData.serviceId) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics (deviceId, serviceId) { //查找特征值
    var that = this;
    my.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId,
      success (res) {
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.uuid == app.globalData.characteristicId) {
            if (item.properties.notify || item.properties.indicate) { //开启监听
              my.notifyBLECharacteristicValueChange({
                deviceId,
                serviceId,
                characteristicId: item.uuid,
                state: true,
              })
            }
          }
        }
      },
    })
    my.onBLECharacteristicValueChange((characteristic) => {

      app.globalData.characteristicvalue = buf2string(characteristic.value);
      //console.log("返回的值:", buf2string(characteristic.value));
      var kwh = buf2string(characteristic.value);
      var vbat = kwh.substring(1, 5);
      if (vbat == 'VBAT') { //更新电量
        my.httpRequest({
          url: 'https://miaodaokeji.com/index.php/Home/Kclockp/kwh',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          data: {
            kwh: kwh,
            dv_id: app.globalData.dv_id
          },
        })
      }
      //更新开锁反馈
      if (kwh == '[RELAY1=1:OK]') {
        my.httpRequest({
          url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogram/orderback',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          data: { orderid: that.data.orderid },
        })
      }

    })
  },
  writeBLECharacteristicValue (deviceId, str) { //写入数据
    var that = this;
    var buffer = new ArrayBuffer(str.length)
    var dataView = new Uint8Array(buffer)
    for (var i = 0; i < str.length; i++) {
      dataView[i] = str.charCodeAt(i)
    }
    my.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: app.globalData.serviceId,
      characteristicId: app.globalData.characteristicId,
      value: buffer,
      success (res) {
        if (str == '[RELAY1=1]') {
          //更新订单发送的命令
          my.httpRequest({
            url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogram/uporder',
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            data: { orderid: that.data.orderid },
          })
          //断开与设备的连接
          setTimeout(function () {
            my.disconnectBLEDevice({
              deviceId: app.globalData.device_id,
            })
          }, 1000)
          //播放语音并跳转关锁页面
          that.innerAudioContext = my.createInnerAudioContext()
          if (app.globalData.openaudio) {
            that.innerAudioContext.src = app.globalData.openaudio;
          } else {
            that.innerAudioContext.src = "https://www.miaodaokeji.com/Public/images/mdopen.mp3";
          }
          that.innerAudioContext.obeyMuteSwitch = false;
          that.innerAudioContext.play()
          clearTimeout(that.data.openlock);
          my.redirectTo({
            url: '../Mathtimer/index?tm=' + that.data.locktm,
          })
        }
      },
      fail (res) {
        if (str == '[RELAY1=1]') {
          my.hideLoading();
          that.setData({
            buttname: "重新开锁",
            buttap: "uplock",
            locknum: that.data.locknum + 1
          })
          if (that.data.locknum > 2) {
            my.confirm({
              title: '提醒',
              content: '连接超时,请稍候再试,也可以前往会员中心退款',
              success (res) {
                if (res.confirm) {
                  //前往退款
                  my.navigateTo({
                    url: '../personal/index',
                  })
                }
              }
            })
          }else{
            my.confirm({
              title: '提示',
              content: '开锁指令发送失败,请重试',
            })
          }
          //清除弹窗
          clearTimeout(that.data.openlock);
          //断开连接
          setTimeout(function () {
            my.disconnectBLEDevice({
              deviceId: app.globalData.device_id,
            })
          }, 500)
          
        }
      }
    })
  },
  heinY () {
    this.setData({
      heinY: "none"
    })
  },
  payshop () {  //添加订单
    var that = this;
    var openid = app.globalData.openId;
    var dv_id = app.globalData.dv_id;
    var go_type = that.data.go_type;
    if(that.data.addorder){
      that.setData({
        addorder: false
      })
      //购买
      my.httpRequest({
        url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/addorder',
        data: { dv_id: dv_id, pay_type: go_type, openid: openid, hour: that.data.hour, day: that.data.day },
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          var oneres = res;
          if (res.data.sta == 0) {
            my.showToast({
              content: res.data.msg,
            })
            that.setData({
              addorder: true
            })
          } else if (res.data.sta == 1) {   //购买成功
            //保存信息
            that.setData({
              locktm: oneres.data.tm,
              orderid: oneres.data.orderid,
            })
            //开锁
            var str = '[RELAY1=1]';
            that.writeBLECharacteristicValue(app.globalData.device_id, str);
          }
        },
        fail (res) {
          my.showToast({
            content: '购买失败',
          })
        }
      })
    }
    
  },
  uplock(){   //开锁
    var that = this;  
    my.closeBluetoothAdapter(); //关闭适配器 断开所有已建立的连接并释放系统资源
    my.openBluetoothAdapter({
      success(res) {
        app.globalData.device_id = null;
        that.startBluetoothDevicesDiscovery();
        my.showLoading({
          content: '开锁中',
        })
        var opent = setTimeout(function () {
          if (!app.globalData.device_id) {
            my.hideLoading();
            //更新按钮状态 从新开锁
            that.setData({
              buttname: "重新开锁",
              buttap: "uplock",
              locknum: that.data.locknum + 1
            })
            if (that.data.locknum > 2) {
              my.confirm({
                title: '提醒',
                content: '连接超时,请稍候再试,也可以前往会员中心退款',
                success (res) {
                  if (res.confirm) {
                    //前往退款
                    my.navigateTo({
                      url: '../personal/index',
                    })
                  }
                }
              })
            }else{
              that.setData({
                heinY: "block"
              })
            }
            my.stopBluetoothDevicesDiscovery(); //停止搜索
            
          }
        }, 10000)
        that.setData({
          openlock: opent
        })
      },
      fail(){
        my.showToast({
          content: '请先打开蓝牙',
        })
        return;
      }
    })
  }
})