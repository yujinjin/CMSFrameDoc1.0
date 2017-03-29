/**
 * 作者：yujinjin9@126.com 
 * 时间：2016-12-13 
 * 描述：toastr.js 组件
 */
define(["bootstrap-select"], function () {
    $.fn.selectpicker.defaults = {
        noneSelectedText: '没有选中任何项',
        noneResultsText: '没有找到匹配项',
        countSelectedText: '选中{1}中的{0}项',
        maxOptionsText: ['超出限制 (最多选择{n}项)', '组选择超出限制(最多选择{n}组)'],
        multipleSeparator: ', '
    };
    $('.selectpicker').selectpicker();
});