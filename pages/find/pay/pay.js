// pages/find/pay/pay.js6768
let app = getApp()
let util = require("../../../utils/util.js")
let API = require('../../../utils/api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsItem: [], //商品局部信息
        adrStyle: true, //地址状态
        userName: '',
        provinceName: '',
        cityName: '',
        countyName: '',
        detailInfo: '',
        telNumber: '',
        onlyGoods: true,
        sumMoney: 0,
        AdrId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取传输过来的商品购买信息
        // console.log(options);
        if (options.goods) {
            let goods = JSON.parse(options.goods);
            var dd = [];
            dd.push(goods);
            this.setData({
                goodsItem: dd,
                onlyGoods: true
            })
        } else if (options.goodsList) {
            let goods = JSON.parse(options.goodsList);
            let sumMoney = JSON.parse(options.paySumMoney);
            this.setData({
                goodsItem: goods,
                onlyGoods: false,
                sumMoney: sumMoney
            })
        }
        console.log(this.data.goodsItem, 22);

    },
    editAddress: function() {
        let self = this
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: res => {
                    console.log(JSON.stringify(res))
                    self.chooseAddress(res)
                },
                fail: err => {
                    console.log(JSON.stringify(err))
                    if (err.errMsg == 'chooseAddress:cancel') {
                        return
                    }
                    wx.showModal({ // 向用户提示需要权限才能继续
                        title: '提示',
                        content: '您未正确选择地址，将无法使用收货地址，请重新授权或选择地址',
                        mask: true,
                        confirmColor: '#F45C43',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                wx.openSetting({ //打开授权开关界面，让用户手动授权
                                    success: (res) => {
                                        console.log(res)
                                        if (res.authSetting["scope.address"]) {
                                            wx.chooseAddress({
                                                success: res => {
                                                    console.log(res)
                                                    self.chooseAddress(res)
                                                }
                                            })
                                        } else {
                                            console.log('reject authrize')
                                        }
                                    }
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            })
        } else {
            console.log('当前微信版本不支持chooseAddress');
        }
    },
    chooseAddress: function(res) {
        var obj = {
            "cityName": res.cityName,
            "contactTel": res.telNumber,
            "contactor": res.userName,
            "countyName": res.countyName,
            "detailAddr": res.detailInfo,
            "postCode": res.postalCode,
            "provinceName": res.provinceName
        }
        this.setData({
            userName: res.userName,
            provinceName: res.provinceName,
            cityName: res.cityName,
            countyName: res.countyName,
            detailInfo: res.detailInfo,
            telNumber: res.telNumber,
            adrStyle: false,
        })
        //获取地址id
        console.log(obj)
        app.fetchToken(API.getAdrId, 'POST', obj, (err, res) => {
            if (res.resultCode == 100) {
                this.setData({
                    AdrId: res.resultContent
                })
            }

        })
    },
    paySubmitBox: function() {

        let self = this
        console.log(self.data.adrStyle)
        if (self.data.adrStyle) {
            wx.showModal({
                title: '温馨提示',
                content: '你还未选择地址，请先选择收货地址。',
                mask: true,
                onfirmColor: '#F45C43',
                success: res => {
                    console.log(res);
                }
            })
        } else {
            console.log(self.data.goodsItem)
            util.placeOrder(app, self.data.goodsItem, self.data.AdrId)
        }

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },
})