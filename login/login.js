// 登录框与注册框切换-----------------------------------------
$('#goto-register').on('click', function () {
    $('#login').hide().siblings('#register').show()
})
$('#goto-login').on('click', function () {
    $('#register').hide().siblings('#login').show()
})

// 注册------------------------------------------------------
$('#register form').on('submit', function (e) {
    // 阻止默认跳转
    e.preventDefault();
    // 收集数据
    var data = $(this).serialize();
    // 发送请求:接口文档
    $.ajax({
        type: 'post',
        url: '/api/reguser', //common.js配置url
        data: data,
        success: function (res) {
            // layui弹框提示信息
            layer.msg(res.message)
            // 注册成功
            if (res.status == 0) {
                // 清空输入框:原生reset()方法
                $('#register form')[0].reset();
                // 切换到登录框
                $('#register').hide().siblings('#login').show()
            }
        }
    })
})
// 表单正则验证:layui自带的verify
var form = layui.form;
form.verify({
    pwlength: [/^\S{6,12}$/, '密码格式/长度错误'],
    // 密码一致验证
    same: function (val) {
        if ($('#pwd').val() != val) {
            return '两次输入的密码不一致!';
        }
    }
})

// 登陆--------------------------------------------------------
$('#login form').on('submit', function (e) {
    // 阻止默认跳转
    e.preventDefault();
    // 收集数据
    var data = $(this).serialize();
    // 发送请求:接口文档
    $.ajax({
        type: 'post',
        url: '/api/login',
        data: data,
        success: function (res) {
            console.log(res);
            // layui弹框提示信息
            layer.msg(res.message)
            // 登陆成功
            if (res.status == 0) {
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        }
    })
})