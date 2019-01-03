                                                                                                                                          // 定义数据格式
const API=require('../../utils/api.js')
const app = getApp()

/***
 * 
 * "wxSearchData":{
 *  configconfig:{
 *    style: "wxSearchNormal"
 *  },
 *  view:{
 *    hidden: true,
 *    searchbarHeght: 20
 *  }
 *  keys:[],//自定义热门搜索
 *  his:[]//历史搜索关键字
 *  value
 * }
 * 
 * 
 */
var __keysColor = [];

var __mindKeys = [];

function initColors(colors) {
    __keysColor = colors;
}

function initMindKeys(keys) {
    __mindKeys = keys;
}


function init(self, barHeight, keys, isShowKey, isShowHis, callBack) {
    //  console.log(self.data)
    let temData = {};
    let view = {
        barHeight: barHeight
    }

    if (typeof(isShowKey) == 'undefined') {
        view.isShowSearchKey = true;
    } else {
        view.isShowSearchKey = isShowKey;
    }

    if (typeof(isShowHis) == 'undefined') {
        view.isShowSearchHistory = true;
    } else {
        view.isShowSearchHistory = isShowHis;
    }
       temData.keys = keys;
            wx.getSystemInfo({
                success: function(res) {
                    var wHeight = res.windowHeight;
                    view.seachHeight = wHeight - barHeight;
                    temData.view = view;

                    self.setData({
                        wxSearchData: temData
                    });
                }
            })
            if (typeof(callBack) == "function") {
                callBack();
            }
            getHisKeys(self);
}

function wxSearchInput(e, self, callBack) {
    var temData = self.data.wxSearchData;
    var text = e.detail.value;
    var mindKeys = [];
    if (typeof(text) == "undefined" || text.length == 0) {

    } else {
        for (var i = 0; i < __mindKeys.length; i++) {
            var mindKey = __mindKeys[i];
            if (mindKey.indexOf(text) > -1) {
                mindKeys.push(mindKey);
            }
        }
    }
    temData.value = text;
    temData.mindKeys = mindKeys.slice(0,37);
    self.setData({
        wxSearchData: temData
    });
    if(temData.mindKeys.length==0){
        self.setData({
            notFound: true,
            inputValues:temData.value
        })
    }else{
         self.setData({
            notFound: false,
            inputValues:temData.value
        })
    }
}

function wxSearchFocus(e, self, callBack) {
    var temData = self.data.wxSearchData;
    // temData.view.isShow = true;
    self.setData({
        wxSearchData: temData
    });
    //回调
    if (typeof(callBack) == "function") {
        callBack();
    }
}

function wxSearchBlur(e, self, callBack) {
    var temData = self.data.wxSearchData;
    temData.value = e.detail.value;
    self.setData({
        wxSearchData: temData
    });
    if (typeof(callBack) == "function") {
        callBack();
    }
}

function wxSearchHiddenPancel(self) {
    var temData = self.data.wxSearchData;
    // temData.view.isShow = true;
    self.setData({
        wxSearchData: temData
    });
}
// 点击搜索历史
function wxSearchKeyTap(e, self, callBack) {
    //回调
    var temData = self.data.wxSearchData;
    var mindKeys = temData.mindKeys;
    temData.value = e.target.dataset.key;
    var value = wx.getStorageSync('wxSearchHisKeys');
    var text = temData.value;
    setStorages(self, text);
     app.globalData.searchKey = text
        console.log(app.globalData.searchKey)
    if (typeof(callBack) == "function") {
        console.log("run callBack")
        callBack();
    }
    wx.reLaunch({
        url: '../../find/find'
    })
    console.log(temData);

}

function callBack(value) {
    console.log(value);
}

function getHisKeys(self) {
    var value = [];
    try {
        value = wx.getStorageSync('wxSearchHisKeys')
        if (value) {
            // Do something with return value
            var temData = self.data.wxSearchData;
            temData.his = value;
            self.setData({
                wxSearchData: temData
            });
        }
    } catch (e) {
        // Do something when catch error
    }

}
// 输入框回车
function wxSearchAddHisKey(self) {
    // wxSearchHiddenPancel(that);
    var text = self.data.wxSearchData.value;
    if (typeof(text) == "undefined" || text.length == 0) {
        return;
    }
    setStorages(self, text);
     app.globalData.searchKey = text
        console.log(app.globalData.searchKey)
    wx.reLaunch({
        url: '../../find/find',
    })
}

function setStorages(self, text) {
    var value = wx.getStorageSync('wxSearchHisKeys');
    if (value) {
        //value不为空
        if (value.indexOf(text) < 0) {
            //text值在value中本身不存在，将text存入value
            value.unshift(text);
        }
        wx.setStorage({
            key: "wxSearchHisKeys",
            data: value,
            success: function() {
                getHisKeys(self);
            }
        })
    } else {
        //value
        value = [];
        value.unshift(text);
        wx.setStorage({
            key: "wxSearchHisKeys",
            data: value,
            success: function() {
                getHisKeys(self);
            }
        })
    }

}


function wxSearchDeleteAll(self) {
    wx.showModal({
        title: '清除历史搜索',
        content: '确定删除全部的历史搜索？',
        confirmColor: '#F45C43',
        success: function(res) {
            if (res.confirm) {
                wx.removeStorage({
                    // success
                    key: 'wxSearchHisKeys',
                    success: function(res) {
                        var value = [];
                        var temData = self.data.wxSearchData;
                        temData.his = value;
                        self.setData({
                            wxSearchData: temData,
                        });
                    }
                })
                self.setData({
                    show: false //设置历史数据隐藏
                })
            }
        }
    })
}



module.exports = {
    init: init,
    initColors: initColors,
    initMindKeys: initMindKeys,
    wxSearchInput: wxSearchInput,
    wxSearchFocus: wxSearchFocus,
    wxSearchBlur: wxSearchBlur,
    wxSearchKeyTap: wxSearchKeyTap,
    wxSearchAddHisKey: wxSearchAddHisKey,
    wxSearchDeleteAll: wxSearchDeleteAll,
    wxSearchHiddenPancel: wxSearchHiddenPancel
}