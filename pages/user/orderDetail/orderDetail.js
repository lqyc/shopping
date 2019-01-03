// pages/user/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
       orderDone:'运输中'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
 gotoRefund:()=>{
  wx.navigateTo({
    url:'/pages/user/refund/iptMessage/iptMessage'
  })
 },
 skipLogistics: function(e) {
        wx.navigateTo({
            url: '/pages/user/logistics/logistics?num=' + e.target.dataset.num
        })
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
})