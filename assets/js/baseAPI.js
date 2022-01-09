// 每次调用 get post ajax 的时候都会先调用这个函数

// 在这个函数中,可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    console.log(options.url);

    // 在发起请求之前拼接好根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
});