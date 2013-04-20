/**
 *  @file 获取当前详细地址
 *  @name zepto.location
 *  @desc 获取当前详细地址
 *  @import core/zepto.js, core/zepto.extend.js
 */
(function($) {
    $.extend($.fn, {
        /**
         * @desc 调用地图API，获取当前地址位置详细信息
         * **successCB：** 获取信息成功回调函数
         * **errorCB：** 获取信息失败回调函数
         * **options:**
         * - ***enableHighAccuracy***: boolean 是否要求高精度的地理信息
         * - ***timeout***: 获取信息的超时限制
         * - ***maximumAge***: 对地理信息进行缓存的时间
         *
         * @grammar $.location(fn, fn, options) ⇒ function
         * @name $.location
         * @example $.location(function(rs){
         *      console.log(rs)
         *  })
         */
        location : function(successCB, errorCB, options){
            //获取地图提供的js api
            $.ajaxJSONP({
                url: 'http://api.map.baidu.com/api?v=1.4&callback=?',
                success: function(){
                    window.navigator.geolocation
                        ? window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError, $.extend({
                        enableHighAccuracy : true
                    }, options))
                        : (errorCB && errorCB("浏览器不支持html5来获取地理位置信息"))
                }
            })
            function handleSuccess(position){
                //获取当前手机经纬度坐标，并将其转化成百度坐标
                var lng = position.coords.longitude,
                    lat = position.coords.latitude,
                    xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=2&to=4&x=" + lng + "&y=" + lat + '&callback=?'
                $.ajaxJSONP({
                    url: xyUrl,
                    success: function(data){
                        var gc = new BMap.Geocoder()
                        gc.getLocation(new BMap.Point(data.x, data.y), function(rs){	//data.x data.y为加密后的百度坐标，传入Point后可解析成详细地址
                            successCB && successCB(rs)
                        })
                    }
                })
            }

            function handleError(){
                errorCB && errorCB(arguments)
            }
        }
    });
})(Zepto);
