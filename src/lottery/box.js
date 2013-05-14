/**
 * @file luckchest.js
 * @name LuckChest
 * @desc 宝箱抽奖
 * @import zepto.js, core/ui.js, core/fx.js
 */

(function($){
    $.ui.define('luckydrawbox',{

        _chests:null,
        _$root:null,
        _clickedChest:null,
        _originalResultContainer:null,

        _data: {
            numChests:3,
            openFunc:null,
            startFunc:null,
            result:null,
            noAnimation:false
        },

        _create:function(){
            if(this.data("noAnimation")){
                var prize = $('<div class="prize still"></div>');
                this.root().append(prize);
                var chest;
                for(var i= 0;i<this.data("numChests");i++){
                    chest = ($(
                        '<div class="chest still">'+
                         '</div>'));
                    this.root().append(chest);
                }

            }else if(!this.data("noAnimation")){
                var prize = $('<div class="prize animate"></div>');
                this.root().append(prize);
                var chest;
                for(var i= 0;i<this.data("numChests");i++){
                    chest = ($(
                        '<div class="chest animate">'+
                        '<div class="chest-top">'+
                        '</div>'+
                        '<div class="chest-opened-top">'+
                        '</div>'+
                        '<div class="key">'+
                        '</div>'+
                        '<div class="glow">'+
                        '</div>'+
                        '<div class="chest-bottom">'+
                        '</div>'+
                        '</div>'));
                    this.root().append(chest);
                    //TODO:多次append优化
                }

            }
        },

        _setup:function(fullMode){
        	this._data.numChests = $('div.chest',this.root()).length;
        },

        _init:function(){
            this._$root = this.root();
            this._chests = $('div.chest',this._$root);
            this._start();
        },

        /**
         * 开始
         * @return this
         * @private
         */
        _start:function(){
            this._playWaitingAnimation();
            this._addInteractive();
            return this;
        },

        setResult:function(result,id){

            var shouldPlay = false;

            if(!this.data("result") && this._clickedChest){
                shouldPlay = true;
            }

            this._data.result = result;
            if(id && this._chests[id]){
                this._playOpenAnimation($(this._chests[id]));
            }else if(shouldPlay){
                this._playPrizeAnimation(this._clickedChest,0);
            }

            return this;
        },

        restart:function(){
            $(this._originalResultContainer).append($('.prize>*',this._$root).hide());
            return this._start();
        },

        _playWaitingAnimation:function($chest){
            if(!$chest){
                this._chests.removeClass('opening').removeClass("end").addClass('waiting');
            }else{
                $chest.removeClass('opening').removeClass("end").addClass('waiting');
            }
            return this;
        },

         _playOpenAnimation:function($chest){
            var _self = this;

            if($.isFunction(this._data.startFunc)) {
                this._data.startFunc.call(null,$chest);
            }
            this._chests.removeClass('waiting').removeClass("end").addClass('idle');
            this._removeInteractive();

            //箱子
            $chest.removeClass('idle').addClass('opening');


            if(this.data("result")){
                 this._playPrizeAnimation($chest);
            }else{
                this._clickedChest = $chest;

            }
            //Android2.x不支持animation-fill-mode，需要对结束状态单独处理
            if($.os.android && ($.os.version[0] == "2" || !$.os.version)){
                $('.key',$chest).on('webkitAnimationEnd', _self._animationEndListener);
            }

            return this;
        },

        _playPrizeAnimation:function ($chest,delay) {

            //没有动画
            if(this.data("noAnimation")){
                var $prize = $('.prize', this._$root);
                $prize.append($(this.data("result")).show());
                $prize.css({
                    "marginLeft":-$(this.data("result"))[0].offsetWidth / 2 + "px",
                    "marginTop":-$(this.data("result"))[0].offsetHeight / 2 + "px",
                    "top":180
                });

                return;
            }

            //有动画
            var self = this;
            var delay = (delay === undefined)? 1200:delay;
            $.later(function () {
                if($.isFunction(self._data.openFunc)) {
                    self._data.openFunc.call(null);
                }


                var $prize = $('.prize', self._$root);

                self._originalResultContainer = $(self.data("result")).parent();
                $prize.append($(self.data("result")).show());
                //

                $prize.css({
                    "marginLeft":-$(self.data("result"))[0].offsetWidth / 2 + "px",
                    "marginTop":-$(self.data("result"))[0].offsetHeight / 2 + "px",
                    "-webkit-transform-origin":"center" + " " + $chest[0].offsetTop + "px",
                    "-webkit-transform":"scale(0.1,0.1)"

                }).hide();

                $prize.show().animate({
                    "scale":"1,1",
                    "top":180
                }, 280, "ease-out");
            }, delay);
        },

        _animationEndListener:function(event){
            $(event.currentTarget).closest('.chest').removeClass('opening').addClass('end');
            $(event.currentTarget).off('animationend');
        },

        _addInteractive:function(){
            var _self = this;

            this._chests.on('click',function(event){
                _self._playOpenAnimation($(event.currentTarget));
            });
        },

        _removeInteractive:function(){
            this._chests.off('click');
        }

    });
})(Zepto);