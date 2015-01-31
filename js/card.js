define(['selfish'], function(selfish) {
  var Base = selfish.Base;
  var Card = Base.extend({
    /**
     * Description
     * @method initialize
     * @param {} name
     * @param {} text
     * @param {} cost
     * @param {} img
     * @return 
     */
    initialize: function(name, text, cost, img) {
      var conf;
      if (name && typeof name === 'object') {
        conf = name;
        conf.name = conf.name || 'Empty Name';
        conf.text = conf.text || 'Empty Text';
        conf.cost = conf.cost || 0;
        conf.img = conf.img || '';
      } else {
        conf = {};
        conf.name = name || 'Empty Name';
        conf.text = text || 'Empty Text';
        conf.cost = cost || 0;
        conf.img = img || '';
      }
      if (typeof conf.cost === 'function') {
        this.cost = conf.cost;
      } else {
        /**
         * Description
         * @method cost
         * @return MemberExpression
         */
        this.cost = function() {
          return conf.cost;
        };
      }
      this.img = conf.img;
      this.name = conf.name;
      this.text = conf.text;
      this.type = [];
    },
    /**
     * Description
     * @method is
     * @param {} ty
     * @return BinaryExpression
     */
    is: function(ty) {
      return this.type.indexOf(ty) >= 0;
    },
  });

  return Card;
});
