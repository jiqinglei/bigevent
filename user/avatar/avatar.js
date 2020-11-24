// 调用cropper插件方法，创建剪裁区-------------------------------
$('#image').cropper({
    // 纵横比(宽高比)
    aspectRatio: 1, // 正方形
    // 指定预览区域
    preview: '.img-preview' // 指定预览区的类名（选择器）
});

// 点击'选择图片'按钮，触发隐藏的file上传文件按钮
$('.select').click(function () {
    $('#file').click();
});

// 1.file的change事件
$('#file').change(function () {
    // 选择文件对象
    var obj = this.files[0]
    // 2.URL内置对象: URL.createObjectURL(文件信息);创建一个文件的临时地址
    var url = URL.createObjectURL(obj);
    // 3.img标签已经被cropper包装占用，不能直接给src赋值,用cropper插件的replace方法
    $('#image').cropper('replace', url)
});

// 4.点击确定，上传选中的区域(cropper插件方法)
$('.confirm').click(function () {
    // 使用插件获取裁剪的canvas对象
    var canvas = $('#image').cropper('getCroppedCanvas', {
        width: 100,
        height: 100
    })
    // 把裁剪出的图片转码为base64格式字符串
    var base64 = canvas.toDataURL('image/png')
    // 提交请求
    $.ajax({
        type: 'post',
        url: '/my/update/avatar',
        data: {
            avatar: base64
        },
        success: function (res) {
            console.log(res);
            layer.msg(res.message)
            if (res.status == 0) {
                // 通过window.parent.get()调用index中的方法让index更新信息
                window.parent.get()
            };
        },
    });
})