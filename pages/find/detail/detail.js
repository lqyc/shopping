// pages/find/detail/detail.js
let app = getApp()
let util = require("../../../utils/util.js")
let API = require('../../../utils/api.js')
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    /**
     * 页面的初始数据1 -
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        scrollState: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        productItem: {},
        loginState: false, //异步从缓存中取,登录状态
        showModalStatus: false, //自定义弹窗状态
        groupsBuy: false, //拼团买按钮控制
        buyNumSelf: 1, //购买数量，默认是1，最大受限于商品剩余数量
        animationData: 0,
        currentName: '',
        goodsId: '', //有栗商品id
        userGoodsId: '', //用户分享商品id
        shoppingModal: false,
        carNum: 0,
        changeBtn: true,
        specStyle: [],
        showScrollTop: false,
        scrollTop: 0,
        sku: {
            specStyle: [],
            specSku: [],
        },
        productDeatil: {},
        daset: '',
        popErrorMsg: '', //错误提示信息,
        HomeThisImg: '',
        forSell: false, //卖家菜单
        bottomShow: true, //卖家添加群投放显示
        firstIndex: -1,
        //准备数据  
        //数据结构：以一组一组来进行设定  
        commodityAttr: [],
        attrValueList: [],
        includeGroup: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        this.setData({
            HomeThisImg: options.imgs
        })
        var that = this
            // 获取登录状态
        var username = wx.getStorageSync('username');
        var password = wx.getStorageSync('password');
        if (username && password) {
            this.setData({
                loginState: true
            })
        }

        var goods = wx.getStorageSync('goods')
        if (goods) {
            goods = JSON.parse(goods);
            this.setData({
                carNum: goods.length
            })
        }
        // 根据当前商品id获取商品详情
        // 后面有借口直接通过交互传入商品id直接获取商品信息
        var url = API.goodsDetail + options.id
        app.fetchGet(url, (err, data) => {
            if (data.resultCode == 100) {
                //当轮播图片大于6时，只显示6个。小于则全部显示
                if (data.resultContent.photos.length > 6) {
                    data.resultContent.photos = data.resultContent.photos.slice(0, 6);
                }
                that.setData({
                    productItem: data.resultContent,
                    currentName: data.resultContent.name,
                    goodsId: data.resultContent.id,
                    tenantId: data.resultContent.tenantId,
                    daset: WxParse.wxParse('daset', 'html', data.resultContent.description, that, 0)
                })
                wx.setNavigationBarTitle({
                    title: data.resultContent.name
                })
            }
        });
        var token = wx.getStorageSync('access_token');
        if (token) {
            var url1 = API.shareGoods + '?goodId=' + options.id
            app.fetchToken(url1, 'POST', {}, (err, res) => {
                console.log(res);
                if (res.resultCode == '100') {
                    this.setData({
                        userGoodsId: res.resultContent.id
                    })
                }
            })
        }

        // 获取SKU


        getSku(that, options.id);

        //调用应用实例的方法获取全局数据
        util.globalDatas(app, that);
        if (this.data.hasUserInfo) {
            this.changeButton()
        }
    },
    getUserInfo: function(e) {
        console.log(e)
        util.userInfos(e, app, this)
        if (this.data.hasUserInfo) {
            this.changeButton()
        }
    },
    changeButton: function() {
        this.setData({
            changeBtn: false
        })
    },
    goTosell: function() {
        //用户卖商品
        this.setData({
            forSell: true,
            bottomShow: false
        })

    },
    hideSell: function() {
        this.setData({
            forSell: false
        })
    },
    bindGroup: function() {
        app.fetchToken(API.robotList, 'GET', '', (err, res) => {
            if (res.resultCode == '100') {
                if (res.resultContent[0].groups == null||res.resultContent[0].groups.length==0) {
                    console.log("您还未绑定群")
                    wx.showModal({
                        title: '发送失败',
                        content: '您还未绑定群，请到【我的】群管理进行绑定。',
                        mask: true,
                        confirmColor: '#F45C43',
                        success: res => {
                            if (res.confirm) {
                                wx.switchTab({
                                    url: '../../../pages/user/user'
                                })
                            } else {
                                console.log(res)
                            }
                        }
                    })
                } else {
                    var datas = {
                        "apicId": "",
                        "apicPath": this.data.HomeThisImg,
                        "atAllFlag": false,
                        "content": "加入有栗，轻松有栗",
                        "groupSendingType": 1,
                        "immediateFlag": true,
                        "sendOption": "&",
                        "senderType": 1,
                        "sendOrderType": 0,
                        "sendingType": 0,
                        "sourceChannel": 2,
                        "title": this.data.currentName,
                        "ttaskPics": [{
                            "fileType": "xml",
                            "picId": "5a1e6eb2038703001e1d233c",
                            "picPath": "http://dev.gemii.cc:58080/noauth/media/5a1e6eb2038703001e1d233c"
                        }],
                        "type": 2,
                        "uri": "/pages/find/detail/detail.html?id=" + this.data.userGoodsId
                    }
                    app.fetchToken(API.putGroup, 'POST', datas, (err, res) => {
                        if (res.resultCode == '100') {
                            wx.showToast({
                                title: '发送成功',
                                icon: 'success',
                                duration: 3000
                            })
                            this.hideSell()
                        }
                    })
                }
            }
        })
    },
    showScrollTop: function() {
        this.setData({
            showScrollTop: true
        })
    },
    hideScroll: function() {
        this.setData({
            showScrollTop: false
        })
    },
    scrollTop: function() {
        this.setData({
            scrollTop: 0
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let titles = this.data.currentName;
        let paths = '/pages/find/detail/detail?id=' + this.data.userGoodsId
        let urls = ''
        console.log(paths)
        return app.shareIndex(titles, paths, urls)
    },
    addCar: function(e) {
        //加入购物车
        // 接口方式
        var _this = this;
        var arr = selectSku(this, 1);
        if (arr) {
            var buyNumSelf = this.data.buyNumSelf;
            var goodsData = {
                'productId': this.data.goodsId,
                'skuId': arr.id,
                'quantity': buyNumSelf,
                'comments': '买一个玩玩'
            }
            app.fetchToken(API.goodsStyle, 'POST', goodsData, (err, res) => {
                    util.successShowText('添加成功');
                    this.hideModal();
                })
                //添加的商品
            var goods = {
                img: this.data.HomeThisImg,
                num: this.data.buyNumSelf,
                id: this.data.goodsId,
                name: arr.name,
                price: arr.price,
                valueSku: arr.valueSku,
                skuId: arr.id,
                tenantId: this.data.tenantId,
                state: false
            };
            var contact = new Object(); //单个商品的对象，暂时介质
            var goodobj = new Object(); //商品对象
            var memberfilter = new Array(); //商品信息
            memberfilter[0] = "img";
            memberfilter[1] = "num";
            memberfilter[2] = "id";
            memberfilter[3] = "name";
            memberfilter[4] = "price";
            memberfilter[5] = "valueSku";
            memberfilter[6] = "skuId";
            memberfilter[7] = "tenantId";
            memberfilter[8] = "state";
            var goodss = wx.getStorageSync('goods');
            if (goodss) {
                goodobj = JSON.parse(goodss);
                var con = 0;
                for (var i = 0; i < goodobj.length; i++) {
                    if (goodobj[i].id == goods.id && goodobj[i].skuId == goods.skuId) {
                        goodobj[i].num = goods.num + parseInt(goodobj[i].num);
                        wx.setStorageSync('goods', JSON.stringify(goodobj, memberfilter));
                        _this.hideModal();
                        con++;
                        break;
                    }
                }
                if (con == 0) {
                    //没有该商品，新建一个进去
                    contact.id = goods.id;
                    contact.name = goods.name;
                    contact.num = goods.num;
                    contact.price = goods.price;
                    contact.valueSku = goods.valueSku;
                    contact.img = goods.img;
                    contact.skuId = goods.skuId;
                    contact.state = goods.state;
                    contact.tenantId = goods.tenantId;
                    var jsonText = JSON.stringify(contact, memberfilter);
                    var goolen = goodobj.length;
                    goodobj[goolen] = JSON.parse(jsonText);
                    wx.setStorageSync('goods', JSON.stringify(goodobj, memberfilter));
                    this.setData({
                        carNum: ++this.data.carNum
                    })
                }
                _this.hideModal();
            } else {
                contact.id = goods.id;
                contact.name = goods.name;
                contact.num = goods.num;
                contact.price = goods.price;
                contact.valueSku = goods.valueSku;
                contact.img = goods.img;
                contact.skuId = goods.skuId;
                contact.state = goods.state;
                contact.tenantId = goods.tenantId;
                var good = new Array();
                var jsonText = JSON.stringify(contact, memberfilter);
                good[0] = JSON.parse(jsonText);
                wx.setStorageSync('goods', JSON.stringify(good, memberfilter));
                _this.hideModal();
                this.setData({
                    carNum: ++this.data.carNum
                })
            }
        }
    },

    orderNew: function() {
        // 立即购买
        var arr = selectSku(this, 1);
        if (arr) {
            var goods = {
                img: this.data.HomeThisImg,
                num: this.data.buyNumSelf,
                id: this.data.goodsId,
                name: arr.name,
                price: arr.price,
                valueSku: arr.valueSku,
                skuId: arr.id,
                tenantId: this.data.tenantId,
            };
            var goodsString = JSON.stringify(goods);
            wx.navigateTo({
                url: '/pages/find/pay/pay?goods=' + goodsString,
            })
        }
    },
    shoppingModal: function() {
        let self = this
        self.showModal()
        self.setData({
            shoppingModal: true
        })
    },
    toBuyModal: function() {
        let self = this
        self.showModal()
        self.setData({
            shoppingModal: false
        })
    },
    showModal: function() {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true,
            scrollState: true
        })
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    hideModal: function() {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false,
                scrollState: false
            })
        }.bind(this), 200)
    },

    buyNumSelfMinus: function() {
        let num = this.data.buyNumSelf;
        num--;
        if (num < 1) {

        } else {
            this.setData({
                buyNumSelf: num
            })
        }
    },
    buyNumSelfAdd: function() {
        let num = this.data.buyNumSelf;
        num++;
        if (num < 1) {

        } else {
            this.setData({
                buyNumSelf: num
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    /* 获取数据 */
    distachAttrValue: function(commodityAttr) {
        // 把数据对象的数据（视图使用），写到局部内  
        var attrValueList = this.data.attrValueList;
        // 遍历获取的数据  
        for (var i = 0; i < commodityAttr.length; i++) {
            for (var j = 0; j < commodityAttr[i].specs.length; j++) {
                var attrIndex = this.getAttrIndex(commodityAttr[i].specs[j].specName, attrValueList);
                if (attrIndex >= 0) {
                    // 如果属性值数组中没有该值，push新值；否则不处理  
                    if (!this.isValueExist(commodityAttr[i].specs[j].specValue, attrValueList[attrIndex].attrValues)) {
                        attrValueList[attrIndex].attrValues.push(commodityAttr[i].specs[j].specValue);
                    }
                } else {
                    attrValueList.push({
                        attrKey: commodityAttr[i].specs[j].specName,
                        attrValues: [commodityAttr[i].specs[j].specValue ? commodityAttr[i].specs[j].specValue : commodityAttr[i].specs[j].specName]
                    });
                }
            }
        }
        for (var i = 0; i < attrValueList.length; i++) {
            for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                if (attrValueList[i].attrValueStatus) {
                    attrValueList[i].attrValueStatus[j] = true;
                } else {
                    attrValueList[i].attrValueStatus = [];
                    attrValueList[i].attrValueStatus[j] = true;
                }
            }
        }
        this.setData({
            attrValueList: attrValueList
        });
    },
    getAttrIndex: function(attrName, attrValueList) {
        // 判断数组中的attrKey是否有该属性值 
        for (var i = 0; i < attrValueList.length; i++) {
            if (attrName == attrValueList[i].attrKey) {
                break;
            }
        }
        return i < attrValueList.length ? i : -1;
    },
    isValueExist: function(value, valueArr) {
        // 判断是否已有属性值  
        for (var i = 0; i < valueArr.length; i++) {
            if (valueArr[i] == value) {
                break;
            }
        }
        return i < valueArr.length;
    },
    /* 选择属性值事件 */
    selectAttrValue: function(e) {
        var attrValueList = this.data.attrValueList;
        var index = e.currentTarget.dataset.index; //属性索引  
        var key = e.currentTarget.dataset.key;
        var value = e.currentTarget.dataset.value;
        if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
            if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
                // 取消选中  
                this.disSelectValue(attrValueList, index, key, value);
            } else {
                // 选中  
                this.selectValue(attrValueList, index, key, value);
            }

        }
    },
    /* 选中 */
    selectValue: function(attrValueList, index, key, value, unselectStatus) {
        var includeGroup = [];
        if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选
            var commodityAttr = this.data.commodityAttr;
            // 其他选中的属性值全都置空  
            for (var i = 0; i < attrValueList.length; i++) {
                for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                    attrValueList[i].selectedValue = '';
                }
            }
        } else {
            var commodityAttr = this.data.includeGroup;
        }
        for (var i = 0; i < commodityAttr.length; i++) {
            for (var j = 0; j < commodityAttr[i].specs.length; j++) {
                if (commodityAttr[i].specs[j].specName == key && (commodityAttr[i].specs[j].specValue ? commodityAttr[i].specs[j].specValue : commodityAttr[i].specs[j].specName) == value) {
                    includeGroup.push(commodityAttr[i]);
                }
            }
        }
        attrValueList[index].selectedValue = value;
        // 判断属性是否可选  
        for (var i = 0; i < attrValueList.length; i++) {
            for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                attrValueList[i].attrValueStatus[j] = false;
            }
        }
        for (var k = 0; k < attrValueList.length; k++) {
            for (var i = 0; i < includeGroup.length; i++) {
                for (var j = 0; j < includeGroup[i].specs.length; j++) {
                    if (attrValueList[k].attrKey == includeGroup[i].specs[j].specName) {
                        for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
                            if (attrValueList[k].attrValues[m] == includeGroup[i].specs[j].specValue) {
                                attrValueList[k].attrValueStatus[m] = true;
                            }
                        }
                    }
                }
            }
        }
        this.setData({
            attrValueList: attrValueList,
            includeGroup: includeGroup
        });
        var count = 0;
        for (var i = 0; i < attrValueList.length; i++) {
            for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                if (attrValueList[i].selectedValue) {
                    count++;
                    break;
                }
            }
        }
        if (count < 2) {
            // 第一次选中，同属性的值都可选  
            this.setData({
                firstIndex: index
            });
        } else {
            this.setData({
                firstIndex: -1
            });
        }
        selectSku(this, 0)
    },
    /* 取消选中 */
    disSelectValue: function(attrValueList, index, key, value) {
        var commodityAttr = this.data.commodityAttr;
        attrValueList[index].selectedValue = '';
        // 判断属性是否可选  
        for (var i = 0; i < attrValueList.length; i++) {
            for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
                attrValueList[i].attrValueStatus[j] = true;
            }
        }
        this.setData({
            includeGroup: commodityAttr,
            attrValueList: attrValueList
        });

        for (var i = 0; i < attrValueList.length; i++) {
            if (attrValueList[i].selectedValue) {
                this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
            }
        }
    },
})

