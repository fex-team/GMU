module('plugin/widget/quickdelete');

(function(){
	enSetup = function(id){
		var id = id || "";
        input = document.createElement("input");
        div = document.createElement("div");
        document.body.appendChild(div);
        $(div).css("width",220);
        div.appendChild(input);
        $(div).attr("id", "div" + id);;
        $(input).css("height", 30);
        $(input).css("padding", 1);
        $(input).attr("id", "text" + id);
//        $("body").append("<div id='div"+id+ "' style='border:solid 1px #000000;width:220px'>"+
//            "<input id='text'"+id+" style='height:30px;padding:1px'>"+
//            "</div>");
	};
})();

test("container", function(){
	expect(14);
	stop();
	ua.loadcss(["reset.css", "widget/quickdelete/quickdelete.css"], function(){
			enSetup();
			var show = 0, hide = 0;
			var qd = new $.ui.quickdelete({
				container: "#text",
				'delete': function(){
					equals(input.value, "", "The content in input is deleted");
				}
			});
            qd._data.input.get(0).value = "1";
            qd._data.input.focus();
			setTimeout(function(){
				equals(qd._data.size, 20, "The _data is right");
				equals(qd._data.offset.x, 0, "The _data is right");
				equals(qd._data.offset.y, 0, "The _data is right");
				equals(qd._data.deleteElem.css("visibility"), "visible", "The button shows");
				equals(qd._data.deleteElem.css("width"), "20px", "The width is right");
				equals(qd._data.deleteElem.css("height"), "20px", "The height is right");
				equals(qd._data.deleteElem.width(), $(input).height(), "The width is right");
				equals(qd._data.deleteElem.height(), $(input).height(), "The height is right");
				equals(qd._data.deleteElem.offset().left, $(div).offset().left + 220 - qd._data.deleteElem.width(), "The left is right");
				equals(qd._data.deleteElem.offset().top, $(div).offset().top, "The top is right");
				$(input).blur();
				input.value = "";
				$(input).focus();
                setTimeout(function(){
                    equals(qd._data.deleteElem.css("visibility"), "hidden", "The button hides");
                    $(input).blur();
                    input.value = "1";
                    $(input).focus();
                    setTimeout(function(){
                        equals(qd._data.deleteElem.css("visibility"), "visible", "The button shows");
                        ta.touchstart(qd._data.deleteElem[0]);
                        setTimeout(function(){
                            equals(qd._data.deleteElem.css("visibility"), "hidden", "The button hides");
                            qd.destroy();
                            te.dom.push(div);
                            start();
                        },50);
                    },50);
                },50);
			}, 50);
	});
});

test("size", function(){
	expect(7);
    stop();
	enSetup();
	var qd = new $.ui.quickdelete({
		container: "#text",
		size : 30
	});
	input.value = "1";
	$(input).focus();
    setTimeout(function(){
        equals(qd._data.size, 30, "The _data is right");
        equals(qd._data.deleteElem.css("width"), "30px", "The width is right");
        equals(qd._data.deleteElem.css("height"), "30px", "The height is right");
        equals(qd._data.deleteElem.width(), $(input).height(), "The width is right");
        equals(qd._data.deleteElem.height(), $(input).height(), "The height is right");
        equals(qd._data.deleteElem.offset().left, $(div).offset().left + 220 - qd._data.deleteElem.width(), "The left is right");
        equals(qd._data.deleteElem.offset().top, $(div).offset().top, "The top is right");
        qd.destroy();
        te.dom.push(div);
        start();
    },100);
});

test("offset", function(){
	expect(8);
	enSetup();
	var qd = new $.ui.quickdelete({
		container: "#text",
		offset: {
			x : -6,
			y : 3
		}
	});
	input.value = "1";
	$(input).focus();
	equals(qd._data.offset.x, -6, "The _data is right");
	equals(qd._data.offset.y, 3, "The _data is right");
	equals(qd._data.deleteElem.css("width"), "20px", "The width is right");
	equals(qd._data.deleteElem.css("height"), "20px", "The height is right");
	equals(qd._data.deleteElem.width(), $(input).height() - 3 * 2, "The width is right");//不管设不设offset，都通过调整padding保证button居中
	equals(qd._data.deleteElem.height(), $(input).height() - 3 * 2, "The height is right");
	equals(qd._data.deleteElem.offset().left, $(div).offset().left + 220 - qd._data.deleteElem.width() + 6, "The left is right");
	equals(qd._data.deleteElem.offset().top, $(div).offset().top + 3, "The top is right");
	qd.destroy();
	te.dom.push(div);
});

