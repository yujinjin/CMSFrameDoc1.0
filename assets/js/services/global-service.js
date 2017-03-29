/**
 * 作者：yujinjin9@126.com
 * 时间：2016-08-02
 * 描述：APP 全局业务逻辑
 */
define(function () {
    var globalService = {
        //判断当前用户信息是否登录
		isLogin() {
			if(site.globalService.getLoginUserInfo().userName){
				return true;
			}
	        return false;
	    },
	    //退出登录
	    logOut(){
	    	site.globalService.setUserInfo({});
	    },
    	//获取用户登录的Token信息
	    getLoginUserInfo(){
	    	var _currentTime = (new Date()).getTime(), _userInfo = site.getSiteLocalStorage().userInfo || {};
	    	if(_userInfo.expireTime && (_userInfo.expireTime - _currentTime) > 0) {
	    		return _userInfo;
	    	} else {
	    		site.globalService.setUserInfo({});
	    		return {};
	    	}
	    },
    	
        //设置用户信息
	    setUserInfo: function(userInfo) {
	    	if(!userInfo || typeof(userInfo) != "object"){
	    		return;
	    	}
	    	if(userInfo.expireTime > 0) {
	    		var _site_local_storage = site.getSiteLocalStorage();
				if(_site_local_storage.userInfo == null || typeof(_site_local_storage.userInfo) != "object"){
					_site_local_storage.userInfo = {};
				}
				_site_local_storage.expireTime = (new Date()).getTime() + (expireTime - 60) * 1000;
	    		site.utils.localStorage("siteLocalStorage", JSON.stringify(_site_local_storage));
	    	} else {
	    		site.utils.localStorage("siteLocalStorage", "{}");
	    	}
	    }
    };
    return globalService;
});