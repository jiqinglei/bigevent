// 判断本地存储是否有token，没有则跳转到登陆页面
if (!localStorage.getItem('token')) {
    location.href = '/login.html'
}

// 请求个人信息------------------------------------------------------
// 封装为函数，方便userinfo.js中调用
window.get(); //get()实际上是window在调用
function get() {
    $.ajax({
        // 不写type默认get方式
        url: '/my/userinfo',
        // 设置请求头:携带token(在common.js中配置)
        // headers: {
        //     authorization: localStorage.getItem('token'),
        // },
        success: function (res) {
            console.log(res);
            // 设置给用户名显示
            if (res.status == 0) {
                // 用户名显示昵称或用户名
                var name = res.data.nickname || res.data.username;
                $('.username').text(name)
                // 显示头像
                if (res.data.user_pic) {
                    $('.layui-nav-img').show().attr('src', res.data.user_pic).siblings('.avatar').hide();
                } else {
                    // 没有头像显示用户名第一个字
                    var t = name[0].toUpperCase(); //获取name第一个字并转大写
                    // show()会把元素变为行内元素
                    $('.avatar').show().css('display', 'inline-block').text(t).siblings('.layui-nav-img').hide()
                }
            }
        },
        // // 请求完成时调用:查看token是否过期
        // complete: function (xhr) {
        //     // 返回jq封装后的xhr对象
        //     var res = xhr.responseJSON; //返回的数据
        //     // 状态码为1说明token过期，删除过期的token并跳转到登陆页面
        //     if (res.status == 1) {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 退出登录------------------------------------------------------------
$('#logout').on('click', function () {
    // layui的弹框提示
    layer.confirm('是否确认退出?', {
        icon: 3,
        title: '退出'
    }, function (index) {
        // 确认退出时删除本地token并跳转到登录页面
        localStorage.removeItem('token')
        location.href = '/login.html'
        // 关闭当前弹窗
        layer.close(index)
    })
})