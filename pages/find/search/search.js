// pages/find/search/search.js
var WxSearch = require('../../template/searchHistory.js');
let app = getApp()
const util = require('../../../utils/util.js')
const API = require('../../../utils/api.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wxSearchData: [],
        notFound: false,
        inputValues: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        var self = this;
        var initData = []
        var searchKeys = {
            "currentPage": 0,
            "pageSize": 200,
        }
        app.fetchPost(API.goodsNoes, searchKeys, (err, data) => {
            console.log(data)
            for (var n = 0; n < data.resultContent.length; n++) {
                initData.push(data.resultContent[n].name)
            }
        })
        //初始化的时候渲染wxSearchdata
        WxSearch.init(self, 43);
        WxSearch.initMindKeys(initData);
    },
    wxSearchFn: function(e) {
        var self = this
        WxSearch.wxSearchAddHisKey(self);
    },
    searchCurrent: function() {
        app.globalData.searchKey = this.data.inputValues
        console.log(app.globalData.searchKey)
        wx.reLaunch({
            url: '../../find/find',
        })
    },
    wxSearchInput: function(e) {
        var self = this
        WxSearch.wxSearchInput(e, self);
    },
    wxSerchFocus: function(e) {
        var self = this
        WxSearch.wxSearchFocus(e, self);
    },
    wxSearchBlur: function(e) {
        var self = this
        WxSearch.wxSearchBlur(e, self);
    },
    wxSearchKeyTap: function(e) {
        var self = this
        WxSearch.wxSearchKeyTap(e, self);
    },
    wxSearchDeleteKey: function(e) {
        var self = this
        WxSearch.wxSearchDeleteKey(e, self);
    },
    wxSearchDeleteAll: function(e) {
        var self = this;
        WxSearch.wxSearchDeleteAll(self);
    },
    wxSearchTap: function(e) {
        var self = this
        WxSearch.wxSearchHiddenPancel(self);
    },
    closeSearch: function(e) {
        let clear = []
        let clearmin = []
        let clearData = this.data.wxSearchData
        clearData.mindKeys = clear
        clearData.value = clearmin
        this.setData({
            wxSearchData: clearData
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let titles = '加入有栗，轻松有利';
        let paths = 'pages/find/find';
        let urls = ''
        return app.shareIndex(titles, paths, urls)
    }
})