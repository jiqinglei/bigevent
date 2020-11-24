// 获取用户信息------------------------------------------------------
var form = layui.form;

function getinfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            layer.msg(res.message)
            if (res.status == 0) {
                // 三个输入框赋值
                // var data = res.data;
                // $('input[name="username"]').val(data.username)

                // layui快速赋值方法:lay-filter='';
                form.val('user', res.data)
            }
        }
    })
}
getinfo();

// 修改用户信息-----------------------------------------------------
// 后台接口需要我们提交带id的用户数据，id存放在input隐藏域中
// username标签设置了disabled属性，serialize不会收集这条数据
$('form').on('submit', function (e) {
    e.preventDefault();
    // 收集数据
    var params = $(this).serialize();
    // 发送请求
    $.ajax({
        type: 'post',
        url: '/my/userinfo',
        data: params,
        success: function (res) {
            console.log(res);
            layer.msg(res.message)
            if (res.status == 0) {
                // iframe中修改完成，index页面中也需要更新用户信息
                // 由于iframe的嵌套关系,userinfo.js顶级对象window和index.js顶级对象window属于父子关系
                // 通过window.parent.get()调用index中的方法让index更新信息
                window.parent.get()
            }
        }
    })
})

// 用户信息重置----------------------------------------------------
$('.myreset').on('click', function (e) {
    e.preventDefault();
    // 重置就是重新获取并填充原来的用户信息
    getinfo();
})