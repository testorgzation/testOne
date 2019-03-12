// import time from '../../utils/util.js';
var app = getApp();
function onBLEConnectionStateChange() {   //监听设备连接状态
  console.log("执行");
  if (app.globalData.onconnectedsta) {
    return;
  }
  app.globalData.onconnectedsta = true;
  my.onBLEConnectionStateChange(function (res) {
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

//开始搜索设备
function startBluetoothDevicesDiscovery() {
  console.log("开启搜索");
  //my.stopBluetoothDevicesDiscovery({}); //先停止
  setTimeout(function () {
    my.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        onBluetoothDeviceFound()
      },
      fail (res) {
        console.log(res);
      }
    })
  }, 2000)

}

//监听设备是否找到
function onBluetoothDeviceFound() {
  my.onBluetoothDeviceFound((res) => {
    console.log("设备列表",res);
    res.devices.forEach(device => {
      console.log("设备相关信息:", device.name, device.deviceId);
      // console.log("制造厂商信息:",ab2hex(device.advertisData));  //设备全部信息
      console.log( 'localname:', device.localName);
      //getBLEDeviceServicest(device.deviceId);
      if (device.name == 'Lock001831E51CA6' || device.localName == 'Lock001831E51CA6') {
        my.stopBluetoothDevicesDiscovery();
        console.log("找到设备");
        app.globalData.device_id = device.deviceId;
        createBLEConnection(device.deviceId,'[RELAY1=0]');
        // this.setData({
        //   device_id: device.deviceId
        // })
      }
    })
  })
}



function createBLEConnection(deviceId, str) {  //建立连接
  my.createBLEConnection({
    deviceId: deviceId,
    success (res) {
      getBLEDeviceServices(deviceId, str);
    },
    fail(res){
       console.log("连接失败:",res);
    }
  })
}

function getBLEDeviceServices(deviceId, str) {  //查找服务
  my.getBLEDeviceServices({
    deviceId,
    success: (res) => {
      for (let i = 0; i < res.services.length; i++) {
        if (res.services[i].uuid == app.globalData.serviceId) {
          setTimeout(function(){
            getBLEDeviceCharacteristics(deviceId, res.services[i].uuid, str)
          },3000)
          
        }
      }
    }
  })
}

function getBLEDeviceCharacteristics(deviceId, serviceId, str) {  //查找特征值
  my.getBLEDeviceCharacteristics({
    deviceId: deviceId,
    serviceId: serviceId,
    success (res) {
      console.log("蓝牙特征:",res);
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
              success(res){
                my.onBLECharacteristicValueChange((characteristic) => {

                  console.log("监听返回值");
                  app.globalData.characteristicvalue = buf2string(characteristic.value);
                  console.log("返回值:", buf2string(characteristic.value));

                })
                writeBLECharacteristicValue(deviceId, str)
              }
            })
          }
          // if (item.properties.write) {
          //   writeBLECharacteristicValue(deviceId,str)
          // }
          app.globalData.connectedsta = true;
        }
      }
    },
  })
  
  
}

function writeBLECharacteristicValue(deviceId,str) {   //写入数据
  //[RELAY1=1]
  //[VBAT]
  // [RELAY1=0]
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
      app.globalData.alsolock = true;
      console.log("发送成功1");
    }, fail (res) {
      console.log("发送失败");
      console.log(res);
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countdown: ''
    , endDate2: '2018/11/1 17:50:00',
    yingcneg: "none",
    y: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // onBLEConnectionStateChange();  //监听连接状态
    // var that = this;
    // console.log("时间");
    // console.log(options);
    // that.setData({
    //   endDate2: options.tm
    // })
    // console.log("平台存储设备信息:",app.globalData.dv_id, app.globalData.dv_name);
//     var timer=time.formatTimeTwo(options,'Y/M/D h:m:s')
// console.log(timer)
    // that.countTime()
  },
  
  countTime() {
    var that = this;
    var date = new Date();
    var now = date.getTime();
    var endDate = new Date(that.data.endDate2);//设置截止时间
    var end = endDate.getTime();
    var leftTime = now - end; //时间差                              
    var d, h, m, s, ms;
    if (leftTime < 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
      ms = Math.floor(leftTime % 100);
      ms = ms < 100 ? "0" - ms : ms
      s = s < 10 ? "0" - s : s
      m = m < 10 ? "0" - m : m
      h = h < 10 ? "0" - h : h
      that.setData({
        countdown: h - 1 + "：" + m + "：" + s + ":" + ms,
      })
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(that.countTime, 100);
    } else {
      console.log('已截止')
      that.setData({
        countdown: '00:00:00'
      })
    }

  },
  //还锁
  alsolock(){
   

    if (this.data.y > 0 && this.data.y % 2 !== 0) {

      this.setData({
        yingcneg: "block",
      })


    } else {
      this.setData({
        yingcneg: "none",
      })


      var that = this;
      // my.closeBluetoothAdapter();
      my.openBluetoothAdapter({  //初始化适配器
        success (res) {
          app.globalData.alsolock = false;
          startBluetoothDevicesDiscovery();
          // my.showLoading({
          //   title: '还锁中',
          // })
          // setTimeout(function () {
          //   my.stopBluetoothDevicesDiscovery({})
          //   my.hideLoading();
          //   console.log("设备id",app.globalData.device_id);
          //   if (app.globalData.device_id) {
          //     var str = '[RELAY1=0]';
          //     createBLEConnection(app.globalData.device_id, str);
          //     setTimeout(function () {
          //       console.log("命令反馈start");
          //       console.log(app.globalData.characteristicvalue);
          //       console.log("命令反馈end");
          //       if (app.globalData.characteristicvalue == '[RELAY1=0:OK]') {
          //         that.gxorde();
          //       } else {
          //         my.confirm({
          //           title: '提示',
          //           content: '还锁失败,请手动关闭柜门再试',
          //         })
          //       }
          //     }, 2000)

          //   } else {
          //     my.confirm({
          //       title: '提示',
          //       content: '还锁失败1',
          //     })
          //     my.hideLoading();
          //   }
          // }, 5000)
        },
        fail () {
          my.showToast({
            content: '请先打开蓝牙',
          })
          return;
        }
      })
     
    // }

    // my.showLoading({
    //   title: '关闭中',
    // })
    // setTimeout(function(){
    //   if (app.globalData.alsolock){
    //     my.disconnectBLEDevice({ deviceId: app.globalData.deviceId })  //关闭连接
    //     my.closeBluetoothAdapter({})  //关闭蓝牙模块

    //   }else{
    //     my.hideLoading();
    //     my.confirm({
    //       title: '提示',
    //       content: '请勿离开设备太远,连接失败',
    //     })
    //   }
    // },5000)

    }

  },
  personal () {
    my.navigateTo({
      url: '../personal/index',
    })
  },
  gxorde(){
    //更新订单
    my.httpRequest({
      url: 'https://miaodaokeji.com/index.php/Home/Clock/repay',
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
          my.redirectTo({
            url: '../locksuc/index',
          })
          // my.confirm({
          //   title: '提示',
          //   content: '关闭成功',
          // })
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
 
})
