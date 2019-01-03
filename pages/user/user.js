// pages/user/user.js
const app = getApp()
const API = require('../../utils/api.js')
const util = require('../../utils/util.js')


Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        showLogin: true,
        yoliAccount: '',
        imgUrl: 'https://cloud.gemii.cc/lizcloud/fs/noauth/media/5a1bd25cc8e6430033fbb6fd',
        groupNew: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this

        // 请求接口，判断是否是登录状态
        var username = wx.getStorageSync('username');
        var password = wx.getStorageSync('password');
        var userNum = username.substr(0, 3) + "****" + username.substr(7);
        if (username && password) {
            that.setData({
                showLogin: false,
                yoliAccount: userNum
            })
        }
        //调用应用实例的方法获取全局数据
        util.globalDatas(app, that);
        if (that.data.hasUserInfo) {
            app.fetchToken(API.robotQuota, 'GET', '', (err, res) => {
                if (res.resultContent !== null) {
                    if (res.resultContent.groupActivatedSum == 0 && res.resultContent.groupThresholdSum >
                        0) {
                        that.setData({
                            groupNew: true //显示去绑定
                        })
                    }
                    console.log(that.data.groupNew)
                }
            })
        }
    },
    pay: function() {
        var dt = 111111 + parseInt(Math.random() * 10) + parseInt(Math.random() * 100) + parseInt(Math.random() * 1000) + parseInt(Math.random() * 10)
        util.payMoney(app, '321', '1', '买个玩玩')
    },
    getUserInfo: function(e) {
        console.log(e)
        util.userInfos(e, app, this)
        if (this.data.hasUserInfo) {
            this.gotoLogin();
        }
    },
    editAddress: function() {
        let self = this
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: res => {
                    console.log(JSON.stringify(res))
                },
                fail: err => {
                    console.log(err)
                    wx.showModal({ // 向用户提示需要权限才能继续
                        title: '提示',
                        content: '您未正确选择地址，请重新授权或选择地址',
                        mask: true,
                        confirmColor: '#F45C43',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                wx.openSetting({ //打开授权开关界面，让用户手动授权
                                    success: (res) => {
                                        console.log(res)
                                        if (res.authSetting["scope.address"]) {
                                            wx.chooseAddress({
                                                success: res => {
                                                    console.log(res)
                                                }
                                            })
                                        } else {
                                            console.log('reject authrize')
                                        }
                                    }
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            })
        } else {
            console.log('当前微信版本不支持chooseAddress');
        }
    },
    gotoLogin: function() {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },
    gotoOrder: () => {
        wx.navigateTo({
            url: '/pages/user/myOrder/myOrder'
        })
    },
    addGroup: () => {
        app.fetchToken(API.robotLast + '', 'GET', '', (err, res) => {
            //最后一次群的申请，判断页面路由
            console.log(res)
            var date = new Date().getTime();
            // if已确认全部激活 、null 、已过期
            if ((res.resultContent == null) ||
                (res.resultContent.status == 2 && res.resultContent.maps[0].groupActivated >= res.resultContent.maps[0].groupThreshold) ||
                (res.resultContent.status = 6 && date > res.resultContent.vcExpiredTime)
            ) {
                console.log('check status')
                app.fetchToken(API.robotLast + 2, 'GET', '', (err, res) => {
                    if (res.resultContent == null) {
                        console.log('no data')
                        wx.navigateTo({
                            url: '/pages/user/addGroup/addGroup'
                        })
                    } else {
                        let useAccount = res.resultContent.seedImId
                        //已绑定
                        var datas = {
                            "groupNums": 3,
                            "groupType": "1",
                            "tenantId": "",
                            "userId": "",
                            "wechatAccount": useAccount
                        }
                        app.fetchToken(API.robotBind, 'POST', datas, (err, res) => {
                            console.log(res)
                            wx.redirectTo({
                                url: '/pages/user/addGroup/groupSetting/groupSetting'
                            })
                        })
                    }
                })

            } else {
                console.log('未激活||没过期额')
                wx.redirectTo({
                    url: '/pages/user/addGroup/groupSetting/groupSetting'
                })
            }
        })

    },
    inviteRegister: function() {
        let username = this.data.userInfo.nickName
        console.log(username)
        wx.navigateTo({
            url: '/pages/user/inviteRegister/inviteRegister?userName=' + username
        })
    },
    goTorefund: () => {
        wx.navigateTo({
            url: '/pages/user/refund/refund'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },


    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    }
})