function getSku(that, id) {
    var url = API.goodsDetail + id + '/sku'
    app.fetchGet(url, (err, data) => {
        if (data.resultCode == 100) {
            var productDeatil = {
                img: that.data.HomeThisImg,
                price: data.resultContent[0].price,
                name: data.resultContent[0].name,
                valueSku: '请选择属性',
                remainingQuantity: data.resultContent[0].remainingQuantity
            }
            that.setData({
                includeGroup: data.resultContent,
                commodityAttr: data.resultContent,
                productDeatil: productDeatil
            });
            that.distachAttrValue(data.resultContent);
            // 只有一个属性组合的时候默认选中  
            if (data.resultContent.length == 1) {
                for (var i = 0; i < data.resultContent[0].specs.length; i++) {
                    that.data.attrValueList[i].selectedValue = data.resultContent[0].specs[i].specValue ? data.resultContent[0].specs[i].specValue : data.resultContent[0].specs[i].specName;
                }
                var productDeatil = {
                    img: that.data.HomeThisImg,
                    price: data.resultContent[0].price,
                    name: data.resultContent[0].name,
                    valueSku: that.data.attrValueList[0].selectedValue,
                    remainingQuantity: data.resultContent[0].remainingQuantity
                }
                that.setData({
                    attrValueList: that.data.attrValueList,
                    productDeatil: productDeatil
                });
            }
        }
    })
}
// 错误提示
function ErrorTips(that, str) {
    that.setData({
        popErrorMsg: str
    })
    hideErrorTips(that);
}

