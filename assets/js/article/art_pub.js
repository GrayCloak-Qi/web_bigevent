$(function() {

    var layer = layui.layer;
    var form = layui.form;


    initCate();



    // 初始化富文本编辑器
    initEditor();


    // 定义文章加载分类的方法
    function initCate() {

        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                // 重新渲染让layui监听到事件
                form.render()
            }
        })
    }


    // 封面
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $("#coverFile").click();
    })


    // 监听 coverFile 的 change 事件，获取用户选择的文件路径
    $("#coverFile").on('change', function(e) {

        // 获取到文件列表的数组
        var files = e.target.files;

        if (files.length == 0) {
            return
        }
        // 图片的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 重新渲染
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    var art_state = '已发布';

    // 为存为草稿按钮绑定事件，更改status
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    })

    // 为表单绑定 submit 事件
    $("#form-pub").on('submit', function(e) {
        e.preventDefault();

        // 基于form表单快速创建 formdata 对象
        var fd = new FormData($(this)[0]);

        // 追加status对象属性
        fd.append('state', art_state);

        //将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 追加封面的url属性到formdata中
                fd.append('cover_img', blob);

                // 发起ajax 请求
                publishArticle(fd)

            });

    })



    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意： 如果向服务器提交的是 FormData 格式的数据
            // 需要多加两个参数
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功');
                // 发布成功跳转页面
                location.href = '/article/art_list.html'
            }
        })
    }

})