// pages/user/addGroup/groupSetting/groupSetting.js
let app = getApp()
let util = require("../../../../utils/util.js")
let API = require('../../../../utils/api.js')
Page({

    /**
     * 页面的初始数据h78
     */
    data: {
        showDel: true,
        robots: [], //机器人列表
        showRemind: false,
        toActive: false, //显示剩余额度
        import: 0, //导入群
        remainQuota: 0, //剩余额度
        qrcode: '', //二维码
        verificationCode: '000000', //验证码
        robotName: '栗子妈妈',
        bindGroup: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("onload")
        var date = new Date().getTime();
        //判断剩余额度与导入群数
        this.judgeQuota();
        // 显示激活机器人，激活优先于剩余额度
        app.fetchToken(API.robotLast + '', 'GET', '', (err, res) => {
            if ((res.resultContent.status == 6) && (date < res.resultContent.vcExpiredTime)) {
                console.log('激活机器人')
                console.log(res)
                this.setData({
                    toActive: true,
                    showRemind: true,
                    bindGroup: false
                })
                let robotId = res.resultContent.maps[0].robotId
                let verificationCodes = res.resultContent.verificationCode
                app.fetchToken(API.robotId + robotId, 'GET', '', (err, res) => {
                    console.log(res)
                    this.setData({
                        qrcode: res.resultContent.qrCode,
                        verificationCode: verificationCodes,
                        robotName: res.resultContent.name
                    })
                })
                return
            } else if ((res.resultContent.status == 6) && (date > res.resultContent.vcExpiredTime)) {
                wx.showModal({
                    title: '过期提醒',
                    confirmColor: '#F45C43',
                    content: '由于机器人过期，请重新申请',
                    mask: true,
                    success: function(res) {
                        if (res.confirm) {
                            console.log('重新申请')
                            let route = 'robotQuota'
                            app.fetchToken(API.robotLast + 2, 'GET', '', (err, res) => {
                                console.log(res)
                                if (res.resultContent == null || res.detailDescription == '最后一次群申请记录查询为空') {
                                    wx.redirectTo({
                                        url: '/pages/user/addGroup/addGroup'
                                    })
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
        // 群列表
        this.groupListShow();
    },
    delGroup: function() {
        this.setData({
            showDel: false,
            showRemind: false,
            bindGroup: false
        })
    },
    verifiedRobots: function(robotId, route) {
        console.log('verifiedRobots')
        app.fetchToken(API.robotId + robotId, 'GET', '', (err, res) => {
            console.log(res)
            let robotName = res.resultContent.name
            wx.redirectTo({
                url: '/pages/user/addGroup/nextStep/nextStep?route=' + route + '&robotName=' + robotName
            })
        })
    },
    robotDetail: function(e) {
        console.log(e)
        let route = 'verifiedRobot'
        var id = e.currentTarget.dataset.id;
        let robotId = this.data.robots[id].robotId
        this.verifiedRobots(robotId, route);
    },
    delRobot: function(e) {
        let self = this
        console.log(e.currentTarget.dataset.item)
        var groupIndex = e.currentTarget.dataset.id;
        console.log(self.data.robots)
        console.log(self.data.robots[0].groups[groupIndex].id)
        var datas = {
            "groupName": e.currentTarget.dataset.item.name,
            "groupId": e.currentTarget.dataset.item.id
        }
        var dataPut = datas.groupId + '/cancel?groupName=' + datas.groupName + '&channel=phone'
        var delUrl = encodeURI(API.delRobot + dataPut)
        console.log(API.delRobot + dataPut)
        wx.showModal({
            title: '删除群',
            content: '确定删除这个群内的机器人？',
            mask: true,
            confirmColor: '#F45C43',
            success: function(res) {
                if (res.confirm) {
                    app.fetchToken(delUrl, 'GET', '', (err, res) => {
                        console.log("delete robot")
                        //重新渲染
                        // self.onload()
                        self.groupListShow()
                    })
                } else {
                    console.log('cancel')
                }

            }
        })
    },
    doneSetting: function() {
        this.judgeQuota();
        this.setData({
            showDel: true
        })
    },
    reSetting: function() {
        if (this.data.toActive && !this.data.bindGroup) {
            let route = 'activeRobot'
            let robotName = this.data.robotName
            let qrcode = this.data.qrcode
            let verificationCode = this.data.verificationCode
            wx.navigateTo({
                url: '/pages/user/addGroup/activeRobot/activeRobot?route=' + route + '&robotName=' + robotName + '&qrcode=' + qrcode + '&verificationCode=' + verificationCode
            })
        } else if (!this.data.toActive && !this.data.bindGroup) {
            let route = 'robotQuota'
            app.fetchToken(API.robotLast + 2, 'GET', '', (err, res) => {
                let useAccount = res.resultContent.seedImId
                util.applyQuota(app, route, useAccount);
            })
        } else if (this.data.bindGroup && !this.data.showRemind) {
            let route = 'verifiedRobot'
            app.fetchToken(API.robotLast + '', 'GET', '', (err, res) => {
                console.log(res)
                let robotId = res.resultContent.maps[0].robotId
                this.verifiedRobots(robotId, route);
            })
        }

    },
    exitGroupseting: (e) => {
        wx.switchTab({
            url: '/pages/user/user'
        })
    },
    judgeQuota: function() {
        //判断剩余额度与导入群数
        app.fetchToken(API.robotQuota, 'GET', '', (err, res) => {
            this.setData({
                remainQuota: res.resultContent.remain,
                import: res.resultContent.groupActivatedSum
            })
            if (res.resultContent.groupActivatedSum == 0 && res.resultContent.groupThresholdSum >
                0) {
                console.log('显示去绑定')
                this.setData({
                    showRemind: false,
                    bindGroup: true //显示去绑定

                })
            } else if (res.resultContent.remain == 0 && res.resultContent.groupActivatedSum > 0) {
                this.setData({
                    toActive: false,
                    showRemind: true, //申请配额
                    bindGroup: false
                })
            }
        })
    },
    groupListShow: function() {
        app.fetchToken(API.robotList, 'GET', '', (err, res) => {
            if (res.resultCode == '100') {
                console.log(res.resultContent)
                this.setData({
                    robots: res.resultContent
                })
            }
        })
    }
})