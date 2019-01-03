// pages/user/inviteRegister/friendsInvited/friendsInvited.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userName:'栗子妈妈'
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
  userName:options.userName
  })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let username=this.data.userName
        let titles = '注册有栗，买东西更省钱';
        let paths = '/pages/user/inviteRegister/friendsInvited/friendsInvited?userName='+username
        let urls = '/icons/banner.png'
        return app.shareIndex(titles, paths, urls)
  }
})