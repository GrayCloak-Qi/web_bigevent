// 每次调用 get post ajax 的时候都会先调用这个函数

// 在这个函数中,可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起请求之前拼接好根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 统一为又权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }

    // 全局统一挂载 complete 函数
    options.complete = function(res) {
        // 在 complete 回调函数中, 用 res.responseJSON 拿到服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.强制清空 token 
            localStorage.removeItem("token");
            // 2.强制跳转到login.html
            location.href = '/login.html';
        }
    }
});