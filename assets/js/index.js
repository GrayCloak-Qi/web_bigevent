$(function() {

    // 调用 getUserInfo 获取基本信息
    getUserInfo();

    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {

            //1.清空本地存储的token
            localStorage.removeItem('token');
            //2.返回登录界面
            location.href = '/login.html';
            // 关闭弹出层
            layer.close(index);
        })
    })
})



// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用函数渲染用户头像
            renderAvatar(res.data);
        },
        // 无论成功还是失败，最终都会调用函数
        // complete: function(res) {
        //     // 在 complete 回调函数中, 用 res.responseJSON 拿到服务器响应的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 1.强制清空 token 
        //         localStorage.removeItem("token");
        //         // 2.强制跳转到login.html
        //         location.href = '/login.html';
        //     }
        // }
    })
}


// 渲染用户头像函数
function renderAvatar(user) {
    // 获取用户昵称
    var name = user.nickname || user.username;
    // 设置欢迎文本
    $("#welcome").html('欢迎&nbsp&nbsp' + name);
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show();
    }

}