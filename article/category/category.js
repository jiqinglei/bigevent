// 初始化渲染列表---------------------------------------------------
function getList() {
  $.ajax({
    url: '/my/article/cates',
    success: function (res) {
      console.log(res);
      var arr = res.data;
      if (res.data.length != 0) {
        var str = "";
        $.each(arr, function (index, ele) {
          str += `<tr>
                    <td>${ele.name}</td>
                    <td>${ele.alias}</td>
                    <td>
                      <button myid="${ele.Id}" data-name="${ele.name}" data-alias="${ele.alias}" type="button" class="layui-btn layui-btn-xs edit">编辑</button>
                      <button myid="${ele.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger delete">删除</button>
                    </td>
                  </tr>`;
        });
        // 渲染到页面中
        $('tbody').html(str);
      }
    }
  })
}
getList();

// 新增操作--------------------------------------------------------
// 这里的新增弹窗用的是layui的弹窗插件
var add_str = `
  <form class="layui-form add-form" action="" style="margin: 30px; margin-left: 0px;" id="add_form">
    <div class="layui-form-item">
      <label class="layui-form-label">类别名称</label>
      <div class="layui-input-block">
        <input type="text" name="name" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">类别别名</label>
      <div class="layui-input-block">
        <input type="text" name="alias" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
      </div>
    </div>
  </form>`;

// 1.先点击添加按钮
$('.add').click(function () {
  // layui的弹窗
  layer.open({
    type: 1,
    title: '添加类别',
    content: add_str,
    area: ['500px', '250px'],
    // 2.等弹窗层创建完毕时
    success: function (layero, index) {
      // 2.再给form表单注册submit事件
      add_sub(index); //index作为layui关闭弹窗的值需要传入
    }
  });
})

// 防止出现回调地狱，对代码进行封装
function add_sub(i) {
  $('#add_form').on('submit', function (e) {
    e.preventDefault();
    // 获取表单数据
    var data = $(this).serialize();
    // 发送请求
    $.ajax({
      type: 'post',
      url: '/my/article/addcates',
      data,
      success: function (res) {
        layer.msg(res.message)
        if (res.status == 0) {
          // 添加成功，重新渲染列表
          getList();
          // 关闭弹窗
          layer.close(i)
        }
      }
    })
  })
}

// 删除按钮--------------------------------------------------------
// 事件委托
$('tbody').on('click', '.delete', function (e) {
  // 这里删除之后后台接口原因会把本地的token也删除，这时页面会跳转到登陆页
  // 发送请求之前先获取本地的token，待发送请求之后再把token添加到本地
  var mytoken = localStorage.getItem('token');
  // 获取每条数据绑定的id
  var id = $(e.target).attr('myid');
  // 优化:前两条数据不允许删除
  if (id == 1 || id == 2) {
    layer.msg('禁止删除此条数据')
  } else {
    $.ajax({
      url: '/my/article/deletecate/' + id,
      success: function (res) {
        layer.msg(res.message)
        if (res.status == 0) {
          // 删除成功,重新渲染
          localStorage.setItem('token', mytoken)
          getList();
        }
      }
    })
  }
})

// 编辑按钮-------------------------------------------------------
var edit_str = `
  <form class="layui-form add-form" action="" style="margin: 30px; margin-left: 0px;" id="edit_form" lay-filter="edit">
    <div class="layui-form-item">
      <label class="layui-form-label">类别名称</label>
      <div class="layui-input-block">
        <input type="text" name="name" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">类别别名</label>
      <div class="layui-input-block">
        <input type="text" name="alias" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <input type="hidden" name="Id">
    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn" lay-submit >确认修改</button>
      </div>
    </div>
  </form>`;

var form = layui.form;
// 事件委托
$("tbody").on("click", ".edit", function (e) {

  // 2.点击后，获取id值；
  var id = $(e.target).attr("myid");

  // 3.接口获取对应数据
  $.ajax({
    url: "/my/article/cates/" + id,
    success: function (res) {
      if (res.status == 0) {
        // 4.弹窗显示后
        layer.open({
          type: 1,
          title: '编辑类别',
          content: edit_str,
          area: ['500px', '250px'],
          // 层创建完毕时,里面有显示获取到数据
          success: function (layero, index) {
            // 5. layui.form
            //  5.1 去模板字符串里面新添加 type=hidden input;
            //  5.2 layui.form;  form表单上 lay-filter="edit"
            form.val("edit", res.data);
            // 6.注册提交事件
            edit_sub(index);
          }
        });
      }
    }
  })
});

// 6.给form注册提交事件
function edit_sub(numb) {
  $("#edit_form").on("submit", function (e) {
    e.preventDefault();
    // 6.1 获取数据
    var data = $(this).serialize();
    // 6.2 提交
    $.ajax({
      url: "/my/article/updatecate",
      type: "post",
      data: data,
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          // 添加成功，重新渲染列表
          getList();
          // 关闭弹出层
          layer.close(numb);
        }
      }
    })
  })
}