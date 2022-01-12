$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(data) {
        const dt = new Date(data);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 时间补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 定义一个查询的参数对象,将来请求数据的时候,需要将请求参数对象提交到服务器


    var q = {
        pagenum: 1, //页码值 默认1
        pagesize: 2, //每页显示多少条数据, 默认2
        cate_id: '', //每页显示多少条数据
        state: '', //文章的状态，可选值有：已发布、草稿
    }

    initTable()
    initCate()


    // 获取文章列表数据的方法
    function initTable() {

        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                // 渲染数据
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }




    // 初始化文章分类的方法
    function initCate() {

        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res);
                // 渲染数据
                $('[ name=cate_id]').html(htmlStr);

                // 重新加载layui
                form.render();
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();

        // 获取表单选中项的值
        var cate_id = $('[name=cate_id]').val();
        var status = $('#status').val();

        // 为查询对象赋值
        q.cate_id = cate_id;
        q.status = status;

        // 重新渲染数据
        initTable()

    })



    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示数
            curr: q.pagenum, // 默认选中分页
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            // 分页发送切换，触发jump回调
            jump: function(obj, first) {
                // 最新页码值赋值
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 根据最新页码值重新渲染
                if (!first) {
                    initTable()
                }
            }
        });
    }




    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除元素个数
        var len = $('.btn-delete').length;
        console.log(len);

        // 获取选中元素id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')

                    // 判断当这一页的数据删除完成后，要让页码值 -1 再去请求
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    // 重新渲染数据
                    initTable()

                }
            })

            layer.close(index);



        });
    })

    // 点击编辑按钮获取id
    $("tbody").on("click", '.btn-edit', function() {

        var id = $(this).attr('data-id');
        localStorage.setItem('id', id);
        location.href = '/article/art_update.html';
    })

})