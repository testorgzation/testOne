// import time from '../../utils/util.js';
var app = getApp();
const addPreceedingZero = (t) => {
  return ('0' + Math.floor(t)).slice(-2);
}
function onBLEConnectionStateChange() {   //监听设备连接状态
  my.onBLEConnectionStateChanged(function (res) {
    console.log("设备连接状态:",res);
    if (res.deviceId == app.globalData.deviceId) {
      if (res.connected) { //已连接
        app.globalData.connectedsta = true;
      } else {
        app.globalData.connectedsta = false;  //连接已断开
      }
    }
  })
}

function buf2string(buffer) {
  var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
  var str = ''
  for (var i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i])
  }
  return str
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**新加**/
    isTiming: false,
    current: 0,
    minutes: '00',
    seconds: '00',
    millseconds: '00',
    times: [],
    openlock:null,
    onoff: true,
/**新加**/
    yingcneg: "none",
    y: 0,
    alsolock:"alsolock"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    clearTimeout();
    onBLEConnectionStateChange();  //监听连接状态
    var that = this;
    that.setData({
      current: parseInt(options.tm) ? parseInt(options.tm):0,
    })
    this.startTimer();
    
  },

  startOrPauseTimer () {
    this.pauseTimer();
  },

  pauseTimer () {
    const {
      timer,
    } = this.data;
    clearInterval(timer);
    this.setData({
      isTiming: false,
    });
  },


  startTimer () {
    const start = +new Date();
    const previous = this.data.current;
    const timer = this.data.timer;
    if (timer) {
      clearInterval(timer);
    }

    const t = setInterval(() => {
      const current = +new Date() - this.data.start + previous;
      this.setData({
        current: current,
        minutes: addPreceedingZero(current / 1000 / 60),
        seconds: addPreceedingZero(current / 1000 % 60),
        millseconds: addPreceedingZero(current % 1000 / 10),
      });
    }, 130);

    this.setData({
      start: start,
      timer: t,
      isTiming: true,
    });
  },
  startBluetoothDevicesDiscovery () {      //开始搜索设备
    my.startBluetoothDevicesDiscovery({
      services: ['0000FFF0-0000-1000-8000-00805F9B34FB'],
      allowDuplicatesKey: false,
      success: (res) => {
        this.onBluetoothDeviceFound()
      },
      fail (res) {
        console.log(res);
      }
    })
  },
  onBluetoothDeviceFound () {    //监听设备是否找到
    var that = this;
    my.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (device.name == app.globalData.dv_name || device.localName == app.globalData.dv_name) {
          console.log("找到设备");
          my.stopBluetoothDevicesDiscovery(); //停止搜索
          app.globalData.device_id = device.deviceId;
          //setTimeout(function () {
            that.createBLEConnection(device.deviceId);
          //}, 500)

        }
      })
    })
  },
  createBLEConnection (deviceId) {  //建立连接
    var that = this;
    my.createBLEConnection({
      deviceId: deviceId,
      success (res) {
        that.getBLEDeviceServices(deviceId);
        setTimeout(function () {
          var str = '[RELAY1=0]';  //关锁
          that.writeBLECharacteristicValue(deviceId, str);
        }, 1000)
      },
      fail (res) {
        clearTimeout(that.data.openlock);
        my.hideLoading();
        my.confirm({
          title: '提示',
          content: '设备连接失败,请重试',
        })
        that.setData({
          onoff: true
        })
      }
    })
  },
  getBLEDeviceServices (deviceId) {  //查找服务
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
  getBLEDeviceCharacteristics (deviceId, serviceId) {  //查找特征值
    var that = this;
    my.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId,
      success (res) {
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.uuid == app.globalData.characteristicId) {
            if (item.properties.notify || item.properties.indicate) {  //开启监听
              console.log("开启监听");
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
      var nf = buf2string(characteristic.value);
      if (nf == '[RELAY1=0:OK]') {
        this.gxorde();
      } else if (nf == '[ERR_GEAR]'){
        clearTimeout(that.data.openlock);
        my.hideLoading();
        my.confirm({
          title: '提示',
          content: '还锁失败，请检查锁扣是否有异物阻隔',
         
        })
        that.setData({
          onoff: true
          
        })
      } else {
        clearTimeout(that.data.openlock);
        my.hideLoading();
        my.confirm({
          title: '提示',
          content: '还锁失败，请关紧柜门后点击还锁',
        })
        that.setData({
          onoff: true
        })
      }

    })
  },
  writeBLECharacteristicValue (deviceId, str) {   //写入数据
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
        console.log("发送成功1", res);
      }, fail (res) {
        clearTimeout(that.data.openlock);
        my.hideLoading();
        my.confirm({
          title: '提示',
          content: '关锁失败,请重试',
        })
        that.setData({
          onoff: true
        }) 
      }
    })
  },
  //还锁
  alsolock(){
    var that = this;
    if (that.data.onoff) {
      that.setData({
        onoff: false
      })
      //检测当前设备是否已经被还锁
      my.httpRequest({
        url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogram/checkdevicet',
        data: { dv_id: app.globalData.dv_id },
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res) {
          if (res.data.sta == 1) {
            
            my.closeBluetoothAdapter();
            my.openBluetoothAdapter({  //初始化适配器
              success (res) {
                app.globalData.device_id = null;
                app.globalData.characteristicvalue = null;
                that.startBluetoothDevicesDiscovery();
                my.showLoading({
                  content: '还锁中',
                })
                var opent = setTimeout(function () {
                  if (!app.globalData.device_id) {
                    my.stopBluetoothDevicesDiscovery(); //停止搜索
                    that.setData({
                      onoff: true
                    })
                    my.hideLoading();
                    my.confirm({
                      title: '提示',
                      content: '没有找到设备,请重试',
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
                that.setData({
                  onoff: true
                })
                return;
              }
            })
          } else {
            my.showToast({
              content: res.data.msg,
              type: 'none',
              duration: 1200
            })
          }
        }
      })
    }
      

  },
  personal () {
    my.navigateTo({
      url: '../personal/index',
    })
  },
  gxorde(){
    var that = this;
    //更新订单
    my.httpRequest({
      url: 'https://miaodaokeji.com/miaodao.php/Mdminiprogramt/alsolock',
      data: { dv_id: app.globalData.dv_id, openid: app.globalData.openId },
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        my.hideLoading();
        console.log(res);
        if (res.data.status == 1) {
          my.showToast({
            content: '关锁成功',
          })
          my.disconnectBLEDevice({
            deviceId: app.globalData.device_id,
          })
          setTimeout(function () {
            my.closeBluetoothAdapter();
          }, 500)
          clearTimeout(that.data.openlock);
          this.innerAudioContext = my.createInnerAudioContext()
          this.innerAudioContext.src = "https://www.miaodaokeji.com/Public/images/mdclose.mp3";
          this.innerAudioContext.obeyMuteSwitch = false;
          this.innerAudioContext.play()
          my.redirectTo({
            url: '../locksuc/index?money=' + res.data.money + '&tmlen=' + res.data.tmlen + '&tuinum=' + res.data.tuinum + '&paytype=' + res.data.paytype,
          })
          
        } else {
          my.confirm({
            title: '提示',
            content: res.data.info,
          })
        }
      },
      fail: (res) => {
        console.log("更新订单失败");
      }
    })
  },
  btnclick() {
    var j = this.data.y
    j++;
    this.setData({
      y: j
    })
  },
  fault(){  //设备故障
    my.navigateTo({
      url: '../TroubleCode/index', 
    })
  },
  //拨打电话
  pledge (e) {
    my.makePhoneCall({
      number: '400-100-6186'
    })
  },
 
})
