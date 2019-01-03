// pages/user/addGroup/addGroup.js
let app = getApp()
let util = require("../../../utils/util.js")
let API = require('../../../utils/api.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        useAccount: '',
        applying:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.fetchToken(API.robotLast + '', 'GET', '', (err, res) => {
            if (res.resultContent == null || res.detailDescription == '最后一次群申请记录查询为空') {
                console.log("申请记录查询为空")
                return
            } else if ((res.resultContent.status == 6) && (date > res.resultContent.vcExpiredTime)) {
                wx.showModal({
                    title: '过期提醒',
                    confirmColor: '#F45C43',
                    content: '由于发送信息超时，请重新申请.',
                    mask: true,
                    success: function(res) {
                        if (res.confirm) {
                            console.log('重新申请')
                            let route = 'robotQuota'
                            app.fetchToken(API.robotLast + 2, 'GET', '', (err, res) => {
                                console.log(res)
                                if (res.resultContent == null || res.detailDescription == '最后一次群申请记录查询为空') {
                                    return
                                } else {
                                    let useAccount = res.resultContent.seedImId
                                    util.applyQuota(app, route, useAccount);
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        })
    },
    inputWechat: function(e) {
        this.setData({
            useAccount: e.detail.value
        })
    },
    activeRobot: function(e) {
        let self=this
        let useAccount = self.data.useAccount

        if (useAccount.length > 0) {
            let route = 'robotQuota'
            let apply ='applying'
            self.setData({
                applying:true
            })
            util.applyQuota(app, route, useAccount,apply,self);
        } else {
            wx.showModal({
                title: '输入有误',
                confirmColor: '#F45C43',
                content: '微信号/手机号码不能为空',
                mask: true
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

})