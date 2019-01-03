// pages/user/addGroup/activeRobot/activeRobot.js
let app = getApp()
let util = require("../../../../utils/util.js")
let API = require('../../../../utils/api.js')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        qrcode: '',//二维码
        showTip: true,
        verificationCode: '000000', //验证码
        robotName: '栗子妈妈'
    },

    /**
     * 生命周期函数--监听页面加载 就好
     */
    onLoad: function(options) {
        console.log(options)
        if (options.route == 'bindWechat' || options.route == 'robotQuota' || options.route == 'activeRobot' ) {
            if(options.isLastUseRobot){
                console.log('折叠起来1.2两步骤') 
            }
            this.setData({
                qrcode: options.qrcode,
                verificationCode: options.verificationCode,
                robotName: options.robotName
            })
        } else {
            console.log('robotid')
        }
    },
    hideTipMask: function() {
        this.setData({
            showTip: true
        })
    },
    showTipMask: function() {
        this.setData({
            showTip: false
        })
    },
    saveImg: function(e) {
        console.log(e.target.dataset.url)
        let codeUrl = e.target.dataset.url
        let self = this
        wx.downloadFile({
            url: codeUrl,
            success: res => {
                console.log(res)
                let tempFilePath = res.tempFilePath
                wx.getSetting({
                    success: res => {
                        if (!res.authSetting['scope.writePhotosAlbum']) {
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {
                                    self.saveImageToPhotosAlbum(tempFilePath)
                                },
                                fail() {
                                    console.log('fail----')
                                    wx.showModal({ // 向用户提示升级至最新版微信。
                                        title: '授权失败',
                                        confirmColor: '#F45C43',
                                        content: '为成功保存二维码，请重新授权。',
                                        mask: true,
                                        success: function(res) {
                                            wx.openSetting({
                                                success() {
                                                    if (res.authSetting["scope.writePhotosAlbum"]) {
                                                        self.saveImageToPhotosAlbum(tempFilePath)
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            self.saveImageToPhotosAlbum(tempFilePath)
                        }
                    }
                })
            }
        })
    },
    saveImageToPhotosAlbum: function(tempFilePath) {
        wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function(data) {
                console.log(data.errMsg)
                if (data.errMsg == 'saveImageToPhotosAlbum:ok') {
                    wx.showToast({
                        title: '成功保存二维码到本地',
                        icon: 'success',
                        duration: 3000
                    })
                }
            },
            fail(err) {
                console.log('failsaveImageToPhotosAlbum----')
                console.log(err)
            }
        })
    },
    clipboardData: function() {
        let verificationCode = this.data.verificationCode
        wx.setClipboardData({
            data: verificationCode,
            success: function(res) {
                console.log(res)
                util.successShowText('复制验证码成功')
            }
        })
    },
    groupSetting: () => {
        wx.navigateTo({
            url: "/pages/user/addGroup/groupSetting/groupSetting"
        })
    },
    gonestStep:()=>{
        wx.redirectTo({
            url: "/pages/user/addGroup/nextStep/nextStep"
        })
    }
})