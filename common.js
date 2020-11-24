// 登陆之后所有后台的接口发送请求都需要:
//      url配置根路径
//      设置请求头headers: { authorization: localStorage.getItem('token') }
//      设置请求完成complete,验证token


// 所有请求都要经过Ajax提前过滤
// 在所有html页面中引入这个common.js文件
// data是每次ajax请求前的配置项(对象)
// 在这里对每次请求前的配置项进行优化配置
$.ajaxPrefilter(function (data) {
    // console.log(data);
    // 1.url根路径拼接
    var base = 'http://ajax.frontend.itheima.net';
    data.url = base + data.url;

    // 2.所有通过 /my 接口路径的请求设置请求头和complete
    if (data.url.includes('/my/')) {
        data.headers = {
            Authorization: localStorage.getItem('token')
        }
        // 3.请求完成complete
        data.complete = function (xhr) {
            // 返回jq封装后的xhr对象
            var res = xhr.responseJSON; //返回的数据
            // 状态码为1说明token过期，删除过期的token并跳转到登陆页面
            if (res.status == 1) {
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        }
    };
})