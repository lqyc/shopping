// pages/user/refund/refundDetail/refundDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        btnState: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
  cancelRefund:function(){
    wx.showModal({
      title: '取消退款',
      content: '取消退款后不能再次申请退款',
      confirmColor: '#F45C43',
      mask:true
    })
  },
  skipIptNum: function (e) {
    wx.navigateTo({
      url: '/pages/user/refund/iptNum/iptNum?num='
    })
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

    }
})