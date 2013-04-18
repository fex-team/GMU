(function(){
    UA = {
        WebOS_1_4_0_Pre: "Mozilla/5.0 (webOS/1.4.0; U; en-US) AppleWebKit/532.2 (KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.1",
        WebOS_1_4_0_Pixi: "Mozilla/5.0 (webOS/1.4.0; U; en-US) AppleWebKit/532.2 (KHTML, like Gecko) Version/1.0 Safari/532.2 Pixi/1.1",
        WebOS_1_2_9_Pixi: "Mozilla/5.0 (webOS/Palm webOS 1.2.9; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pixi/1.0",
        WebOS_3_0_0_TouchPad: "Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.70 Safari/534.6 TouchPad/1.0",

        iOS_3_0_iPhone: "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/1A542a Safari/419.3",
        iOS_4_0_iPhone: "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7",
        iOS_3_1_1_iPod: "Mozilla/5.0 (iPod; U; CPU iPhone OS 3_1_1 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Mobile/7C145",
        iOS_3_2_iPad: "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10",
        iOS_4_2_iPad: "Mozilla/5.0 (iPad; U; CPU OS 4_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C134 Safari/6533.18.5",
        iOS_4_3_iPhone_Simulator: "Mozilla/5.0 (iPhone Simulator; U; CPU iPhone OS 4_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F190 Safari/6533.18.5",

        iOS_3_2_iPad_2: "Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10",

        Android_1_5: "Mozilla/5.0 (Linux; U; Android 1.5; de-; HTC Magic Build/PLAT-RC33) AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1",
        Android_2_1: "Mozilla/5.0 (Linux; U; Android 2.1-update1; en-us; Nexus One Build/ERE27) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17 Chrome/4.1.249.1025",

        BlackBerry_6_0_0_141: "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en-GB) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.141 Mobile Safari/534.1+",

        Firefox_6_0_2: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:6.0.2) Gecko/20100101 Firefox/6.0.2",
        Firefox_Mobile_Simulator: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:2.1.1) Gecko/ Firefox/4.0.2pre Fennec/4.0.1",

        Opera_11_51: "Opera/9.80 (Macintosh; Intel Mac OS X 10.7.1; U; en) Presto/2.9.168 Version/11.51",
        Opera_Mobile_Simulator: "Opera/9.80 (Macintosh; Intel Mac OS X; Opera Mobi/[BUILD_NR]; U; en) Presto/2.7.81 Version/11.00",

        Kindle: "Mozilla/5.0 (Linux; U; en-US) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+) Version/4.0 Kindle/3.0 (screen 600×800; rotate)",
        Silk_1_0_accel: "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.0.13.328_10008910) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true",
        Silk_1_0: "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Kindle Fire Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",

        Chrome_Android_18_0: "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19",
        Chrome_iOS_19_0: "Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3"
    }

    detect = function (ua, callback){
        var obj = {}
        $.__detect.call(obj, ua)
        callback.call(null, obj.os, obj.browser)
    }
})()

test("testWebOS", function(t){
    detect(UA.WebOS_1_4_0_Pre, function(os, browser){
        assertTrue(os.webos)
        ok(!os.touchpad)
        assertTrue(browser.webkit)
        assertEqual("1.4.0", os.version)
    })
    detect(UA.WebOS_1_4_0_Pixi, function(os){
        assertTrue(os.webos)
        assertEqual("1.4.0", os.version)
    })
    detect(UA.WebOS_1_2_9_Pixi, function(os){
        assertTrue(os.webos)
        assertEqual("1.2.9", os.version)
    })
    detect(UA.WebOS_3_0_0_TouchPad, function(os){
        assertTrue(os.webos)
        assertTrue(os.touchpad)
        assertEqual("3.0.0", os.version)
    })
})

test("testAndroid", function(t){
    detect(UA.Android_1_5, function(os, browser){
        assertTrue(os.android)
        assertTrue(browser.webkit)
        assertEqual("1.5", os.version)
    })
    detect(UA.Android_2_1, function(os){
        assertTrue(os.android)
        assertEqual("2.1", os.version)
    })
})

test("testIOS", function(t){
    detect(UA.iOS_3_0_iPhone, function(os, browser){
        assertTrue(os.ios)
        assertTrue(os.iphone)
        assertTrue(browser.webkit)
        assertEqual("3.0", os.version)
        assertEqual("420.1", browser.version)
    })
    detect(UA.iOS_3_1_1_iPod, function(os){
        assertTrue(os.ios)
        assertTrue(os.iphone)
        assertUndefined(os.ipod)
        assertEqual("3.1.1", os.version)
    })
    detect(UA.iOS_3_2_iPad, function(os){
        assertTrue(os.ios)
        assertTrue(os.ipad)
        ok(!os.iphone)
        assertEqual("3.2", os.version)
    })
    detect(UA.iOS_3_2_iPad_2, function(os){
        assertTrue(os.ios)
        assertTrue(os.ipad)
        ok(!os.iphone)
        assertEqual("3.2", os.version)
    })
    detect(UA.iOS_4_0_iPhone, function(os){
        assertTrue(os.ios)
        assertTrue(os.iphone)
        ok(!os.ipad)
        assertEqual("4.0", os.version)
    })
    detect(UA.iOS_4_2_iPad, function(os){
        assertTrue(os.ios)
        assertTrue(os.ipad)
        assertEqual("4.2", os.version)
    })
    detect(UA.iOS_4_3_iPhone_Simulator, function(os){
        assertTrue(os.ios)
        assertTrue(os.iphone)
        assertEqual("4.3", os.version)
    })
})

test("testBlackBerry", function(t) {
    detect(UA.BlackBerry_6_0_0_141, function(os, browser){
        assertTrue(os.blackberry)
        assertTrue(browser.webkit)
        assertEqual("6.0.0.141", os.version)
    })
})

test("testKindle", function(t) {
    detect(UA.Kindle, function(os, browser){
        assertTrue(os.kindle)
        assertTrue(browser.webkit)
        assertEqual("3.0", os.version)
    })

    detect(UA.Silk_1_0, function(os, browser){
        assertTrue(os.android)
        assertTrue(browser.webkit)
        assertTrue(browser.silk)
        assertEqual("2.3.4", os.version)
    })

    detect(UA.Silk_1_0_accel, function(os, browser){
        ok(!os.android)
        assertTrue(browser.webkit)
        assertTrue(browser.silk)
        assertEqual("1.0.13.328_10008910", browser.version)
    })
})

test("testFirefox", function(t) {
    detect(UA.Firefox_6_0_2, function(os, browser){
        assertFalse(browser.webkit)
        assertUndefined(browser.version)
    })
})

test("testOpera", function(t) {
    detect(UA.Opera_11_51, function(os, browser){
        assertFalse(browser.webkit)
        assertUndefined(browser.version)
    })
})
/*
test("testChrome", function(t) {
    detect(UA.Chrome_Android_18_0, function(os, browser){
        assertTrue(os.android)
        assertTrue(browser.webkit)
        assertTrue(browser.chrome)
        assertEqual("18.0.1025.133", browser.version)
    })

    detect(UA.Chrome_iOS_19_0, function(os, browser){
        assertTrue(os.ios)
        assertTrue(browser.webkit)
        assertTrue(browser.chrome)
        assertEqual("19.0.1084.60", browser.version)
    })
})
*/