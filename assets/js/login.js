$(function() {

    //点击‘去注册账号’的链接跳转

    $("#link_reg").on("click", () => {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //点击‘登录’的链接跳转

    $("#link_login").on("click", () => {
        $('.reg-box').hide();
        $('.login-box').show();
    })


    // 从layui中获取form对象

    // 接收验证规则对象
    var form = layui.form;
    // 接收弹出层对象
    var layer = layui.layer

    // 通过 form.verify() 函数自定义校验规则

    form.verify({

        // 自定义了一个叫做 pwd 的校验规则

        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        // 校验两次密码是否一致

        repwd: function(value) {

            // 通过形参与密码值进行比较 判断不符弹出return

            var pwd = $('.reg-box [name=password]').val();

            if (pwd !== value) {
                return '两次密码不一致'
            }

        }
    })


    // 监听注册表单的提交事件

    $('#form_reg').on('submit', function(e) {

        // 阻止默认提交行为
        e.preventDefault();

        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            // 发起Ajax的POST请求

        $.post('/api/reguser', data, function(res) {

            if (res.status !== 0) {

                return layer.msg('注册失败：' + res.message);

            }

            layer.msg('注册成功请登陆');

            // 模拟点击登录案件
            $('#link_login').click();
        })
    })


    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {

        // 阻止默认提交行为
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {

                if (res.status !== 0) {

                    return layer.msg('登录失败：' + res.message);

                }
                layer.msg('登录成功');

                // 将登录成功得到的 token 字符串 ,保存到 localStorage 中
                localStorage.setItem('token', res.token)

                //跳到后台主页
                location.href = './index.html'
            }
        })
    })
})