define(function() {
  var u = {
  };

  // extend array :*
  Array.prototype.shuffle = function() {
    var j, x, i = this.length;
    while (i > 0) {
      j = Math.floor(Math.random() * i);
      x = this[--i];
      this[i] = this[j];
      this[j] = x;
    }
    return this;
  };
  return u;
});
