//index.js
//获取应用实例
const app = getApp()
const util = require("../../utils/util.js")
const API = require('../../utils/api.js')

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        username: '', //登录用户名
        password: '', //登录密码
        showLogin: true,
        errorPasswordL: false, //登录密码错误显示状态
        errorPasswordR: false, //注册密码错误提示状态
        errorUserL: false, //登录用户名显示状态
        loginOn: false, //denglu按钮控制颜色状态
        registerOn: false, //zhuce按钮控制颜色状态
        showlogining: true, //登录或者注册，true为登录，false为注册
        userNameFocus: false, //登录用户名选中状态
        userPsdFocus: false, //登录密码选中状态
        userPsdFocusRe: false, //注册密码选中状态
        userCodeFocus: false, //注册验证码选中状态
        phoneError: "", //手机号码错误信息
        codeError: '', //验证码错误信息
        codeText: '获取验证码', //获取按钮字体信息
        nullData: false,
        CodeState: true, //验证码anniu状态
        BtnState: false, //验证码状态
        phoneState: false, //手机号码状态
        codeNum: '', //验证码
        phoneNumRE: '', //注册手机号码
        passwordRe: '', //注册密码
        phoneIptFocus: false, //手机号码选中显示状态
        codeFocus: false, //验证码选中显示状态
        loginBtnWrap: true,//是否显示修改密码
    },

    //事件处理函数
    onLoad: function(options) {
        console.log(options)
        var that = this
        util.globalDatas(app, that);
        if (options.route == 'register') {
            this.setData({
                showlogining: false
            })
            wx.setNavigationBarTitle({
                title: '注册'
            })
        }
    },
    getUserInfo: function(e) {
        util.userInfos(e, app, this)
    },
    // 登录逻辑
    formSubmitL: function(e) {
        let userName = this.data.username;
        let password = this.data.password;
        let self = this;
        if (userName.length == 0 && password.length == 0) {
            this.setData({
                nullData: true,
                errorPasswordL: true,
                errorUserL: true
            })
        } else if (password.length < 6 || password.length > 20) {
            if (password.length == 0) {
                this.setData({
                    errorPasswordL: true,
                    nullData: true
                })
            } else {
                this.setData({
                    errorPasswordL: true,
                    nullData: false
                })
            }
        } else if (userName.length == 0) {
            this.setData({
                errorUserL: true,
                nullData: true
            })
        } else {
            var unionId = wx.getStorageSync('unionid');
            console.log(unionId)
            if (self.data.hasUserInfo) {
                console.log("has userInfo")
                wx.showLoading({
                    title: '登录中',
                    mask: true,
                    success: function() {

                    }
                })
                var data = {
                    'ylUsername': userName,
                    'ylPassword': password,
                    'unionId': unionId
                }
                app.fetchPost(API.login, data, (err, res) => {
                    wx.hideLoading();
                    if (res.resultCode == '100') {
                        wx.showToast({
                            title: '登录成功',
                            icon: 'success'
                        })
                        wx.setStorageSync('username', userName);
                        wx.setStorageSync('password', password);
                        setTimeout(function() {
                            wx.reLaunch({
                                url: '/pages/user/user',
                            })
                        }, 1500)

                    } else if (res.resultCode == '02504037') {
                        wx.showModal({
                            title: '输入有误',
                            confirmColor: '#F45C43',
                            content: '用户名或密码错误，请重新输入。',
                            mask: true
                        })
                    } else if (res.resultCode == '02504036') {
                        wx.showToast({
                            title: '登录失败',
                            icon: 'loading'
                        })
                    } else {
                        wx.showToast({
                            title: '未知异常',
                            icon: 'loading'
                        })
                    }
                })
            }
        }
    },
    // 注册逻辑
    formSubmitR: function(e) {
        var unionId = wx.getStorageSync('unionid');
        if (this.data.BtnState && this.data.phoneState && this.data.registerOn) {
            var url = API.register;
            var data = {
                "unionId": unionId ? unionId : '',
                "ylUsername": this.data.phoneNumRE,
                "ylPassword": this.data.passwordRe,
                "vcode": this.data.codeNum
            }
            app.fetchPost(url, data, (err, res) => {
                console.log(res)
                if (res.resultCode == '02504022') {
                    this.setData({
                        codeError: res.resultCode
                    })
                } else if (res.resultCode == '02504038') {
                    this.setData({
                        errorPasswordR: true
                    })
                } else if (res.resultCode == '02504036') {

                } else if (res.resultCode == '100') {
                    let _this = this;
                    wx.showToast({
                        title: '即将跳转到登录页...',
                        icon: 'success',
                        success: function(res) {
                            setTimeout(function() {
                                _this.goToLogin();
                            }, 1000)
                        }
                    })
                } else {
                    console.log('未知异常')
                }
            })
        } else if (!this.data.phoneState) {
            this.setData({
                phoneError: '手机号码错误'
            })
        } else if (!this.data.BtnState) {
            this.setData({
                codeError: '验证码错误'
            })
        }
    },
    // 登录注册跳转开始
    goToLogin: function() {
        this.setData({
            showlogining: true,
            registerOn: false,
            loginOn: false,
            loginBtnWrap: true
        })
        wx.setNavigationBarTitle({
            title: '登录'
        })
    },
    goToRegist: function(e) {
        this.setData({
            showlogining: false,
            registerOn: false,
            loginOn: false
        })
        wx.setNavigationBarTitle({
            title: '注册'
        })
    },
    // 忘记密码
    forgetPassword: function() {
        this.setData({
            loginBtnWrap: false,
            showlogining: false,
            registerOn: false,
            loginOn: false
        })
        wx.setNavigationBarTitle({
            title: '修改密码'
        })
    },
    //登录注册跳转结束

    // 登录用户名逻辑开始
    userNameFocusL() {
        this.setData({
            userNameFocus: true
        })
    },
    userNameBlurL() {
        //处理接口，检测用户名是否可用
        this.setData({
            userNameFocus: false
        })
    },
    hideErrorUserL: function(e) {
        this.setData({
            errorUserL: false,
            username: e.detail.value
        })
    },
    // 登录用户名逻辑结束 
    // 登录密码逻辑开始
    userPsdFocusL() {
        this.setData({
            userPsdFocus: true
        })
    },
    userPsdBlurL() {
        this.setData({
            userPsdFocus: false
        })
    },
    hideErrorL: function(e) {
        this.setData({
            errorPasswordL: false,
            password: e.detail.value
        })
        if (e.detail.value.length >= 6) {
            this.setData({
                loginOn: true
            })
        } else {
            this.setData({
                loginOn: false
            })
        }
    },
    // 登录密码逻辑结束

    // 注册密码逻辑开始
    userPsdFocusR() {
        this.setData({
            userPsdFocusRe: true
        })
    },
    userPsdBlurR() {
        this.setData({
            userPsdFocusRe: false
        })
    },
    hideErrorR: function(e) {
        this.setData({
            errorPasswordR: false,
            passwordRe: e.detail.value
        })
        if (e.detail.value.length >= 6 && this.data.BtnState && this.data.phoneState) {
            this.setData({
                registerOn: true
            })
        } else {
            this.setData({
                registerOn: false
            })
        }
    },
    // 注册密码逻辑结束
    // 手机号码逻辑开始
    phoneIpt(e) {
        var phoneNum = e.detail.value;
        var sMobile = /^1[3|4|5|7|8][0-9]\d{8}$/;
        // console.log(phoneNum)
        if (sMobile.test(phoneNum)) {
            this.setData({
                phoneError: '',
                phoneState: true,
                CodeState: false,
                phoneNumRE: phoneNum
            })
        } else if (phoneNum.length == 11) {
            this.setData({
                phoneError: '手机号码有误',
                phoneState: false,
                CodeState: true
            })
        } else {
            this.setData({
                phoneError: '',
                phoneState: false,
                CodeState: true
            })
        }
    },
    phoneFocus() {
        this.setData({
            phoneIptFocus: true
        })
    },
    phoneBlur() {
        this.setData({
            phoneIptFocus: false
        })
    },
    // 手机号码逻辑结束

    // 验证码逻辑开始
    //处理接口,获取验证码
    getCode(e) {
        var total_micro_second = 60 * 1000; //表示60秒倒计时，想要变长就把60修改更大
        //验证码倒计时
        // console.log(this.data.phoneNumRE)
        count_down(this, total_micro_second);
        var url = API.getPhoneCode + this.data.phoneNumRE;
        app.fetchGet(url, (err, res) => {
            if (res.resultCode == 100) {
                console.log('请求成功');
            }
        })

    },
    codeIpt(e) {
        var codeNum = e.detail.value;
        this.setData({
            codeNum: codeNum
        })
        if (codeNum.length == 6 && this.data.phoneState) {
            this.setData({
                BtnState: true,
                codeError: ''
            })
        } else {
            this.setData({
                BtnState: false
            })
        }
    },
    codeFocus() {
        this.setData({
            codeFocus: true
        })
    },
    codeBlur() {
        this.setData({
            codeFocus: false
        })
    },
    // 验证码逻辑结束

})

/* 毫秒级倒计时 */
function count_down(that, total_micro_second) {
    if (total_micro_second <= 0) {
        that.setData({
            codeText: "重新发送",
            CodeState: false
        });
        // timeout则跳出递归
        return;
    }

    // 渲染倒计时时钟
    that.setData({
        codeText: "等待(" + date_format(total_micro_second) + "s)",
        CodeState: true
    });

    setTimeout(function() {
        // 放在最后--
        total_micro_second -= 10;
        count_down(that, total_micro_second);
    }, 10)

}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
    // 毫秒位，保留2位
    var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

    return sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
}