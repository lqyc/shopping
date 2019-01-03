// pages/find/sucessPay/sucessPay.js
const util = require('../../../utils/util.js')
const API = require('../../../utils/api.js')
const app = getApp()
Page({
    data: {
        products: [],
        pageNum: 0,
        skipLong: 0,
        showLogin: false,
        showMask: true,
        goodsObj: {}
    },
    onLoad: function(options) {
        console.log(options);
        var goodsObj = {
            name: options.name,
            orderNo: options.orderNo,
            paymoney: options.paymoney
        }
        this.setData({
            goodsObj: goodsObj
        })
        getGoods(this, this.data.pageNum, 6);
        // 请求接口，判断是否是登录状态
        var username = wx.getStorageSync('username');
        var password = wx.getStorageSync('password');
        if (username && password) {
            this.hideMaskBox()
        }
    },
    hideMaskBox: function() {
        this.setData({
            showMask: false
        })
    },
    gotoregister: () => {
        wx.navigateTo({
            url: '../../login/login?route=' + 'register'
        })
    },
    gotoIndex: function() {
        wx.switchTab({
            url: '/pages/find/find'
        })
    },
    skipLongBtn: function() {
        console.log('1')
        var pageNum = ++this.data.pageNum;
        getGoods(this, pageNum, 6)
        this.setData({
            skipLong: 408
        })
    },
})

function getGoods(that, page, pageSize) {
    app.fetchPost(API.goodsNoes, {
        "currentPage": page,
        "pageSize": pageSize,
        "sortType": 0
    }, (err, data) => {
        if (data.resultCode == 100) {
            that.setData({
                products: data.resultContent
            })
        }
    })
}