const API = require('/api.js')
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

const formatPhone = n => {
    var phoneText = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0-9])\d{8}$/;
    if (phoneText.test(n)) {
        return n;
    } else {
        return false;
    }
}

var removeHTMLTag = function(str) {
    if (str) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        // str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
        // str = str.replace(/&nbsp;/g, ''); //去掉&nbsp;
        return str;
    }
}
var delayed30s = function(access_token, refresh_token, expires_in) {
    var date = new Date();
    var dt = date.getTime() + (expires_in - 30) * 1000;
    wx.setStorageSync('access_token', access_token);
    wx.setStorageSync('refresh_token', refresh_token);
    wx.setStorageSync('expires_in', dt);
}

var login = function(app, encryptedData, iv) {
    wx.login({
        success: function(res) {
            console.log(res)
            if (res.code) {
                wx.request({
                    url: API.authLogin,
                    data: { appid: API.APP_ID, code: res.code, encryptedData: encryptedData, iv: iv },
                    method: 'post',
                    header: {},
                    success: function(res) {
                        console.log(res)
                        let openid = res.data.resultContent ? res.data.resultContent.openId : '';
                        let unionid = res.data.resultContent ? res.data.resultContent.unionId : '';
                        console.log("get unionID" + unionid)
                        if (openid && unionid) {
                            wx.setStorageSync('openid', openid); //存储openid  
                            wx.setStorageSync('unionid', unionid); //unionid  
                            app.getToken(API.getToken + 'unionid_' + unionid + '_type_2')
                        }
                    },
                    fail: function() {
                        // fail
                        console.log('!res.fail')

                    }
                })
            }
        },
        fail: function(res) {
            console.log("login failed")
        },
        complete: function(res) {
            // complete
        }
    })
}
// userInfos授权
var userInfos = function(e, app, that) {
    if (app.globalData.userInfo) {
        console.log(app.globalData.userInfo)
        return
    } else {
        if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
            console.log("授权结果..:getUserInfo:fail auth deny")
            wx.showModal({ // 向用户提示需要权限才能继续
                title: '用户授权',
                content: '本小程序需要用户授权方便登录，请重新点击按钮授权。',
                mask: true,
                confirmColor: '#F45C43',
                success: function(res) {}
            })
        } else if (e.detail.errMsg == 'getUserInfo:ok') {
            let userinfo = e.detail.userInfo
            app.globalData.userInfo = userinfo
            that.setData({
                userInfo: userinfo,
                hasUserInfo: true
            })
            wx.setStorageSync('userinfo', userinfo)
            var unionid = wx.getStorageSync('unionid')
            login(app, e.detail.encryptedData, e.detail.iv)
        }
    }
}

//调用应用实例的方法获取全局数据
var globalDatas = function(app, that) {
    let userinfos = wx.getStorageSync('userinfo')
    if (userinfos) {
        console.log(userinfos)
        that.setData({
            userInfo: userinfos,
            hasUserInfo: true
        })
    } else {
        if (app.globalData.userInfo) {
            that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (that.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                that.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else if (!that.data.canIUse) {
            console.log("low version")
            wx.showModal({ // 向用户提示升级至最新版微信。
                title: '提示',
                confirmColor: '#F45C43',
                content: '微信版本过低，请升级至最新版。',
                mask: true
            })
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    that.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                    console.log(success)
                }
            })
        }
    }
}
//申请配额
var applyQuota = function(app, route, useAccount,apply,self,other) {
    console.log(route)
    console.log(useAccount)
    var datas = {
        "groupNums": 3,
        "groupType": "1",
        "wechatAccount": useAccount
    }
    app.fetchToken(API.robotBind, 'POST', datas, (err, res) => {
        console.log(res)
        if (res.resultCode == '02500010') {
            console.log('申请失败')
            wx.showModal({
                title: '申请失败',
                confirmColor: '#F45C43',
                content: '当前微信号已经被使用，请重新填写微信号。',
                mask: true,
                showCancel: false,
                confirmText: '知道了'
            })
            if(apply="applying"){
                self.setData({
                  applying:false
                })
            }
        } else if (res.resultCode == '102' || res.resultCode == '02500013' || res.resultCode == '02500014' || res.resultCode == '101' || res.resultCode == '02500011') {
            wx.showModal({
                title: '申请失败',
                confirmColor: '#F45C43',
                content: '无法添加您为好友，请更改【隐私】设置，或更换微信号。',
                mask: true,
                showCancel: false,
                confirmText: '知道了'
            })
            if(apply="applying"){
                self.setData({
                  applying:false
                })
            }
        }
        if (res.resultContent!== null) {
            let robotName = res.resultContent.robotItem.name
            let qrcode = res.resultContent.robotItem.qrCode
            let verificationCode = res.resultContent.robotOrderInfo.verificationCode
            let isLastUseRobot = res.resultContent.isLastUseRobot
            if (res.resultCode == '100') {
                wx.redirectTo({
                    url: '/pages/user/addGroup/activeRobot/activeRobot?robotName=' + robotName + '&qrcode=' + qrcode + '&verificationCode=' + verificationCode + '&isLastUseRobot' + isLastUseRobot + '&route=' + route
                })
            }
        }
    })
}
/**
 *  //提交订单
 * {
  "comments": "买个苹果手机试试",
  "goodsSimpleInfos": [
    {
      "comments": "这个要单独发货",
      "productId": "743e44c0-c4fb-11e7-804c-00155d000b01",
      "quantity": 1,
      "skuId": "7f170da3-c5c4-11e7-804c-00155d000b01",
      "tenantId": "e7535bc2-0ea5-11e7-b15f-064959e71916"
    }
  ],
  "toAddrId": "Addr123456"
}
 */


