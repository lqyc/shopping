// pages/find/find.js
const util = require('../../utils/util.js')
const API = require('../../utils/api.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据fdsf
     */
    data: {
        products: [],
        hasRefesh: false,
        hasRefesh1: false,
        pageNum: 0,
        isFreshing: false,
        searchClass: [],
        searchClassState: true, //隐藏分类遮罩层
        newGoods: true,
        volume: false,
        classify: false,
        totalPage: 0,
        showEarn: false,
        loadingMore: true,
        totalRecords: 0,
        noGoods: false,
        inputName: '请输入商品名称',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 请求接口，判断是否是登录状态
        var username = wx.getStorageSync('username');
        var password = wx.getStorageSync('password');
        var categoryId = ''
        
        if (username && password) {
            this.setData({
                showEarn: true
            })
        }
        //要求小程序返回分享目标信息
        wx.showShareMenu({
            withShareTicket: true
        })

        console.log(app.globalData.searchKey)

        //获取商品列表，进来数据page为0，pageSize默认为10；
        getGoods(this, this.data.pageNum, 10, app.globalData.searchKey, categoryId)
        getGoodsClassify(this)
        if (app.globalData.searchKey !== '') {
            wx.setNavigationBarTitle({
                title: app.globalData.searchKey
            })
        }
    },
    changeNewGoods: function() {
        this.setData({
            newGoods: true,
            volume: false,
            classify: false,
            searchClassState: true
        })
        let newsearchKey = ''
        getGoods(this, this.data.pageNum, 10, newsearchKey)
        wx.setNavigationBarTitle({
            title: '首页'
        })
    },
    changeVolume: function() {
        this.setData({
            newGoods: false,
            volume: true,
            classify: false,
            searchClassState: true
        })
        wx.setNavigationBarTitle({
            title: '首页'
        })
    },
    changeStateClass: function() {
        var searchClassState = this.data.searchClassState;
        if (searchClassState) {
            this.setData({
                searchClassState: false
            })
        } else {
            this.setData({
                searchClassState: true
            })
        }
        this.setData({
            newGoods: false,
            volume: false,
            classify: true
        })
    },
    checkedThisItem: function(e) {
        var a = e.target.dataset.name.name;
        console.log(e.target.dataset);
        var arr = this.data.searchClass;
        for (var i = 0; i < arr.length; i++) {
            if (a == arr[i].names.name) {
                arr[i].states = true;
            } else {
                arr[i].states = false;
            }
        }
        this.setData({
            searchClass: arr
        })
        var categoryId = e.target.dataset.name.id
        var searchKey = ''
        getGoods(this, this.data.pageNum, 10, searchKey, categoryId)
        wx.setNavigationBarTitle({
            title: a
        })
    },
    loadMore: function(e) {
        let _this = this;
        if (_this.data.isFreshing) {
            return
        } else {
            console.log(_this.data.pageNum, '当前页')
            if (_this.data.pageNum == _this.data.totalPage - 1) {
                _this.setData({
                    hasRefesh: false,
                    isFreshing: false,
                    loadingMore: false
                })
                return
            }
            _this.setData({
                hasRefesh: true,
                isFreshing: true
            });
            if (app.globalData.searchKey !== '') {
                var searchKeys = {
                    "currentPage": _this.data.pageNum + 1,
                    "pageSize": 10,
                    searchKey: app.globalData.searchKey
                }
            } else {
                var searchKeys = {
                    "currentPage": _this.data.pageNum + 1,
                    "pageSize": 10
                }
            }
            app.fetchPost(API.goodsNoes, searchKeys, (err, data) => {
                if (data.resultCode == '100') {
                    _this.setData({
                        products: _this.data.products.concat(data.resultContent),
                    })
                    setTimeout(function() {
                        _this.setData({
                            hasRefesh: false,
                            isFreshing: false,
                            pageNum: data.pageInfo.currentPage
                        })
                    }, 0)
                }
            })
        }
    },
    searchInput: function() {
        wx.navigateTo({
            url: '/pages/find/search/search?totalRecords=' + this.data.totalRecords
        })
    },
    //  * 用户点击右上角分享
    onShareAppMessage: function() {
        app.eventReport("/pages/find/find|" + util.eventTypeShareApp);
        let titles = '加入有栗，轻松有利';
        let paths = '/pages/find/find'
        let urls = ''
        return app.shareIndex(titles, paths, urls)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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

function getGoods(that, page, pageSize, searchKey, categoryId) {
    if (categoryId !== '') {
        var searchKeys = {
            "currentPage": 0,
            "pageSize": 10,
            "categoryId": categoryId
        }
    } else {
        if (searchKey !== '') {
            console.log("搜索")
            var searchKeys = {
                "currentPage": page,
                "pageSize": pageSize,
                searchKey: searchKey
            }
        } else {
            var searchKeys = {
                "currentPage": page,
                "pageSize": pageSize
            }
        }
    }

    app.fetchPost(API.goodsNoes, searchKeys, (err, data) => {
        if (data.resultCode == '100') {
            if (categoryId !== '') {
                that.setData({
                    products: data.resultContent,
                    totalPage: data.pageInfo.totalPage,
                    pageNum: data.pageInfo.currentPage,
                    searchClassState: true,
                    noGoods: false
                })
            } else {
                that.setData({
                    products: data.resultContent,
                    totalPage: data.pageInfo.totalPage,
                    pageNum: data.pageInfo.currentPage,
                    totalRecords: data.pageInfo.totalRecords,
                    noGoods: false
                })
            }
        }
        if (that.data.products.length == 0) {
            console.log("no ---data")
            that.setData({
                loadingMore: false,
                noGoods: true
            })
        } else {
            if (that.data.pageNum == that.data.totalPage - 1) {
                console.log(that.data.products)
                that.setData({
                    loadingMore: false
                })
            }
        }
    })
}

function getGoodsClassify(that) {
    app.fetchGet(API.goodsClassify, (err, data) => {
        var classArr = new Array()
        if (data.resultCode == 100) {
            for (var i = 0; i < data.resultContent.length; i++) {
                var classObj = {};
                classObj.names = data.resultContent[i];
                classObj.states = false;
                classArr.push(classObj);
            }
            that.setData({
                searchClass: classArr
            })
        }
    })
}