var progressNum = 0; //定义一个初始值0
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

function onBLEConnectionStateChange() { //监听设备连接状态
  if (app.globalData.onconnectedsta) {
    return;
  }
  app.globalData.onconnectedsta = true;
  my.onBLEConnectionStateChanged(function(res) {
    console.log("设备连接状态:", res);
    if (res.deviceId == app.globalData.deviceId) {
      if (res.connected) { //已连接
        app.globalData.connectedsta = true;
      } else {
        app.globalData.connectedsta = false; //连接已断开
      }
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneys: 0, //小时前
    dataMoney: 0, //一天的钱
    fontColorTowl: "#808080",
    borderOne: "#4482ff",
    borderTow: "#FFF",
    fontColorOne: "#FFF",
    fontColorTow: "#333333",
    fontColorTowy: "#4482ff",
    fontColorOneO: "#FFF",
    fontColorOnel: "#FFF",
    openlock: null,
    heinY: "none",
    go_type:null,
    orderid:null,
    locktm: null,
    addorder: false,
    fuwuphone: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    onBLEConnectionStateChange();
    this.setData({
      borderOne: "#05b1e4",
      borderOne: "#4482ff",
      fontColorOne: "#FFF",
      borderTow: "#FFF",
    });
    var dv_id = app.globalData.dv_id;
    var that = this;
    my.httpRequest({
      url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogram/get_appset',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      data: {
        dv_id: dv_id
      },
      success(res) {
        if (res.data.status == 1) {
          that.setData({
            moneys: parseFloat(res.data.info.hour).toFixed(2),
            dataMoney: parseFloat(res.data.info.day).toFixed(2),
            fuwuphone: res.data.fuwuphone
          })
        } else {
          my.showToast({
            content: res.data.info,
          })
        }
      },
      fail(res) {
        my.showToast({
          content: '网络错误,获取商品失败',
        })
      }
    })
  },
  hourTimemoney () {  //点击小时计算方法
    this.setData({
      borderOne: "#4482ff",
      fontColorOne: "#FFF",
      fontColorTow: "#333333",
      borderTow: "#FFF",
      fontColorOnel: "#FFF",
      fontColorTowl: "#808080", //2小字
      fontColorTowy: "#4482ff",
      fontColorOneO: "#FFF",
      go_type:1
    });
    var that = this;
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
        if (res.data.sta == 1 || res.data.sta == 4){   //可以开锁
            //等于1才可添加订单
            if(res.data.sta == 1){
                that.setData({
                  addorder:true
                })
            }
            if(res.data.sta == 4){
              that.setData({
                locktm: res.data.tm,
                orderid: res.data.orderid,
              })
            }
            my.closeBluetoothAdapter(); //关闭适配器 断开所有已建立的连接并释放系统资源
            my.openBluetoothAdapter({
              success(res){
                app.globalData.device_id = null;
                that.startBluetoothDevicesDiscovery();        //开始搜索并连接失败
                my.showLoading({
                  content: '开锁中',
                })
                var opent = setTimeout(function () {
                  if (!app.globalData.device_id) {
                    my.stopBluetoothDevicesDiscovery(); //停止搜索
                    my.hideLoading();
                    my.confirm({
                      title: '提示',
                      content: '没有找到设备',
                    })
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
          }else if(res.data.sta == 2){   //去充值
              var hour = that.data.moneys;        //每小时收费
              var day = that.data.dataMoney;        //每晚收费
              my.navigateTo({               
                url: '../deposit/index?hour=' + hour + '&day=' + day + '&go_type=1',
              })
           
          }else if(res.data.sta == 3){  //已有使用中的设备
            my.navigateTo({
              url: '../Mathtimer/index',
            })
          }else{
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
  dayTimemoney() { //点击晚计算方法
    this.setData({
      borderOne: "#FFF",
      fontColorOne: "#333333",
      borderTow: "#4482ff",
      fontColorTow: "#FFF",
      fontColorTowl: "#FFF", //2小字
      fontColorOnel: "#808080",
      fontColorOneO: "#4482ff",
      fontColorTowy: "#FFF",
      go_type: 2
    });

    var that = this;
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
          //等于1才可添加订单
          if (res.data.sta == 1) {
            that.setData({
              addorder: true
            })
          }
          if (res.data.sta == 4) {
            that.setData({
              locktm: res.data.tm,
              orderid: res.data.orderid,
            })
          }
          my.closeBluetoothAdapter(); //关闭适配器 断开所有已建立的连接并释放系统资源
          my.openBluetoothAdapter({
            success (res) {
              app.globalData.device_id = null;
              that.startBluetoothDevicesDiscovery();        //开始搜索并连接失败
              my.showLoading({
                content: '开锁中',
              })
              var opent = setTimeout(function () {
                if (!app.globalData.device_id) {
                  my.stopBluetoothDevicesDiscovery(); //停止搜索
                  my.hideLoading();
                  my.confirm({
                    title: '提示',
                    content: '没有找到设备',
                  })
                }

              }, 10000)
              that.setData({
                openlock: opent
              })
            },
            fail () {
              my.showToast({
                content: '请先打开蓝牙',
              })
              return;
            }
          })
        } else if (res.data.sta == 2) {   //去充值
          var hour = that.data.moneys;        //每小时收费
          var day = that.data.dataMoney;        //每晚收费
          my.navigateTo({
            url: '../deposit/index?hour=' + hour + '&day=' + day + '&go_type=2',
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
  personal() {    //个人中心
    my.navigateTo({
      url: '../personal/index',
    })
  },
  go_pay_top() {    //弹框取消按钮 旧
    this.setData({
      noneColor: "none"
    });
  },
  startBluetoothDevicesDiscovery() { //开始搜索设备
    my.startBluetoothDevicesDiscovery({
      services: ['0000FFF0-0000-1000-8000-00805F9B34FB'],
      allowDuplicatesKey: false,
      success: (res) => {
        this.onBluetoothDeviceFound()
      },
      fail(res) {
        //console.log(res);
      }
    })
  },
  onBluetoothDeviceFound() { //监听设备是否找到
    var that = this;
    my.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (device.name == app.globalData.dv_name || device.localName == app.globalData.dv_name) {
          my.stopBluetoothDevicesDiscovery(); //停止搜索
          app.globalData.device_id = device.deviceId;
          //setTimeout(function() {
            that.createBLEConnection(device.deviceId);
          //}, 500)

        }
      })
    })
  },
  createBLEConnection(deviceId) { //建立连接
    var that = this;
    my.createBLEConnection({
      deviceId: deviceId,
      success(res) {

        that.getBLEDeviceServices(deviceId);   //获取服务和特征
        //设备连接成功 首先获取电量
        setTimeout(function() {
          var str = '[VBAT]'; //电量
          that.writeBLECharacteristicValue(deviceId, str);
        }, 500)

        //开始添加订单
        if(that.data.addorder){
          setTimeout(function(){
            that.payshop();
          },1000)
        }else{  //直接开锁不用添加订单
          setTimeout(function () {
            var str = '[RELAY1=1]';
            that.writeBLECharacteristicValue(deviceId, str);
          }, 1000)
        }       

      },
      fail(res) {
        my.hideLoading();
        my.confirm({
          title: '提示',
          content: '设备连接失败,请重试',
        })
      }
    })
  },
  getBLEDeviceServices(deviceId) { //查找服务
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
  getBLEDeviceCharacteristics(deviceId, serviceId) { //查找特征值
    var that = this;
    my.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId,
      success(res) {
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
      console.log("返回的值:", buf2string(characteristic.value));
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
  writeBLECharacteristicValue(deviceId, str) { //写入数据
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
      success(res) {
        if (str == '[RELAY1=1]'){
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
      fail(res) {
        if (str == '[RELAY1=1]'){
          my.hideLoading();
          my.confirm({
            title: '提示',
            content: '开锁指令发送失败,请重试',
          })
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
  heinY() {
    this.setData({
      heinY: "none"
    })
  },
  payshop(){  //添加订单
    var that = this;
    var openid = app.globalData.openId;
    var dv_id = app.globalData.dv_id;
    var go_type = that.data.go_type;
    if(that.data.addorder){   //可以购买
      that.setData({
        addorder: false
      })
      //购买
      my.httpRequest({
        url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/addorder',
        data: { dv_id: dv_id, pay_type: go_type, openid: openid, hour: that.data.moneys, day: that.data.dataMoney },
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
    
  }

})