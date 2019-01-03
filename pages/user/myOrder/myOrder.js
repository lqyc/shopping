// pages/user/myOrder/myOrder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectState: '0',
        orderList:[
          {consignee:'栗子妈',orderNum:323123124234,tip:'待付款',img:'https://cloud.gemii.cc/lizcloud/fs/noauth/media/5a1bd25cc8e6430033fbb6fd',name:'有机食物叽叽叽叽对对对',price:232.32,weigth:'343g',special:'大礼包',volume:2,total:'323.22'},
          {consignee:'小小鱼',orderNum:323123124234,tip:'待收货',img:'https://cloud.gemii.cc/lizcloud/fs/noauth/media/5a1bd25cc8e6430033fbb6fd',name:'有机食物叽叽叽叽对对对',price:232.32,weigth:'343g',special:'大礼包',volume:2,total:'323.22'},
          {consignee:'大大白',orderNum:323123124234,tip:'退款中',img:'https://cloud.gemii.cc/lizcloud/fs/noauth/media/5a1bd25cc8e6430033fbb6fd',name:'有机食物叽叽叽叽对对对',price:232.32,weigth:'343g',special:'大礼包',volume:2,total:'323.22'},
          {consignee:'大大白',orderNum:323123124234,tip:'退款',img:'https://cloud.gemii.cc/lizcloud/fs/noauth/media/5a1bd25cc8e6430033fbb6fd',name:'有机食物叽叽叽叽对对对',price:232.32,weigth:'343g',special:'大礼包',volume:2,total:'323.22'},
          {consignee:'大大白',orderNum:323123124234,tip:'待发货',img:'https://cloud.gemii.cc/lizcloud/fs/noauth/media/5a1bd25cc8e6430033fbb6fd',name:'有机食物叽叽叽叽对对对',price:232.32,weigth:'343g',special:'大礼包',volume:2,total:'323.22'},
          {consignee:'栗子妈',orderNum:323123124234,tip:'已完成',img:'https://cloud.gemii.cc/lizcloud/fs/noauth/media/5a1bd25cc8e6430033fbb6fd',name:'有机食物叽叽叽叽对对对',price:232.32,weigth:'343g',special:'大礼包',volume:2,total:'323.22'}
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
     gotoDetail:function(){
    wx.navigateTo({
      url:'/pages/user/orderDetail/orderDetail'
    })
  },
    selectState: function(e) {
        var value = e.detail.value;
        this.setData({
            selectState: value
        })
    },
    skipIptNum: function(e) {
        wx.navigateTo({
            url: '/pages/user/refund/iptNum/iptNum?num=' + e.target.dataset.num
        })
    },
    refundDetail: function(e) {
        wx.navigateTo({
            url: '/pages/user/refund/refundDetail/refundDetail?nums=' + e.target.dataset.nums
        })
    },
    skipLogistics: function(e) {
        wx.navigateTo({
            url: '/pages/user/logistics/logistics?num=' + e.target.dataset.num
        })
    },
    remind:()=>{
        wx.showToast({
          title: '提醒成功',
          icon: 'success',
          duration: 2000,
          mask:true
        })
    },
    delProduction: function(e) {
        var delStyle = e.target.dataset.nums;
        wx.showModal({
            title: '取消订单',
            content: '确定取消订单？',
            confirmColor: '#F45C43',
            success: (res) => {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },

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