/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-07-29
 * 描述：数据列表插件
 */
//, "css!" + site.config.contextPath + "/assets/css/components/table.css"为了初始化在开始头部去加
define(["datatables.net-bs"], function () {
    var service = {
        renderColumns: {
            checkbox: {
                "name": "selector",
                "class": "center",
                "width": "40px",
                "orderable": false,
                "searchable": false,
                "title": '<label><input type="checkbox" name="selectall" class="ace row-selector" /><span class="lbl padding-0"></span></label>',
                "defaultContent": '<label><input type="checkbox" name="selector" class="ace row-selector" /><span class="lbl padding-0"></span></label>',
            },//复选框列

            radio: {
                "name": "selector",
                "class": "center",
                "orderable": false,
                "searchable": false,
                "width": "40px",
                "title": '选择',
                "defaultContent": '<label><input type="radio" name="selector" class="ace row-selector" /><span class="lbl padding-0"></span></label>'
            },//单选框列

            move: {
                "name": "move",
                "title": "排队",
                "orderable": false,
                "searchable": false,
                "width": "40px",
                "class": "center move",
                "defaultContent": "<label><i class=\"glyphicon glyphicon-move icon-move\"></i></label>"
            }
        }, //默认渲染的列
        defaults: {
            //"autoWidth": true,//控制Datatables是否自适应宽度| 默认为：true
            "lengthMenu": [10, 25, 50, 100, 200, 500],
            "processing": false, //是否显示正在处理的状态| 默认为：false
            "deferRender": true, //控制Datatables的延迟渲染，可以提高初始化的速度| 默认为：false
            "pagingType": "full_numbers", //分页按钮的显示方式
            "info": true, // 控制是否显示表格左下角的信息| 默认为：true
            //"ordering": false,//是否允许DataTables排序。禁止或者启用单个列的排序功能，可以通过该列的columns.orderableDT选项来实现。| 默认为：true
            "dom": 'rt<"row tables-footer"<"col-sm-6"il><"col-sm-6 pages hide"p>><"clear">',
            "paging": true,//是否允许表格分页。
            "scrollX": true, //设置水平滚动| 默认为：false
            "scrollCollapse": true, //当显示更少的记录时，是否允许表格减少高度
            //"scrollY": 300, //设置垂直滚动
            //"scrollCollapse": true,
            "searching": false, //是否允许Datatables开启本地搜索| 默认为：true
            "serverSide": true, //开启Datatables服务器模式
            "stateSave": !site.config.isDebug, //状态保存 - 再次加载页面时还原表格状态,开发阶段不要保存状态
            //"buttons": [{ extend: 'colvis', text: '显示/隐藏列' }], //
            "select": {
                style: "single",
                info: false
            },
            order: [],
            "initComplete": function () {
                var api = this.api();
                //console.info(api.tables().containers());
            },//初始化
            "infoCallback": function (settings, start, end, max, total, pre) {
                var api = this.api(), $pagesEL = $(api.tables().containers()).find(".tables-footer > .pages");
                if (api.page.len() > max) {
                    $pagesEL.addClass("hide");
                } else {
                    $pagesEL.removeClass("hide");
                }
                return pre;
            },
            fixedHeader: true,
            colReorder: {
                realtime: false, //启用和配置数据表的colreorder延伸
            }, //允许用户通过下拉或者拖拽列头修改列的排列顺序 //修复BUG-2016-09-18：在dataTables.colReorder.js中如果列中加入createdCell函数通过ajax调用会被直接覆盖！
            //    		"fixedColumns": {leftColumns: 1}, //提供列冻结的功能，比如用户始终能看到索引列，而右边的表格通过滚动条横向拖动。
            "responsive": !site.utils.isPc, //自动适应屏幕的功能
            "rowReorder": false, //提供给用户能够重新排列行的功能（点击拖动/鼠标接触拖动）。与Editor集成，可以多行编辑后直接保存更新后的数据。
            "language": {
                "decimal": ",",
                "processing": "处理中...",
                "lengthMenu": "每页 _MENU_ 条",
                "zeroRecords": "对不起，查询不到任何相关数据",
                "emptyTable": "未有相关数据",
                "loadingRecords": "正在加载数据-请等待...",
                "info": "共 _TOTAL_ 行　 _PAGE_ / _PAGES_页",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "infoPostFix": "",
                "infoThousands": ",",
                "search": "搜索",
                "paginate": {
                    "first": "首页",
                    "previous": "上页",
                    "next": "下页",
                    "last": "末页"
                },
                "aria": {
                    "sortAscending": "以升序排列此列",
                    "sortDescending": "以降序排列此列"
                }
            }
        },

        initColumnOptions: function (columnOptions, _this) {
            if (!columnOptions || columnOptions.length < 1) {
                return columnOptions;
            }
            var _colvis_columns = [];
            for (var i = 0, j = columnOptions.length; i < j; i++) {
                if (typeof (columnOptions[i]) === "string" && service.renderColumns[columnOptions[i]]) {
                    var _type = columnOptions[i];
                    columnOptions[i] = $.extend({}, service.renderColumns[columnOptions[i]]);
                    columnOptions[i].name = columnOptions[i].name;
                    if (_type === "move") {
                        _this.options.rowReorder = $.extend(true, { selector: "td.move" }, _this.options.rowReorder || {});
                    } else if (!_this.options.select && _type === "radio") {
                        _this.options.select = {
                            style: "single",
                            info: false
                        };
                    } else if ((!_this.options.select || typeof (_this.options.select) != "object" || _this.options.select.style != "multi") && _type === "checkbox") {
                        _this.options.select = {
                            style: "multi",
                            info: false
                        };
                    }
                    _this.columnType = _this.columnType || {};
                    _this.columnType[_type] = {
                        index: i,
                        name: columnOptions[i].name
                    };
                    continue;
                }
                //默认初始化column的data和name
                if (columnOptions[i] && columnOptions[i].data && !columnOptions[i].name) {
                    columnOptions[i].name = columnOptions[i].data;
                } else if (columnOptions[i] && !columnOptions[i].data && columnOptions[i].name) {
                    columnOptions[i].data = columnOptions[i].name;
                }
                _colvis_columns.push(i);
                if (columnOptions[i].orderable !== true) {
                    columnOptions[i].orderable = false;
                }
                if (columnOptions[i].editable) {
                    //会取代createdCell方法
                    columnOptions[i]._createdCell = columnOptions[i].createdCell;
                    columnOptions[i].createdCell = function (cell, cellData, rowData, rowIndex, colIndex) {
                        service.createdEditableCell(cell, cellData, rowData, rowIndex, colIndex, _this);
                    }
                }
            }
            //处理colvis显示列中需要隐藏的,比如：checkbox的列
            if (_this.options.buttons && _colvis_columns.length > 0) {
                for (var i = 0, j = _this.options.buttons.length; i < j; i++) {
                    if (_this.options.buttons[i].extend === "colvis" && !_this.options.buttons[i].columns) {
                        _this.options.buttons[i].columns = _colvis_columns;
                        break;
                    }
                }
            }
            return columnOptions;
        },

        //创建编辑的单元格 |需要bootstrap-editab插件
        createdEditableCell: function (cell, cellData, rowData, rowIndex, colIndex, _this) {
            var field = _this.table.column(colIndex).dataSrc(), _column = service.getColumnByData(field, _this.options.columns);
            if (!_column || typeof (_column) != "object") {
                return;
            }
            if ($.isFunction(_column._createdCell)) {
                _column._createdCell(cell, cellData, rowData, rowIndex, colIndex);
            }
            require([site.config.contextPath + "/scripts/bootstrap-editable.js", "rcss!" + site.config.contextPath + "/content/bootstrap/bootstrap-editable.css"], function () {
                var $td = $(cell);
                $td.wrapInner('<a href="javascript:void(0)"' + ' data-name="' + field + '"' + ' data-value="' + cellData + '">' + '</a>');
                var $a = $td.children();
                //与select组件的事件有冲突
                $a.editable().on('save', function (e, params) {
                    if (_this.options.onEditableSave && $.isFunction(_this.options.onEditableSave)) {
                        _this.options.onEditableSave($a, params, rowData, rowIndex, e);
                    } else {
                        rowData[field] = params.submitValue;
                    }
                });
            });
        },

        getColumnByData: function (data, columns) {
            if (!data || !columns || columns.length == 0) {
                return null;
            }
            for (var i = 0, j = columns.length; i < j; i++) {
                if (typeof (columns[i]) == "object" && columns[i].data == data) {
                    return columns[i];
                }
            }
            return null;
        },

        ajax: function (options, _this) {
            var conf = $.extend({}, options);
            return function (request, drawCallback, settings) {
                var parmetersData = _this.getFilterParams();
                if (_this.options.paging) {
                    parmetersData.maxResultCount = (request.length || 0) < 0 ? 10 : request.length;
                    parmetersData.skipCount = request.start;
                }
                parmetersData.draw = request.draw || 0;
                //parmetersData.search = request.search.value;
                if (request.order && request.order.length > 0) {
                    var sorting = [];
                    for (var i = 0; i < request.order.length; i++) {
                        var columnName = request.columns[request.order[i].column].data;
                        if (columnName) {
                            if (request.order[i].dir == "desc") {
                                columnName += " desc";
                            }
                            sorting.push(columnName);
                        }
                    }
                    if (sorting.length > 0) {
                        parmetersData.sorting = sorting.join(",");
                    }
                }
                if ($.isFunction(conf.data)) {
                    $.extend(true, parmetersData, conf.data(request));
                } else if (typeof (conf.data) === "object") {
                    $.extend(true, parmetersData, conf.data);
                }
                var _conf = $.extend(true, {}, options);
                _conf.data = parmetersData;
                var _successFun = options.success;
                _conf.success = function (data, status, xhr) {
                    if ($.isFunction(_successFun)) {
                        _successFun(data, status, xhr);
                    }
                    parmetersData.draw = request.draw || 0;
                    if ($.isFunction(conf.responseHandler)) {
                        drawCallback(conf.responseHandler(data, parmetersData));
                    } else {
                        if (typeof (data) === "string") {
                            data = JSON.parse(data);
                        }
                        var json = {
                            draw: parmetersData.draw,
                            data: data.pageData || [],
                            recordsTotal: data.pageCount || data.pageData.length,
                            recordsFiltered: data.pageCount || data.pageData.length
                        };
                        drawCallback(json);
                    }
                }
                site.ajax(_conf);
            }
        },

        getRequireModules: function (options) {
            var require_modules = [];
            if (options.buttons) {
                require_modules.push("datatables.net-buttons");
                //require_modules.push(site.config.contextPath + "/scripts/dataTables/extensions/buttons.bootstrap.js");
                require_modules.push("datatables.net-buttons.colVis");
                //require_modules.push("css!" + site.config.contextPath + "/content/dataTables/extensions/buttons.bootstrap.css");
            }
            if (options.colReorder) {
                require_modules.push("datatables.net-colReorder");
            }
            if (options.fixedColumns) {
                require_modules.push("datatables.net-fixedColumns");
                //    			require_modules.push("css!" + site.config.contextPath + "/assets/content/dataTables/extensions/fixedColumns.dataTables.css");
            }
            if (options.responsive) {
                require_modules.push("datatables.net-responsive.bootstrap");
            }
            if (options.rowReorder) {
                require_modules.push("datatables.net-rowReorder");
            }
            if (options.select) {
                require_modules.push("datatables.net-select");
                //require_modules.push("css!" + site.config.contextPath + "/assets/content/dataTables/extensions/select.bootstrap.css");
            }
            if (options.fixedHeader) {
                require_modules.push("datatables.net-fixedHeader");
            }
            return require_modules;
        },

        initButtons: function (table, buttons, buttonContainers) {
            if (!buttons) {
                return;
            }
            if (!buttonContainers) {
                buttonContainers = ".buttons-panel";
            }
            new $.fn.dataTable.Buttons(table, buttons);
            if ($(buttonContainers).length < 1) {
                //没有就插入到datatables组件的上面
                table.buttons().container().prependTo(table.table().container())
            } else {
                table.buttons().container().appendTo($(buttonContainers));
            }
        },

        bindEvent: function (_this) {
            if (_this.columnType) {
                if (_this.columnType["checkbox"] || _this.columnType["radio"]) {
                    _this.table.on("select", function (e, dt, type, indexes) {
                        for (var i = 0, j = indexes.length; i < j; i++) {
                            $(dt.cell(indexes[i], "selector:name").node()).find("input[name='selector']").prop("checked", true);
                        }
                    });
                    _this.table.on("deselect", function (e, dt, type, indexes) {
                        for (var i = 0, j = indexes.length; i < j; i++) {
                            $(dt.cell(indexes[i], "selector:name").node()).find("input[name='selector']").prop("checked", false);
                        }
                    });
                }
                if (_this.columnType["move"] && $.isFunction(_this.options.onRowReorder)) {
                    _this.table.on("row-reorder", function (e, diff, edit) {
                        _this.options.onRowReorder(e, diff, edit);
                    });
                }
                if (_this.columnType["checkbox"]) {
                    $(_this.table.tables().header()).find("[name=selectall][type=checkbox]").click(function (e) {
                        if ($(this).prop("checked")) {
                            _this.selectAll();
                        } else {
                            _this.deselectAll();
                        }
                    });
                }
            }
            //过滤表单事件绑定
            var filterSelector = _this.filterSelector;
            if (!filterSelector) {
                filterSelector = '#filter-panel';
            }
            var $filter = $(filterSelector), $buttonsPanel = $(".buttons-panel");
            if ($filter.length > 0) {
                // 条件过滤栏中控件的值改变时重新加载列表数据
                // 修改事件绑定方式
                $filter.find('select[filterField]:not([autopostback="false"]), input[type=text][filterField]:not([autopostback="false"])').change(function () {
                    // 搜索默认是跳转到第一页
                    _this.refresh(true);
                });
                $filter.on("click", 'input[type="radio"][filterField]:not([autopostback="false"]),input[type="checkbox"][filterField]:not([autopostback="false"])', function (events) {
                    // 搜索默认是跳转到第一页
                    _this.refresh(true);
                });
                /**控制条件筛选中的文本框*/
                $filter.on('click', '.btnSearch', function () {
                    // 搜索默认是跳转到第一页
                    _this.refresh(true);
                });
                //关键词查询
                $filter.find('input[filterfield="keywords"]').keyup(function () {
                    if (event.keyCode === 13) {
                        // 搜索默认是跳转到第一页
                        _this.refresh(true);
                    }
                });
            }
            if ($buttonsPanel.length == 1) {
                //刷新按钮
                if ($buttonsPanel.find("#btnRefresh:not([auto=false])").length == 1) {
                    $buttonsPanel.find("#btnRefresh:not([auto=false])").click(function () {
                        _this.refresh(true);
                    });
                }
            }
        },

        getTableHeight: function () {
            var _h = $(window).height() < 700 ? 700 : $(window).height();
            _h = _h - $(".navbar-inverse").outerHeight() - $(".page-header").outerHeight() - $("#filter-panel").outerHeight() - $(".buttons-panel").outerHeight() - 270;
            return _h;
        }
    }

    //$selector：选择器, options: 选项
    var table = function (options, $selector) {
        var _options = $.extend(true, {}, service.defaults, options), _this = this;
        //customerAjax 如果自定义了ajax加载就用它
        if (_options.customerAjax) {
            _options.ajax = service.ajax(_options.customerAjax, this);
            delete _options.customerAjax;
        }
        if (!_options.scrollY) {
            //_options.scrollY = service.getTableHeight();
        }
        _options.drawCallback = function (settings) {
            //按钮刷新默认选中上次选中的列
            //if (_this.refreshSelectData && _this.refreshSelectData.length > 0) {
            //    var api = this.api();
            //    api.rows(function (idx, data, node) {
            //        for (var i = 0, j = _this.refreshSelectData.length; i < j; i++) {
            //            if (_this.refreshSelectData[i].id === data.id) {
            //                return true;
            //            }
            //        }
            //        return false;
            //    }).select();
            //    _this.refreshSelectData = [];
            //}
        }
        _this.options = _options;
        //初始化columns
        _options.columns = service.initColumnOptions(_options.columns, this);
        var require_modules = service.getRequireModules(_options);
        if (require_modules.length > 0) {
            require(require_modules, function () {
                var _buttons = _options.buttons, $table = $($selector || "table");
                delete _options.buttons;
                if (!$table.hasClass("nowrap")) {
                    //必须要有nowrap不然样式会乱掉
                    $table.addClass("nowrap");
                }
                _this.table = $table.DataTable(_options);
                service.initButtons(_this.table, _buttons);
                service.bindEvent(_this);
                if ($.isFunction(_options.complete)) {
                    _options.complete();
                };
            });
        } else {
            _this.table = $($selector || ".table").DataTable(_options);
            _this.options = _options;
            if ($.isFunction(_options.complete)) {
                _options.complete();
            };
        }
        //
        return this;
    }

    //表格刷新选中的列数据
    table.prototype.refreshSelectData = [];

    //刷新
    table.prototype.refresh = function (isRepeatLoad) {
        this.table.draw(isRepeatLoad);
        this.refreshSelectData = this.getSelectData();
    }

    //获取选中的列表数据
    table.prototype.getSelectData = function () {
        var _table_select_data = this.table.rows({ selected: true }).data(), _select_data = [];
        if (_table_select_data && _table_select_data.length > 0) {
            for (var i = 0, j = _table_select_data.length; i < j; i++) {
                _select_data.push(_table_select_data[i]);
            }
        }
        return _select_data;
        //return this.table.rows({ selected: true }).data();
    }

    //选择全部
    table.prototype.selectAll = function () {
        return this.table.rows().select();
    }
    //取消选择全部column().deselect()
    table.prototype.deselectAll = function () {
        return this.table.rows().deselect();
    }

    //获取表格数据
    table.prototype.getTableData = function () {
        return this.table.rows().data();
    }

    //destroy当前表格数据
    table.prototype.destroy = function () {
        return this.table.destroy();
    }

    //获取选中的列表数据
    table.prototype.getFilterParams = function () {
        //过滤表单事件绑定
        var _this = this, filterSelector = _this.filterSelector;
        if (!filterSelector) {
            filterSelector = '#filter-panel';
        }
        var $filter = $(filterSelector);
        if ($filter.length < 1) {
            return {};
        }
        var _filter_params = {};
        $filter.find('[filterField]').each(function (i, v) {
            var val = "";
            if ($(v).is("select, input[type='text'], input[type='hidden'], input[type='number'], textarea")) {
                val = $(v).val();
            } else if ($(v).is("input[type='checkbox']")) {
                val = $(v).prop('checked') == true ? '1' : '';
            } else if ($(v).is("input[type='radio']")) {
                val = $(v).prop('checked') == true ? val = $(v).val() : '';
            }
            val = $.trim(val);
            if (val != "") {
                _filter_params[$(v).attr('filterField')] = val;
            }
        });
        return _filter_params;
    }

    table.renderColumnBoolean = function (data, type, row) {
        if (data === true)
            return '<i class="glyphicon glyphicon-ok" style="color:#009000;"></i>';
        else
            return '<i class="glyphicon glyphicon-remove" style="color:#bbb;"></i>';
    }

    table.renderIsActive = function (data, type, row) {
        return data === true ? "<span class='label label-success'>启用</span>" : "<span class='label label-default'>停用</span>";
    }

    table.renderIsActive2 = function (data, type, row) {
        return data === true ? "<span class='label label-success'>激活</span>" : "<span class='label label-default'>停用</span>";
    }

    table.renderDateTime = function (data, type, row) {
        return data == null ? "" : site.utils.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
    }

    table.renderDatetimeShort = function (data, type, row) {
        return data == null ? "" : site.utils.dateFormat(new Date(data), "yyyy-MM-dd hh:mm");
    }

    table.renderDate = function (data, type, row) {
        return data == null ? "" : site.utils.dateFormat(new Date(data));
    }

    table.renderImage = function (data, type, row) {
        if (!data) {
            return null;
        }
        if (data.indexOf('http') > -1 || data.indexOf('data:') > -1) {
            return "<img style='width:60px; height:50px;' src='" + data + "' />";
        }
        return "<img style='width:60px; height:50px;' src='" + site.config.resourecePath + data + "' />";
    }

    return table;

});
/*************************************************************
ajax：false, //异步数据源配置
data:[] //javascript数据源配置
serverSide:falase,// - 开启服务器模式 
"paging":   false, //是否分页
"ordering": false, //是否排序
"info":     false， //分页标签信息
"order": [[ 3, "desc" ]] //默认第四列降序排序
"columnDefs": [ {
    targets: [ 0 ], //指定第几列
    "visible": false, //是否显示
    "searchable": false, //是否客户端搜索
    "render": function ( data, type, row ) {
        return data +' ('+ row[3]+')';
    },//渲染列表数据
    orderData: [ 0, 1 ] ////如果第一列进行排序，有相同数据则按照第二列顺序排列
}]//多列排序
//l - Length changing|f - Filtering input|t - The Table!|i - Information
//p - Pagination|r - pRocessing|< and > - div elements|<"#id" and > - div with an id
//<"class" and > - div with a class|<"#id.class" and > - div with an id and class
"dom": '<"top"i>rt<"bottom"flp><"clear">'
stateSave: true, //是否报名当前表格操作的状态，默认情况下，这个状态会保存2小时，如果你希望设置的时间更长，通过设置参数 stateDuration来初始化表格 
//numbers - Page number buttons only|simple - 'Previous' and 'Next' buttons only
//simple_numbers - 'Previous' and 'Next' buttons, plus page numbers|full - 'First', 'Previous', 'Next' and 'Last' buttons
//full_numbers - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
"pagingType": "full_numbers",
"scrollY": "200px", //Y轴滚动高度200px|vh 动态
"scrollCollapse": true, //是否开启
"scrollX": true, //X轴滚动
"language": {
    "decimal": ",",//配置数字的友好显示，比如1200450，显示为12.004,50 
    "thousands": ".",
    "lengthMenu": "每页 _MENU_ 条记录",
    "zeroRecords": "没有找到记录",
    "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
    "infoEmpty": "无记录",
    "infoFiltered": "(从 _MAX_ 条记录过滤)"
    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/German.json"
}, //语言
"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]], //页数下来选项
"columns": [
	{
        "class":          "details-control",
        "orderable":      false,
        "data":           null,
        "defaultContent": ""
    },
    { "data": "name" },
    { "data": "position" },
    { "data": "office" },
    { "data": "age" },
    { "data": "start_date" },
    { "data": "salary" }
] //列
"createdRow": function ( row, data, index ) {
    if ( data[5].replace(/[\$,]/g, '') * 1 > 150000 ) {
        $('td', row).eq(5).addClass('highlight');
    }
}//创建行数据回调函数
"displayLength": 25,//默认显示多少行
"drawCallback": function ( settings ) {
	var api = this.api();
	var rows = api.rows( {page:'current'} ).nodes();
	var last=null;
	api.column(2, {page:'current'} ).data().each( function ( group, i ) {
	if ( last !== group ) {
		$(rows).eq( i ).before(
			'<tr class="group"><td colspan="5">'+group+'</td></tr>'
		);
		last = group;
	}
	} );
}
"footerCallback": function ( row, data, start, end, display ) {
	var api = this.api(), data;
	// Remove the formatting to get integer data for summation
	var intVal = function ( i ) {
	    return typeof i === 'string' ? i.replace(/[\$,]/g, '')*1 : typeof i === 'number' ? i : 0;
	};
	// Total over all pages
	total = api.column( 4 ).data().reduce( function (a, b) {
        return intVal(a) + intVal(b);
    }, 0 );
 
	// Total over this page
	pageTotal = api.column( 4, { page: 'current'} ).data().reduce( function (a, b) {
        return intVal(a) + intVal(b);
    }, 0 );
	// Update footer
	$( api.column( 4 ).footer() ).html(
	    '$'+pageTotal +' ( $'+ total +' total)'
	);
}
"aoColumns": [
    null,
    null,
    { "orderSequence": [ "asc" ] },
    { "orderSequence": [ "desc", "asc", "asc" ] },
    { "orderSequence": [ "desc" ] },
    null
]
"deferLoading": 57
//事件触发
$('#example').on('order.dt',
function() {
    eventFired('排序');
}).on('search.dt',
function() {
    eventFired('搜索');
}).on('page.dt',
function() {
    eventFired('翻页');
}).dataTable();
// API
var column = table.column( $(this).attr('data-column') );
// Toggle the visibility
column.visible( ! column.visible() );
// 扩展
buttons  Datatables的按钮扩展提供了一组常用的选项
dom: 'Bfrtip', // dom buttons位置
----
buttons: [
    'copy', 'csv', 'excel', 'pdf', 'print'
]
----
buttons: [
    {
        text: 'My button', //Button <u>1</u>
        className: 'red',
        key: '1', //
        key: {
            altKey: true,
            key: '2'
        },
        action: function ( e, dt, node, config ) {
            alert( 'Button activated' );
        }
    }
]
----
buttons: [
    {
        extend: 'collection',
        text: 'Table control',
        buttons: [
            {
                text: 'Toggle start date',
                action: function ( e, dt, node, config ) {
                    dt.column( -2 ).visible( ! dt.column( -2 ).visible() );
                }
            },
            {
                text: 'Toggle salary',
                action: function ( e, dt, node, config ) {
                    dt.column( -1 ).visible( ! dt.column( -1 ).visible() );
                }
            }
        ]
    }
]
----
buttons: [
    {
        extend: 'collection',
        text: 'Table control',
        buttons: [
            'colvis',
            {
                text: 'Toggle start date',
                action: function ( e, dt, node, config ) {
                    dt.column( -2 ).visible( ! dt.column( -2 ).visible() );
                }
            },
            {
                text: 'Toggle salary',
                action: function ( e, dt, node, config ) {
                    dt.column( -1 ).visible( ! dt.column( -1 ).visible() );
                }
            }
        ]
    }
]
$.fn.dataTable.ext.buttons.alert = {
    className: 'buttons-alert',
 
    action: function ( e, dt, node, config ) {
        alert( this.text() );
    }
};
----
$(document).ready(function() {
    $('#example').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'alert',
                text: 'My button 1'
            },
            {
                extend: 'alert',
                text: 'My button 2'
            },
            {
                extend: 'alert',
                text: 'My button 3'
            }
        ]
    } );
} );
----
    var table = $('#example').DataTable();
 
    new $.fn.dataTable.Buttons( table, {
        buttons: [
            {
                text: 'Button 1',
                action: function ( e, dt, node, conf ) {
                    console.log( 'Button 1 clicked on' );
                }
            },
            {
                text: 'Button 2',
                action: function ( e, dt, node, conf ) {
                    console.log( 'Button 2 clicked on' );
                }
            }
        ]
    } );
 
    table.buttons( 0, null ).container().prependTo(
        table.table().container()
    );
---
dom: 'Bfrtip',
lengthMenu: [
    [ 10, 25, 50, -1 ],
    [ '10 rows', '25 rows', '50 rows', 'Show all' ]
],
buttons: [
    'pageLength'
]
---------------------------------------------------------
colreorder 允许用户通过下拉或者拖拽列头修改列的排列顺序
	colReorder: true,
	scrollY:    '200px',
-----
	colReorder: {
        order: [ 4, 3, 2, 1, 0, 5 ],
        realtime: false
    }
-----
    new $.fn.dataTable.ColReorder( table );
-----
	table.colReorder.reset();
---------------------------------------------------------
fixedcolumns 提供列冻结的功能，比如用户始终能看到索引列，而右边的表格通过滚动条横向拖动。
	scrollY:        300,
    scrollX:        true,
    scrollCollapse: true,
    paging:         false,
    fixedColumns:   true
-----
	fixedColumns:   {
        leftColumns: 1,
        rightColumns: 1,
        heightMatch: 'none'
    }
---------------------------------------------------------
fixedHeader 提供冻结header，footer和大多数左边或者右边的列，确保标题信息永远都是可见的
	fixedHeader: true
-----
	fixedHeader: {
        header: true,
        footer: true
    }
-----
	fixedHeader: {
        header: true,
        headerOffset: $('#fixed').height()
    }
-----
	new $.fn.dataTable.FixedHeader( table, {
        footer: true
    } );
---------------------------------------------------------
responsive 自动适应屏幕的功能
	responsive: true
-----
	var table = $('#example').DataTable();
    new $.fn.dataTable.Responsive( table );
---------------------------------------------------------
rowReorder  提供给用户能够重新排列行的功能（点击拖动/鼠标接触拖动）。与Editor集成，可以多行编辑后直接保存更新后的数据。
	rowReorder: true
	columnDefs: [
        { orderable: true, className: 'reorder', targets: 0 },
        { orderable: false, targets: '_all' }
    ]
-----
    rowReorder: {
        selector: 'td:nth-child(2)',//'tr'
    },
    responsive: true
-----
	var table = $('#example').DataTable( {
        rowReorder: true
    } );
 
    table.on( 'row-reorder', function ( e, diff, edit ) {
        var result = 'Reorder started on row: '+edit.triggerRow.data()[1]+'<br>';
 
        for ( var i=0, ien=diff.length ; i<ien ; i++ ) {
            var rowData = table.row( diff[i].node ).data();
 
            result += rowData[1]+' updated to be in position '+
                diff[i].newData+' (was '+diff[i].oldData+')<br>';
        }
 
        $('#result').html( 'Event result:<br>'+result );
    } );
---------------------------------------------------------
Select 提供选择行的能力，被选中的可以是行，列，或者单元格，可以是一起的也可以是独立的。
-----
	select: true
	deferRender: true,//不知道什么意思
-----
	select: {
        style: 'single',//'multi' 单选/多选
        blurable: true,//悬停变色组件
    }
-----
	select: {
        style: 'os',
        items: 'cell'
    } //单元格选择
-----
	columnDefs: [ {
        orderable: false,
        className: 'select-checkbox',
        targets:   0
    } ],
    select: {
        style:    'os',
        selector: 'td:first-child'
    },
    order: [[ 1, 'asc' ]] //复选框
-----
	select: true,
    language: {
        select: {
            rows: {
                _: "You have selected %d rows",
                0: "Click a row to select it",
                1: "Only 1 row selected"
            }
        }
    }//选项文案变化

    
    
**************************************************************/