/**
 * 作者：yujinjin9@126.com
 * 时间：2017-03-04
 * 描述：table 表格
 */
define(["siteTable", "docs"], function (siteTable) {
	var controller = {
		"columns": [{ 
			"data": "id", "title": "ID", "orderable": false, "visible": false 
		}, {
			"data": "orderNo", "title": "订单编号"
		}, {
  		    "data": "sendMan", "title": "送货人"
  		}, {
  			"data": "receiveMan", "title": "收货人"
  		}, {
  			"data": "receiveManTel", "title": "收货人电话"
  		}, {
  		    "data": "price", "title": "订单价格"
  		}, {
  			"data": "createTime", "title": "创建时间",
  		    "render": function (data, type, row) {
        		if(data && data.time){
        			return site.utils.dateFormat(new Date(data.time), "yyyy-MM-dd hh:ss:mm");
        		} else {
        			return "空";
        		}
  		    }
  		}, {
  			"data": "remark", "title": "备注", "visible": false
  		}],
  		
        init: function () {
        	this.bindEvent();
        },
        
        bindEvent: function() {
        	var _this = this;
        	new siteTable({
        		"columns": _this.columns,
        		customerAjax: {
                    url: site.api.order.queryOrderList
                }
        	}, $("table[data-index=1]"));
        	
        	var _columns_2 = $.extend(true, [], _this.columns);
        	_columns_2.splice(0, 0, "checkbox");
        	new siteTable({
        		"columns": _columns_2,
        		customerAjax: {
                    url: site.api.order.queryOrderList
                }
        	}, $("table[data-index=2]"));
        	var _columns_3 = $.extend(true, [], _this.columns);
        	_columns_3.splice(0, 0, "move");
        	new siteTable({
        		"columns": _columns_3,
        		onRowReorder: function(e, diff, edit){
        			console.info(e, diff, edit);
        		},
        		customerAjax: {
                    url: site.api.order.queryOrderList
                }
        	}, $("table[data-index=3]"));
        	var _columns_4 = $.extend(true, [], _this.columns);
        	_columns_4.splice(0, 0, "radio");
        	_columns_4[8].visible = true;
        	new siteTable({
        		"columns": _columns_4,
        		scrollY: 200,
        		colReorder: {
			        fixedColumnsLeft: 1,
			        fixedColumnsRight: 1,
			        realtime: true
			    },
			    fixedColumns: {
			        leftColumns: 1,
			        rightColumns: 1
			    },
        		customerAjax: {
                    url: site.api.order.queryOrderList
                }
        	}, $("table[data-index=4]"));
        	var _columns_5 = $.extend(true, [], _this.columns);
        	_columns_5.splice(0, 0, "radio");
        	new siteTable({
        		"columns": _columns_5,
        		fixedHeader: false,
        		customerAjax: {
                    url: site.api.order.queryOrderList
                }
        	}, $("table[data-index=5]"));
        	var _columns_6 = $.extend(true, [], _this.columns);
        	_columns_6[1].orderable = true;
        	_columns_6[2].orderable = true;
        	new siteTable({
        		"columns": _columns_6,
        		fixedHeader: false,
        		order: [[1, 'asc'], [2, 'desc']],
        		customerAjax: {
                    url: site.api.order.queryOrderList
                }
        	}, $("table[data-index=6]"));
        	var _columns_7 = $.extend(true, [], _this.columns);
        	_columns_7[1].render = function (data, type, row) {
	      		return '<a href="#">' + data + '</a>';
		    }
        	_columns_7[2].render = function (data, type, row) {
	      		return '<label class="label label-info">' + data + '</labe>';
		    }
        	_columns_7[5].render = function (data, type, row) {
	      		return '<i class="glyphicon glyphicon-yen"></i>' + data + '';
		    }
        	new siteTable({
        		"columns": _columns_7,
        		fixedHeader: false,
        		customerAjax: {
                    url: site.api.order.queryOrderList
                }
        	}, $("table[data-index=7]"));
        	var _columns_8 = $.extend(true, [], _this.columns);
        	_columns_8.splice(1, 0, {
        		"data": "id", 
        		"title": "详情",
        		"render": function (data, type, row) {
		      		return '';
			    }
        	});
        	_columns_8[8].visible = true;
        	new siteTable({
        		"columns": _columns_8,
        		fixedHeader: false,
        		responsive: {
	        		details: {
			            renderer: function ( api, rowIdx, columns ) {
			                var data = $.map( columns, function ( col, i ) {
			                    return col.hidden ?
			                        '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
			                            '<td>'+col.title+':'+'</td> '+
			                            '<td>'+col.data+'</td>'+
			                        '</tr>' :
			                        '';
			                }).join('');
			                return data ? $('<table/>').append( data ) : false;
			            }
	        		}
	        	},
        		customerAjax: {
                    url: site.api.order.queryOrderList
                }
        	}, $("table[data-index=8]"));
        }
    }
	return {
        init: function () {
            controller.init();
        }
    }
});