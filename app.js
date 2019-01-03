const util = require("utils/util.js")
const API = require('/utils/api.js')

//app.js
App({
    data: {},
    onLaunch: function() {
        let that = this // post请求
    },
    globalData: {
        userInfo: null,
        searchKey: ""
    },
    onShow: function(options) {
        let sence = util.errorTypeSceneError
        let path = util.errorTypePathError
        try {
            sence = options.scene
            path = options.path
            if (sence == 1044) {
                // this.saveUserGroupInfo(options.shareTicket)
                     console.log(sence)
            }
        } catch (ex) {
            console.log("get scene error, lower version of wechat.")
        }
        console.log(sence)
    },
    onHide: function() {
        // this.eventReport(util.eventTypeAppHidden)
        console.log('App Hide')
    },
    eventReport: function(event) {
        util.eventReport(event)
    },
    shareIndex: function(titles, paths, urls) {
        let self = this;
        return {
            title: titles,
            path: paths,
            imageUrl: urls, //若不写，则随机截图当前页面,图片宽高有影响，尤其高度
            mask: true,
            success(res) {
                console.log(res)
                    // app.saveUserGroupInfo(res.shareTickets[0])
                if (res.hasOwnProperty("shareTickets")) {
                    self.saveUserGroupInfo(res.shareTickets[0])
                    wx.showToast({
                        title: '分享成功',
                        icon: 'success',
                        duration: 3000
                    })
                } else {
                    console.log("share tickets unavailable")
                }
                console.log(res)
            }
        }
    },
    getToken(url) {
        console.log('→项目开始获取token开始/n', url);
        wx.request({
            url: url,
            method: 'POST',
            data: {},
            header: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Authorization": "Basic bGl6LXlvdWxpLXd4OnNlY3JldA==" //base64加密liz-youli-wx:secret
            },
            success(res) {
                console.log(res, '→数据')
                util.delayed30s(res.data.access_token, res.data.refresh_token, res.data.expires_in);
                console.log('→项目开始获取token结束', url);
            },
            fail(e) {
                console.log(e, '→获取token失败');
            }
        });
    },
    //get请求方式
    fetchGet(url, callback) {
        util.waitShow();
        console.log('→开始请求', url);
        wx.request({
            url: url,
            header: {
                'Content-Type': 'application/json',
            },
            success(res) {
                util.waitHide();
                callback(null, res.data);
                console.log('→返回数据', res.data);
                console.log('→请求结束', url);
            },
            fail(e) {
                util.waitHide();
                callback(e);
            }
        });

    },
    // post请求方式
    fetchPost(url,data, callback) {
        util.waitShow();
        console.log('→开始请求', url, data);
        wx.request({
            url: url,
            method: 'POST',
            data: data,
            header: {
                'Content-Type': 'application/json',
            },
            success(res) {
                util.waitHide();
                callback(null, res.data);
                console.log(data + '→返回数据', res.data);
                console.log('→请求结束', url, data);
            },
            fail(e) {
                util.waitHide();
                callback(e);
            }
        });
    },
    //   delete请求方式
    // put请求方式
    // postToken请求方式
    fetchToken(url, method, data, callback) {
        util.waitShow();
        console.log('→获取token')
        var date = new Date();
        var dt = date.getTime();
        var dd = 0;
        var expires_in = wx.getStorageSync('expires_in');
        if (dt >= expires_in) {
            console.log('→token过期,刷新token')
            var refresh_token = wx.getStorageSync('refresh_token');
            console.log(refresh_token);
            wx.request({
                url: API.refreshToken + refresh_token,
                method: 'POST',
                header: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Authorization": "Basic bGl6LXlvdWxpLXd4OnNlY3JldA==" //base64加密liz-youli-wx:secret
                },
                success: function(res) {
                    console.log('→刷新token成功')
                    util.waitHide();
                    dd = 1;
                    util.delayed30s(res.data.access_token, res.data.refresh_token, res.data.expires_in);
                },
                fail: function(e) {
                    util.waitHide();
                    callback(e);
                }
            })
        } else {
            console.log('→token未过期');
            dd = 1;
        }
        var timers = setInterval(function() {
            util.waitShow();
            if (dd) {
                console.log('→获取token成功');
                var access_token = wx.getStorageSync('access_token')
                console.log('→开始请求', url, data);
                wx.request({
                    url: url,
                    method: method,
                    data: data,
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        "Authorization": "bearer " + access_token
                    },
                    success(res) {
                        util.waitHide();
                        console.log('→返回数据', res.data);
                        callback(null, res.data);
                        console.log('→请求结束', url, data);
                    },
                    fail(e) {
                        util.waitHide();
                        callback(e);
                    }
                });
                clearInterval(timers);
            }
        }, 1000)
    }
})