function hideErrorTips(that) {
    var fadeOutTimeout = setTimeout(() => {
        that.setData({
            popErrorMsg: '',
        });
        clearTimeout(fadeOutTimeout);
    }, 2000);
}


function pushSku(valArr, arr) {
    let a = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].specs.length; j++) {
            if (valArr === arr[i].specs[j].specValue) {
                a.push(arr[i]);
            }
        }
    }
    return a;
}

function selectSku(that, num) {
    var value = [];
    let a = [];
    for (var i = 0; i < that.data.attrValueList.length; i++) {
        if (!that.data.attrValueList[i].selectedValue) {
            break;
        }
        value.push(that.data.attrValueList[i].selectedValue);
    }
    if (i < that.data.attrValueList.length) {
        if (num === 1) {
            ErrorTips(that, '请完善属性');
        }
    } else {
        var commodityAttr = that.data.commodityAttr;
        switch (value.length) {
            case 1:
                for (var i = 0; i < commodityAttr.length; i++) {
                    if (commodityAttr[i].specs[0].specValue) {
                        if (value[0] === commodityAttr[i].specs[0].specValue) {
                            a = [];
                            a.push(commodityAttr[i]);
                        }
                    } else {
                        a = [];
                        a.push(commodityAttr[i]);
                    }
                }
                break;
            case 2:
                a = pushSku(value[1], pushSku(value[0], commodityAttr));
                break;
            case 3:
                a = pushSku(value[2], pushSku(value[1], pushSku(value[0], commodityAttr)));
                break;
            case 4:
                a = pushSku(value[3], pushSku(value[2], pushSku(value[1], pushSku(value[0], commodityAttr))));
                break;
            case 5:
                a = pushSku(value[4], pushSku(value[3], pushSku(value[2], pushSku(value[1], pushSku(value[0], commodityAttr)))));
                break;
            case 6:
                a = pushSku(value[5], pushSku(value[4], pushSku(value[3], pushSku(value[2], pushSku(value[1], pushSku(value[0], commodityAttr))))))
                break;
        }
        a[0].valueSku = value.join('，');
        var productDeatil = {
            img: that.data.HomeThisImg,
            price: a[0].price,
            name: a[0].name,
            valueSku: value.join('，'),
            remainingQuantity: a[0].remainingQuantity
        }
        that.setData({
            productDeatil: productDeatil
        })
    }
    if (a[0] && !a[0].remainingQuantity) {
        ErrorTips(that, '库存不足');
    } else {
        return a[0];
    }

}