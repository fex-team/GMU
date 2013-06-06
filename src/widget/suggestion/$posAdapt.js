(function ($, win) {
    gmu.suggestion.register('posAdapt', {
        _checkPos: function () {
            var sugH = this._options.height || 66,
                upDis = this.getEl().offset().top - win.pageYOffset;

            return $(win).height() - upDis < sugH && upDis >= sugH;
        },
        _renderList: function (sugs, query) {
            var ret = this.origin(sugs, query);
            if (this._checkPos()) {
                ret = ret.reverse();
                this.$btn.prependTo(this.$wrapper);     //调整按钮位置
            }
            return ret;
        },
        show: function () {
            var me = this,
                $wrapper = me.$wrapper;

            me.origin();
            me._checkPos() && $wrapper.css('top', -$wrapper.height());
            return me;
        }
    });
})(Zepto, window);