//运行命令：node r.js -o build-config.js 
// -o：表示优化，该参数是固定的，必选。
// baseUrl：指存模块的根目录，可选。
// name： 模块的入口文件，这里是app,那么r.js会从baseUrl+name去查找app.js，然后找出所有依赖的模块，然后进行合并与压缩。
// out: 指合并压缩后输出的文件路径，这里是直接输出在根目录下build.js 我们也可以输出到其他目录下 比如js/app 目录下，也可以的。
({
    appDir: './',//应用程序的目录（即<root>）。在这个文件夹下的所有文件将会被复制到dir参数标注的文件夹下。 
    baseUrl: './',//相对于appDir，代表查找文件的锚点（that represents the anchor path for finding files）。 
  	//mainConfigFile: './js/site-config.js', // 配置文件地址。
    dir: '../dist',//这是一个输出目录，所有的应用程序文件将会被复制到该文件夹下。 
    //模块（modules）的相对目录。 
    paths: {
        "controller": "js/controller",
        "site": "js/site",
        "jquery": "scripts/jquery/jquery-1.12.4",//site.config.contextPath + "/scripts/jquery-3.1.0.min",有些JS不支持
        "jquery.validate": "scripts/jquery/extensions/jquery.validate",
        "jquery.blockUI": "scripts/jquery/extensions/jquery.blockUI",
        "spin": "scripts/jquery/extensions/spin",
        "jquery.spinner": "scripts/jquery/extensions/jquery.spinner",
        "jquery.signalR": "scripts/jquery/extensions/jquery.signalR-2.2.1",
        "jquery.Jcrop": "scripts/jquery/extensions/jquery.Jcrop",
        "jquery.ztree.all": "scripts/jquery/extensions/jquery.ztree.all", 
        "jquery.slimscroll": "scripts/jquery/extensions/jquery.slimscroll",
        "toastr": "scripts/jquery/extensions/toastr",
        "juicer": "scripts/juicer-0.6.14",
        "avalon": "scripts/avalon.modern",
        "bootstrap": "scripts/bootstrap/bootstrap-3.3.7",
        "bootstrap-modalmanager": "scripts/modal/bootstrap-modalmanager",
        "bootstrap-modal": "scripts/modal/bootstrap-modal",
        "bootbox": "scripts/modal/bootbox",
        //"bootstrap-submenu": "scripts/bootstrap/extensions/bootstrap-submenu",
        "bootstrap-select": "scripts/bootstrap/extensions/bootstrap-select",
        "bootstrap-suggest": "scripts/bootstrap/extensions/bootstrap-suggest",
        "summernote": "scripts/bootstrap/extensions/summernote",
        "bootstrap-datetimepicker": "scripts/bootstrap/extensions/bootstrap-datetimepicker",
        "datatables.net": "scripts/dataTables/jquery.dataTables",
        "datatables.net-bs": "scripts/dataTables/dataTables.bootstrap",
        "datatables.net-buttons": "scripts/dataTables/extensions/dataTables.buttons",
        "datatables.net-responsive": "scripts/dataTables/extensions/dataTables.responsive",
        "datatables.net-buttons.colVis": "scripts/dataTables/extensions/buttons.colVis",
        "datatables.net-colReorder": "scripts/dataTables/extensions/dataTables.colReorder",
        "datatables.net-fixedColumns": "scripts/dataTables/extensions/dataTables.fixedColumns",
        "datatables.net-responsive.bootstrap": "scripts/dataTables/extensions/responsive.bootstrap",
        "datatables.net-rowReorder": "scripts/dataTables/extensions/dataTables.rowReorder",
        "datatables.net-select": "scripts/dataTables/extensions/dataTables.select",
        "datatables.net-fixedHeader": "scripts/dataTables/extensions/dataTables.fixedHeader",
        "webuploader": "scripts/webuploader/webuploader",
        ////        'datatables.net-autofill' : 'DataTables/extensions/AutoFill/js/dataTables.autoFill.min',
        ////        'datatables.net-editor' : "DataTables/extensions/Editor/js/dataTables.editor.min",
        ////        'datatables-editor-bootstrap' : "DataTables/extensions/Editor/js/editor.bootstrap.min",
        ////        'datatables.net-buttons' : 'DataTables/extensions/Buttons/js/dataTables.buttons.min',
        ////        'datatables.net-buttons-bs' : 'DataTables/extensions/Buttons/js/buttons.bootstrap.min',
        ////        'datatables.net-colreorder' : "DataTables/extensions/ColReorder/js/dataTables.colReorder.min",
        ////        'datatables.net-rowreorder' : "DataTables/extensions/RowReorder/js/dataTables.rowReorder.min",
        ////        'datatables.net-scroller' : "DataTables/extensions/Scroller/js/dataTables.scroller.min",
        ////        'datatables.net-select' : "DataTables/extensions/Select/js/dataTables.select.min",

        "utils": "js/utils/site-utils",
        "log": "js/services/log",
        "api": "js/services/api",
        "templateManager": "js/utils/template-manager",
        "globalService": "js/services/global-service",

        "modal": "js/components/modal",
        "form-validate": "js/components/form-validate",
        "loading": "js/components/loading",
        "siteSelect": "js/components/site-select",
        "site-zTree": "js/components/site-zTree",
        "site-toastr": "js/components/site-toastr",
        "search-suggest": "js/components/search-suggest",
        "site-summernote": "js/components/site-summernote",
        "site-event": "js/components/site-event",
        "site-datetime": "js/components/site-datetime",
        "siteTable": "js/components/site-data-tables",
        "siteUploader": "js/components/site-uploader",
        "notification": "js/components/notification"
    },
    map: {
        '*': {
            "css": "scripts/require-css-0.1.8"
        }
    },
    //为那些没有使用define()声名依赖关系及设置模块值的模块，配置依赖关系与“浏览器全局”出口的脚本。
    shim: {
        "bootstrap": ["jquery"],
        "bootbox": {
            deps: ["bootstrap","bootstrap-modalmanager","bootstrap-modal"]
        }
    },
    modules: [
    	{
        	name: "site",
       	},{
        	name: "form-validate",
        	exclude: ["jquery"]
        },{
        	name: "loading",
        	exclude: ["jquery"]
        },{
        	name: "modal",
        	exclude: ["jquery", "bootstrap"]
        },{
        	name: "search-suggest",
        	exclude: ["jquery"]
        },{
        	name: "siteTable",
        	exclude: ["jquery"]
        },{
        	name: "site-datetime",
        	exclude: ["jquery"]
        },{
        	name: "site-event",
        	exclude: ["jquery"]
        },{
        	name: "siteSelect",
        	exclude: ["jquery"]
        },{
        	name: "site-summernote",
        	exclude: ["jquery", "bootstrap"]
        },{
        	name: "site-toastr",
        	exclude: ["jquery"]
        },{
        	name: "siteUploader",
        	exclude: ["jquery", "webuploader"]
        },{
        	name: "site-zTree",
        	exclude: ["jquery"]
        }, {
        	name: "bootbox",
        	exclude: ["jquery", "bootstrap"],
        	include: ["bootstrap-modalmanager","bootstrap-modal"]
        }
    ],//一个包含多个对象的数组。每个对象代表一个将被优化的模块（module）。 
    keepBuildDir: true,
    fileExclusionRegExp: /^(r|build-config|site-config|[^\\]+(\.|\-)min)\.js|([^/n]*\.min).css|[^/n]*.less/, 
    optimizeCss: 'standard',

	//是否移除已经合并的文件
    removeCombined: true,

	optimize: "none",
    // 使用 UglifyJS 时的可配置参数
    // See https://github.com/mishoo/UglifyJS for the possible values.
    uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: true,
        max_line_length: 1000
    },
    optimizeCss: "none"
})