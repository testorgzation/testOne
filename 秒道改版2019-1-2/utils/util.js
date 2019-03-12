const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var app = getApp();
/******************蓝牙连接工具类*********************/
function con() {
  return app.globalData.dv_id;
}

//搜索设备
function startBluetoothDevicesDiscovery(){
  my.getBluetoothAdapterState({
    success (res) {
      if (res.available) {   //适配器可用
        if (!res.discovering){ //设备没有搜索
            //开始搜索设备
            my.startBluetoothDevicesDiscovery({
              success(res) {
                onBluetoothDeviceFound();
              },
            })
        }
      }
    },
    fail (res) {
      return false;
    }
  })
}

//停止搜索
function stopBluetoothDevicesDiscovery(){
  my.stopBluetoothDevicesDiscovery();
}

//监听设备搜索
function onBluetoothDeviceFound(){
  my.onBluetoothDeviceFound(function(res){
    res.devices.forEach(device => {
      if (device.deviceId == app.globalData.deviceId) { //设备的设备id
        app.globalData.issearch = true;
      }
    })
  })
}

//监测设备连接状态
function onBLEConnectionStateChange(){
  if (app.globalData.onconnectedsta){
      return;
  }
  app.globalData.onconnectedsta = true;
    my.onBLEConnectionStateChange(function(res){
        if(res.deviceId == app.globalData.deviceId){
            if(res.connected){ //已连接
              app.globalData.connectedsta = true;
            }else{
              app.globalData.connectedsta = false;  //连接已断开
            }
        }
    })
}

//检测适配器状态
function getBluetoothAdapterState(){
    my.getBluetoothAdapterState({
      success(res) {
          return 3;
      },
      fail(res){
        return 4;
      }
    })
}

//连接设备
function createBLEConnection(deviceId){
  var cn = app.globalData.connectedsta
  if (cn) {
    return true;
  }
  my.createBLEConnection({
    deviceId,
    success(res){   //连接成功 开启notify
       return true;
    },fail(){
      return false;
    }
  })
}

//发送命令
function writeBLECharacteristicValue(str){
  var buffer = new ArrayBuffer(str.length)
  var dataView = new Uint8Array(buffer)
  for (var i = 0; i < str.length; i++) {
    dataView[i] = str.charCodeAt(i)
  }
  var deviceId = app.globalData.deviceId;
  var serviceId = app.globalData.serviceId;
  var characteristicId = app.characteristicId;
  my.writeBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: serviceId,
    characteristicId: characteristicId,
    value: buffer,
    success(res) {
      return true;
    },
    fail(res){
      return false;
    }
  })
}




/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
// function formatTimeTwo(number, format) {

//   var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
//   var returnArr = [];

//   var date = new Date(number * 1000);
//   returnArr.push(date.getFullYear());
//   returnArr.push(formatNumber(date.getMonth() + 1));
//   returnArr.push(formatNumber(date.getDate()));

//   returnArr.push(formatNumber(date.getHours()));
//   returnArr.push(formatNumber(date.getMinutes()));
//   returnArr.push(formatNumber(date.getSeconds()));

//   for (var i in returnArr) {
//     format = format.replace(formateArr[i], returnArr[i]);
//   }
//   return format;
// }
export default {
  formatTime: formatTime,
  con:con,
  onBLEConnectionStateChange: onBLEConnectionStateChange,
  createBLEConnection: createBLEConnection,
  writeBLECharacteristicValue: writeBLECharacteristicValue,
  getBluetoothAdapterState:getBluetoothAdapterState,
  // formatTimeTwo: formatTimeTwo  // 时间戳转日期
}