test("多实例", function(){
	stop();
	expect(8);
	enSetup(1);
	enSetup(2);
	var qd1 = new $.ui.quickdelete({
		container: "#text1",
		ondelete: function(){
			equals($("#text1")[0].value, "", "The content in input is deleted");
		}
	});
	var qd2 = new $.ui.quickdelete({
		container: "#text2",
		ondelete: function(){
			equals($("#text2")[0].value, "", "The content in input is deleted");
		}
	});
    qd1._el.find("input").val("1");
    qd1._el.find("input").focus();
    setTimeout(function(){
        ok(ua.isShown(qd1._data.deleteElem.get(0)), "The qd1 button show");
        ok(!(ua.isShown(qd2._data.deleteElem.get(0))), "The qd2 button hidden");
        ta.touchstart(qd1._data.deleteElem.get(0));
        setTimeout(function(){
            ok(!(ua.isShown(qd1._data.deleteElem.get(0))), "The qd1 button hidden");
            ok(!(ua.isShown(qd2._data.deleteElem.get(0))), "The qd2 button hidden");
            qd2._el.find("input").val("1");
            qd2._el.find("input").focus();
            setTimeout(function(){
                ok(ua.isShown(qd2._data.deleteElem.get(0)), "The qd2 button show");
                ok(!(ua.isShown(qd1._data.deleteElem.get(0))), "The qd1 button hidden");
                ta.touchstart(qd2._data.deleteElem.get(0));
                setTimeout(function(){
                    ok(!ua.isShown(qd2._data.deleteElem.get(0)), "The qd2 button hidden");
                    ok(!(ua.isShown(qd1._data.deleteElem.get(0))), "The qd1 button hidden");
                    qd1.destroy();
                    qd2.destroy();
                    $("#div1").remove();
                    $("#div2").remove();
                    start();
                },50)
            },50);
        },50);
    },50);
});

test("resize, div", function(){
    stop();
	expect(4);
	enSetup();
	var qd = new $.ui.quickdelete({
		container: "#text"
	});
	input.value = "1";
	$(input).focus();
    setTimeout(function(){
        $(div).css("position", "absolute").css("width", "500px").css("left", 100).css("top", 200);
        equals(qd._data.deleteElem.offset().left, $(div).offset().left + 500 - qd._data.deleteElem.width(), "The left is right");
        equals(qd._data.deleteElem.offset().top, 200, "The top is right");
        $(div).css("width", "300px");
        equals(qd._data.deleteElem.offset().left, $(div).offset().left + 300 - qd._data.deleteElem.width(), "The left is right");
        equals(qd._data.deleteElem.offset().top, 200, "The top is right");
        start();
        qd.destroy();
        te.dom.push(div);
    },50);
});

test("resize, body", function(){
	expect(2);
	input = document.createElement("input");
	document.body.appendChild(input);
	$(input).attr("id", "text");
	var qd = new $.ui.quickdelete({
		container: "#text"
	});
	input.value = "1";
	$(input).focus();
	var width = $("body").css("width");
	var margin = $("body").css("margin");
	$("body").css("width", "200px");
	$("body").css("margin", "0");
	equals(qd._data.deleteElem.offset().left, 200 - qd._data.deleteElem.width(), "The left is right");
	$("body").css("width", width);
	equals(qd._data.deleteElem.offset().left, parseInt(width) - qd._data.deleteElem.width(), "The left is right");
	$("body").css("margin", margin);
	qd.destroy();
});

test("setup",function(){
    stop();
    expect(13);
    enSetup();
    var qd = $("#text").quickdelete().quickdelete("this");
    qd._data.input.get(0).value = "1";
    qd._data.input.focus();
    setTimeout(function(){
        equals(qd._data.size, 20, "The _data is right");
        equals(qd._data.offset.x, 0, "The _data is right");
        equals(qd._data.offset.y, 0, "The _data is right");
        equals(qd._data.deleteElem.css("visibility"), "visible", "The button shows");
        equals(qd._data.deleteElem.css("width"), "20px", "The width is right");
        equals(qd._data.deleteElem.css("height"), "20px", "The height is right");
        equals(qd._data.deleteElem.width(), $(input).height(), "The width is right");
        equals(qd._data.deleteElem.height(), $(input).height(), "The height is right");
        equals(qd._data.deleteElem.offset().left, $(div).offset().left + 220 - qd._data.deleteElem.width(), "The left is right");
        equals(qd._data.deleteElem.offset().top, $(div).offset().top, "The top is right");
        $(input).blur();
        input.value = "";
        $(input).focus();
        setTimeout(function(){
            equals(qd._data.deleteElem.css("visibility"), "hidden", "The button hides");

            $(input).blur();
            input.value = "1";
            $(input).focus();
            setTimeout(function(){
                equals(qd._data.deleteElem.css("visibility"), "visible", "The button shows");
                ta.touchstart(qd._data.deleteElem[0]);
                setTimeout(function(){
                    equals(qd._data.deleteElem.css("visibility"), "hidden", "The button hides");
                    qd.destroy();
                    te.dom.push(div);
                    start();
                },50);
            },50);
        },50);
    }, 50);
});

test("destroy", function(){
    ua.destroyTest(function(w,f){
    	w.$("body").append('<div style="width: 220px;"><input style="height: 30px; padding: 1px;" id="text"></div>');
        
    	var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var qd = w.$.ui.quickdelete({
    		container: "#text"
    	});
        qd.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(qd);
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2 + 1,"The dom is ok");//TODO:destroy时把用户创建的dom也清除了
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The gotop is destroy");
        this.finish();
    });
});