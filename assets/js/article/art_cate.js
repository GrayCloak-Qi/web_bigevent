$(function() {
    var layer = layui.layer
    var form = layui.form

    initArtCateList();

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    // 添加类别按钮绑定事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        });
    })


    // 通过代理的方式,为form-add绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList();
                layer.msg('新增分类成功！');
                layer.close(indexAdd);
            }
        })
    })


    var indexEdit = null;
    // 通过代理的方式,为btn-edit绑定 点击事件
    $('tbody').on('click', '.btn-edit', function() {

        // 弹出修改层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        });

        var id = $(this).attr('data-id');
        // 发起ajax
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    })


    // 通过代理的方式，为修改分类榜单绑定 submit事件

    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败!')
                }
                layer.msg('更新分类数据成功!');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })


    // 通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');

        // 提示框是否删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {


            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    layer.close(index);
                    initArtCateList();
                }
            })

        });
    })
})