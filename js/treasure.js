define(["selfish"], function(selfish) {
    var Base = selfish.Base;
    var Treasure = Base.extend({
        initialize: function(money) {
            this.money = money;
            this.type.push('treasure');
        },
    });

    return Treasure;
});
