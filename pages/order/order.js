// pages/order/order.js
const util = require('../../utils/util.js')
const API = require('../../utils/api.js')
const app = getApp()
Page({

    /**
     * 页面的初始 数据
     */
    data: {
        orderGoods: [],
        paySumMoney: 0, //商品总价格
        orderAllCheck: false,
        orderChenk: false,
        delBtnWidth: 60, //删除按钮宽度单位（rpx）,
        startX: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    orderCheckboxChange: function(e) {
        /**
         * 切换商品，先让每个商品的state成为false，
         * 根据checkbox的value值来去显示哪些商品的state是true状态，然后显示。
         * value值是个数组，数组里每个元素我放了两个数据，用’，‘隔开，
         * 这时需要先判断value是否有值，再去遍历，把每个元素分割为id，skuid，组成的数组放在新数组arrId中。
         * 循环遍历得出value长度，和购物车数据长度，对比得出是否为全选状态。
         */
        var strId = e.detail.value;
        var arrId = [];
        var dd = wx.getStorageSync('goods'); //购物车缓存
        var goodobj = JSON.parse(dd);
        for (var n = 0; n < goodobj.length; n++) {
            goodobj[n].state = false;
            wx.setStorageSync('goods', JSON.stringify(goodobj));
        }
        if (strId) {
            for (var n = 0; n < strId.length; n++) {
                arrId.push(strId[n].split(','));
            }
            for (var i = 0; i < goodobj.length; i++) {
                for (var j = 0; j < arrId.length; j++) {
                    if (goodobj[i].id == arrId[j][0] && goodobj[i].skuId == arrId[j][1]) {
                        goodobj[i].state = true;
                        wx.setStorageSync('goods', JSON.stringify(goodobj));
                        this.data.n++;
                    }
                }
            }
            var n = 0;
            for (var i = 0; i < goodobj.length; i++) {
                if (goodobj[i].state == true) {
                    n++;
                }
            }
            if (n == goodobj.length) {
                this.setData({
                    orderChenk: true
                })
            } else {
                this.setData({
                    orderChenk: false
                })
            }
            calculation(this)
        }
    },

    buyNumSelfMinus: function(e) {
        // 减
        var goodsId = e.currentTarget.dataset.id;
        var skuId = e.currentTarget.dataset.skuid;
        var dd = wx.getStorageSync('goods'); //购物车缓存
        var nums = 0;
        var state = false;
        var goodobj = JSON.parse(dd);
        for (var i = 0; i < goodobj.length; i++) {
            if (goodobj[i].id == goodsId && goodobj[i].num > 1 && goodobj[i].skuId == skuId) {
                goodobj[i].num = --goodobj[i].num;
                nums = goodobj[i].num;
                state = goodobj[i].state;
                wx.setStorageSync('goods', JSON.stringify(goodobj));
                getDoodsStore(this);
                upDatedGoodsCar('', goodsId, skuId, nums, state); //更新当前商品信息
            }
        }
    },
    buyNumSelfAdd: function(e) {
        // 加
        var goodsId = e.currentTarget.dataset.id;
        var skuId = e.currentTarget.dataset.skuid;
        var dd = wx.getStorageSync('goods'); //购物车缓存
        var goodobj = JSON.parse(dd);
        var nums = 0;
        var state = false;
        for (var i = 0; i < goodobj.length; i++) {
            if (goodobj[i].id == goodsId && goodobj[i].skuId == skuId) {
                goodobj[i].num = ++goodobj[i].num;
                nums = goodobj[i].num;
                state = goodobj[i].state;
                wx.setStorageSync('goods', JSON.stringify(goodobj));
                getDoodsStore(this);
                upDatedGoodsCar('', goodsId, skuId, nums, state); //更新当前商品信息
            }
        }
    },
    orderAllCheckboxChange: function(e) {
        // 点击全选
        // 下接接口，
        if (e.detail.value == 'true') {
            setStateStyle(true);
            calculation(this)
            this.setData({
                orderAllCheck: true,
                orderChenk: true
            })
        } else {
            setStateStyle(false);
            this.setData({
                orderAllCheck: false,
                orderChenk: false,
                paySumMoney: 0
            })
        }
    },



    touchS: function(e) {
        var txtStyle = "left:0px";
        var list = this.data.orderGoods;
        for (var i = 0; i < list.length; i++) {
            list[i].txtStyle = txtStyle;
        }
        if (e.touches.length == 1) {
            this.setData({
                //设置触摸起始点水平方向位置  
                startX: e.touches[0].clientX,
                orderGoods: list
            });
            console.log(e.touches[0].clientX)
        }
    },
    touchM: function(e) {
        if (e.touches.length == 1) {
            //手指移动时水平方向位置  
            var moveX = e.touches[0].clientX;
            //手指起始点位置与移动期间的差值  
            var disX = this.data.startX - moveX;
            var delBtnWidth = this.data.delBtnWidth;
            var txtStyle = "";
            if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变  
                txtStyle = "left:0px";
            } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离  
                txtStyle = "left:-" + disX + "rpx";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度  
                    txtStyle = "left:-" + delBtnWidth + "px";
                }
            }
            //获取手指触摸的是哪一项  
            var id = e.currentTarget.dataset.id;
            // console.log(id)
            var list = this.data.orderGoods;
            list[id].txtStyle = txtStyle;
            // 更新列表的状态  
            this.setData({
                orderGoods: list
            });
        }
    },
    touchE: function(e) {
        if (e.changedTouches.length == 1) {
            //手指移动结束后水平位置  
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离  
            var disX = this.data.startX - endX;
            var delBtnWidth = this.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮  
            var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
            //获取手指触摸的是哪一项  
            var id = e.currentTarget.dataset.id;
            var list = this.data.orderGoods;
            list[id].txtStyle = txtStyle;
            //更新列表的状态  
            this.setData({
                orderGoods: list
            });
        }
    },
    //获取元素自适应后的实际宽度  
    getEleWidth: function(w) {
        var real = 0;
        try {
            var res = wx.getSystemInfoSync().windowWidth;
            var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应  
            // console.log(scale);  
            real = Math.floor(res / scale);
            return real;
        } catch (e) {
            return false;
            // Do something when catch error  
        }
    },
    initEleWidth: function() {
        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
        this.setData({
            delBtnWidth: delBtnWidth
        });
    },

    delProduction: function(e) {
        let self = this
        var goodsId = e.currentTarget.dataset.id;
        var skuId = e.currentTarget.dataset.skuid
        var dd = wx.getStorageSync('goods'); //购物车缓存
        wx.showModal({
            title: '删除',
            content: '您确定删除该商品吗？',
            confirmColor: '#F45C43',
            success: function(res) {
                if (res.confirm) {
                    if (dd) {
                        var goodobj = JSON.parse(dd);
                        for (var i = 0; i < goodobj.length; i++) {
                            if (goodsId == goodobj[i].id && skuId == goodobj[i].skuId) {
                                goodobj.splice(i, 1);
                                if (goodobj.length) {
                                    wx.setStorageSync('goods', JSON.stringify(goodobj));
                                    self.setData({
                                        orderGoods: goodobj
                                    })
                                    calculation(self);
                                } else {
                                    wx.removeStorageSync('goods');
                                    self.setData({
                                        orderGoods: [],
                                        paySumMoney: 0
                                    })
                                }
                            }
                        }
                    }
                } else if (res.cancel) {}
            }
        })

    },

    payNow: function() {
        let _this = this;
        let goodsList = JSON.parse(wx.getStorageSync('goods')); //购物车缓存
        var dd = [];
        var aa = [];
        for (var i = 0; i < goodsList.length; i++) {
            if (true == goodsList[i].state) {
                dd.push(goodsList[i]);
            }
        }
        aa = JSON.stringify(dd);
        let paySumMoney = this.data.paySumMoney;
        // 调用接口，更新购物车数据
        wx.navigateTo({
            url: '/pages/find/pay/pay?goodsList=' + aa + '&paySumMoney=' + paySumMoney,
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
        // 接口获取购物车数据
        var data = {
            _currentPage: 1000,
            _size: 0
        }
        app.fetchToken(API.getGoods, 'GET', data, (err, res) => {
            getDoodsStore(this);
            setStateStyle(false);
            this.setData({
                orderAllCheck: false,
                orderChenk: false,
                paySumMoney: 0,
                // orderGoods: res.resultContent
            })

        })

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

function getDoodsStore(that) {
    var dd = wx.getStorageSync('goods'); //购物车缓存
    // console.log(goodsId)
    if (dd) {
        var goods = JSON.parse(dd);
        goods = goods.map(good =>
            ({
                ...good,
                txtStyle: ''
            })
        )
        that.setData({
            orderGoods: goods
        })
        calculation(that);
    }
}

// 计算价格
function calculation(that) {
    // 先获取缓存中的商品购物车数据。
    var dd = wx.getStorageSync('goods'); //购物车缓存
    // console.log(dd)
    if (dd) {
        var goods = JSON.parse(dd);
        var sumMoney = 0;
        for (var k = 0; k < goods.length; k++) {
            if (goods[k].state == true) {
                sumMoney += goods[k].price * goods[k].num;
            }
        }
    }
    that.setData({
        paySumMoney: sumMoney
    })
}

function setStateStyle(str) {
    var dd = wx.getStorageSync('goods'); //购物车缓存
    if (dd) {
        var goods = JSON.parse(dd);
        for (var k = 0; k < goods.length; k++) {
            goods[k].state = str
        }
        wx.setStorageSync('goods', JSON.stringify(goods));
    }
}
//更新购物车信息
function upDatedGoodsCar(shoppingCartId, productId, skuId, quantity, state) {
    var data = {
        'shoppingCartId': shoppingCartId,
        'productId': productId,
        'skuId': skuId,
        'quantity': quantity,
        'state': state
    }
    app.fetchToken(API.goodsStyle, 'PUT', data, (err, res) => {})
}
//清空购物车
function emptyGoodsCar(shoppingCartId) {
    var data = {
        'shoppingCartId': shoppingCartId
    };
    app.fetchToken(API.goodsStyle, 'DELETE', data, (err, res) => {})
}