var placeOrder = function(app, goods, toAddrId) {
    console.log('→开始下单')
    console.log(goods.constructor)
    if (goods.length > 1) {
        var goodsSimpleInfos = [];
        for (var i = 0; i < goods.length; i++) {
            var goodObj = {
                'comments': '',
                'productId': goods[i].id,
                'quantity': goods[i].num,
                'skuId': goods[i].skuId,
                'tenantId': goods[i].tenantId,
            }
            goodsSimpleInfos.push(goodObj);
        }
    } else {
        var goodsSimpleInfos = {
            'comments': '欢迎购买',
            'productId': goods[0].id,
            'quantity': goods[0].num,
            'skuId': goods[0].skuId,
            'tenantId': goods[0].tenantId,
        }
    }

    var data = {
        'comments': '欢迎购买',
        'goodsSimpleInfos': goodsSimpleInfos,
        'toAddrId': toAddrId
    }
    var url = (goods.length > 1) ? API.placeOrderAll : API.placeOrderOne
    app.fetchToken(url, 'POST', data, (err, res) => {
        successShowText('下单成功');
        var goodsStroge = JSON.parse(wx.getStorageSync('goods'));
        var len = goodsStroge.length;
        if (goods.length != len) {
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < goods.length; j++) {
                    if (goods[j].id == goodsStroge[i].id && goodsStroge[i].skuId == goods[j].skuId) {
                        goodsStroge.slice(i, 1);
                    }
                }
            }
            wx.setStorageSync('goods', JSON.stringify(goodsStroge));
        } else {
            wx.removeStorageSync('goods');
        }
        console.log('→下单成功');
    })
}


// 发起退款
/**
 * 
 * {
  "out_refund_no": "string",
  "out_trade_no": "string",
  "refund_fee": 0,
  "total_fee": 0
}
 */
var wxRefund = function(app, data) {
    let d;
    app.fetchToken(API.wxRefund, 'POST', data, (err, res) => {
        if (res.resultCode == '100') {
            d = res.resultContent
        }
    });
    return d;
}


//发起支付
/**传入参数
 * orderNo：订单号
 * paymoney：以分为计算单位，要乘以100传给后台
 * name:购买物品的name
 * */
var payMoney = function(app, orderNo, paymoney, name) {
    console.log('→获取签名')
    var openId = wx.getStorageSync('openid');
    var data = {
        'openId': openId,
        'orderNo': orderNo,
        'paymoney': paymoney,
        'attach': '1-1'
    }
    SetSign(app, data, name);
}

var SetSign = function(app, form_data, name) {
    var name = name;
    app.fetchToken(API.payMoney, 'POST', form_data, (err, res) => {
        // this.fetchPost(API.payMoney, form_data, (err, res) => {
        if (res.resultCode == '100') {
            console.log('→获取签名成功');
            console.log('→支付开始');
            setTimeout(function() {
                wx.requestPayment({
                    'timeStamp': res.resultContent['timeStamp'],
                    'nonceStr': res.resultContent['nonceStr'],
                    'package': res.resultContent['package'],
                    'signType': 'MD5',
                    'paySign': res.resultContent['paySign'],
                    success: function(res) {
                        console.log(res)
                        successShowText('支付成功');
                        console.log('→支付结束');
                        var orderNo = form_data.orderNo;
                        var paymoney = form_data.paymoney;
                        wx.navigateTo({
                            url: '/pages/find/sucessPay/sucessPay?orderNo=' + orderNo + '&paymoney=' + paymoney + '&name=' + name
                        })
                    },
                    fail: function() {
                        failShowText('支付失败');
                        console.log('→支付结束');
                    }
                })
            }, 1000)
        }
    })
}

// 成功提示
var successShowText = function(text) {
    wx.showToast({
        title: text,
        icon: 'success'
    })
}
// 失败提示
var failShowText = function(text) {
    wx.showToast({
        title: text,
        image: '/icons/fail4.png'
    })
}
// 等待提示
var waitShow = function() {
    wx.showLoading({
        title: '请稍后',
        icon: 'loading',
        mask: true
    })
}
var waitHide = function() {
    wx.hideLoading()
}
module.exports = {
    formatTime: formatTime,
    formatNumber: formatNumber,
    formatPhone: formatPhone,
    removeHTMLTag: removeHTMLTag,
    successShowText: successShowText,
    failShowText: failShowText,
    waitShow: waitShow,
    waitHide: waitHide,
    placeOrder: placeOrder,
    payMoney: payMoney,
    eventTypeAppShow: "appShow",
    eventTypeAppHidden: "app_hidden",
    eventTypeUserLogin: "user_login",
    eventTypeShareApp: "share_app",
    errorTypeSceneError: "scene_error",
    errorTypePathError: "path_error",
    eventTypeSaveGroupID: "groupID_info",
    server: "",
    delayed30s: delayed30s,
    login: login,
    userInfos: userInfos,
    globalDatas: globalDatas,
    applyQuota: applyQuota,

    //  event log
    eventReport: function(event_tag) {
        let that = this
        wx.request({
            url: API,
            data: { event_tag: event_tag },
            method: "post",
            header: {},
            success: function(res) {
                // success
            },
            fail: function(res) {
                // fail
            },
            complete: function(res) {
                // complete
            }
        })
    },
}