// 表单正则验证:layui自带的verify
var form = layui.form;
form.verify({
    // 1.新密码正则验证
    pwlength: [/^\S{6,12}$/, '密码长度错误'],
    // 2.新密码不能与旧密码一样
    diff: function (val) {
        if ($('.oldPwd').val() == val) {
            return '新密码与旧密码相同!';
        }
    },
    // 3.两次输入的新密码要一致
    same: function (val) {
        if ($('.newPwd').val() != val) {
            return '两次输入的密码不一致!';
        }
    }
})

// 点击提交
$('form').on('submit', function (e) {
    e.preventDefault();
    var params = $(this).serialize();
    $.ajax({
        type: 'post',
        url: '/my/updatepwd',
        data: params,
        success: function (res) {
            console.log(res);
            if (res.status == 1) {
                // 原密码输入错误:后台bug
                // layer.msg(res.message)
                alert(res.message)
            } else if (res.status == 0) {
                // 修改成功
                layer.msg(res.message)
                $('form')[0].reset();
            }
        },
    });
})