// const ORIGIN_NAME='https://cloud.gemii.cc/lizcloud/api' //生产环境
const ORIGIN_NAME = 'http://dev.gemii.cc:58080/lizcloud/api' //开发模式
const DEV_NAME = 'http://192.168.0.51:30072' //开发模式

const USER_LOGIN = ORIGIN_NAME + '/basis-api/noauth/' //授权绑定，用户登录1
const TOKRN = ORIGIN_NAME + '/uaa/oauth/token?' //获取token
const GOODS_NAME = '/e-goods-api/noauth' //商品
const GOOD_CAR = ORIGIN_NAME + '/e-purchase-api/authsec/shopping/' //购物车
const ROBOT = ORIGIN_NAME + '/groupadmin-api/authsec/groupadmin' //机器人群管理

const api = {
    authLogin: USER_LOGIN + 'wdwd/loadUserAuthorizeWechat', //获取unionID
    postUserInfo: USER_LOGIN + 'wdwd/loadUserAuthorizeWechat', //提交用户标识
    getToken: TOKRN + 'grant_type=password&password=&username=', //获取token
    refreshToken: TOKRN + 'grant_type=refresh_token&refresh_token=', //刷新token
    getPhoneCode: USER_LOGIN + 'usermgmt/youli/sendPhoneCode?_phone=', //获取手机验证码
    register: USER_LOGIN + 'wdwd/registerYlUser', //注册,
    login: USER_LOGIN + 'wdwd/bandGemiiUser', //登录
    goodsClassify: ORIGIN_NAME + GOODS_NAME + '/good/categorys', //商品分类
    goodsDetail: ORIGIN_NAME + GOODS_NAME + '/good/', //商品详情//商品sku
    goodsNoes: ORIGIN_NAME + GOODS_NAME + '/goods', //商品列表
    shareGoods:ORIGIN_NAME+'/e-goods-api/authsec/tenant/good', //用户分享商品转换id
    payMoney: DEV_NAME+'/accountsys/authsec/wxpay/orderAndsign', //支付接口
    placeOrderAll: ORIGIN_NAME+'/e-purchase-sys/authsec/goods/order/submitorders', //提交订单购物车
    placeOrderOne: ORIGIN_NAME+'/e-purchase-api/authsec/goods/order/ime/submitorder', //提交订单直接购买
    getAdrId: DEV_NAME+'/e-fulfillment-sys/authsec/address/get', //获取地址id
    payMoney: DEV_NAME + '/accountsys/authsec/wxpay/orderAndsign', //支付接口
    wxRefund: DEV_NAME+'/accountsys/authsec/wxpay/wxRefund', //退款接口
    placeOrder: DEV_NAME + '/e-purchase-sys/authsec/goods/order/submitorders', //提交订单
    goodsStyle: GOOD_CAR + 'cart', //清空，加入，更新购物车信息
    getGoods: GOOD_CAR + 'carts', //获取购物车
    SECRET: "Basic bGl6LXlvdWxpLXd4OnNlY3JldA==", //base64加密liz-youli-wx:secret
    APP_ID: 'wx655b79f74ee85585', //APPID
    robotLast: ROBOT + '/tenant/requestorder/lastone?status=', //群管理：最后一次群申请
    robotQuota: ROBOT + '/tenant/group/thresholdAndactived', //群管理：租户额度
    robotBind: ROBOT + '/existgroup/robot/distribute', //群管理：绑定微信号
    robotId: ROBOT + '/robot/', //根据robotID查群机器人信息
    robotList: ROBOT + '/tenant/robot/summarys', //群列表
    delRobot: ROBOT + '/robot/group/', //删除群
    putGroup:ORIGIN_NAME+'/taskadmin-api/authsec/taskmgmt/task?force=',//绑定群投放
}

module.exports = api;