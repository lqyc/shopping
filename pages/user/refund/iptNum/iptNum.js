// pages/user/refund/iptNum/iptNum.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        iptState: true,
        iptNumss: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    iptNums: function(e) {
        // console.log(e.detail.value);
        this.setData({
            iptNumss: e.detail.value
        })
        if (this.data.iptNumss.length >= 10) {
            this.setData({
                iptState: false
            })
        } else {
            this.setData({
                iptState: true
            })
        }

    },
    scanCodeBtn: function() {
        var _this = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: function(res) {
                console.log(res);
                // 扫描后赋值
                // _this.setData({
                //     iptNums: res.data
                // })
            },
            fail: function(req) {
                console.log(req)
            }
        })
    },
    goBackRefund: function() {
        wx.setStorageSync('iptNum', this.data.iptNumss);
        // 调用接口成功后返回
        wx.navigateBack({
            delta: 1
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
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },
})