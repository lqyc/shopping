// pages/user/refund/iptMessage/iptMessage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        iptMessageBtnState: true, //按钮状态
        imgState: true, //上传图片状态
        classArray: ['仅退款', '退货/退款'], //退款类型数组
        classIndex: 0, //退款类型index
        classValue: '', //退款类型
        StateArray: ['已收到货', '未收到货'], //退款状态数组
        StateIndex: 0, //退款状态index
        StateValue: '', //退款状态
        ReasonArray: ['缺货', '未按约定时间发货', '买/卖双方协商一致', '多拍/错拍/不想要', '其他'], //退款原因数组
        ReasonIndex: 0, //退款原因index
        ReasonValue: '', //退款原因
        ReasonsValue: '', //说明
        ImgArray: [], //图片数组
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    addImg: function(e) {
        // 添加图片
        var _this = this;
        wx.chooseImage({
            count: 5,
            success: function(res) {
                console.log(res);
                _this.setData({
                    imgState: false,
                    ImgArray: res.tempFilePaths
                })
            }
        })
    },
    delImg: function(e) {
        //删除图片
        // console.log(e.target.dataset.value);
        var a = this.data.ImgArray
        a.splice(e.target.dataset.value, 1);
        this.setData({
            ImgArray: a
        })
        if (a.length <= 0) {
            this.setData({
                imgState: true
            })
        }
    },
    catchchangeClass: function(e) {
        // console.log(e);
        this.setData({
            classValue: this.data.StateArray[e.detail.value]
        });
        // 退款类型
    },
    catchchangeState: function(e) {
        // console.log(e);
        this.setData({
            StateValue: this.data.classArray[e.detail.value]
        });
        // 退款状态
    },
    catchchangeReason: function(e) {
        // console.log(e);
        this.setData({
            ReasonValue: this.data.ReasonArray[e.detail.value]
        });
        // 退款原因
    },
    reasonsIpt: function(e) {
        // console.log(e.detail);
        this.setData({
                ReasonsValue: e.detail.value
            })
            // 退款说明
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})