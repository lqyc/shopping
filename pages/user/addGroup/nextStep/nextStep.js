// pages/user/addGroup/nestStep/nestStep.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        robotName: '',
        route: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            robotName: options.robotName,
            route: options.route
        })
    },
    checked: () => {
        wx.redirectTo({
            url: "/pages/user/addGroup/groupSetting/groupSetting"
        })
    },
    gofirstStep: function() {
        if (this.data.route == 'verifiedRobot') {
            wx.redirectTo({
                url: "/pages/user/addGroup/groupSetting/groupSetting"
            })
        } else {
            wx.redirectTo({
                url: "/pages/user/addGroup/activeRobot/activeRobot"
            })
        }
    }
})