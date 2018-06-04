(function(){
  var cleanNumber = function(i) {
    return i.replace(/[^\-?0-9.]/g, '');
  },

  compareNumber = function(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);

    a = isNaN(a) ? 0 : a;
    b = isNaN(b) ? 0 : b;

    return a - b;
  };

  Tablesort.extend('number', function(item) {
    return item.match(/^-?[£\x24Û¢´€]?\d+\s*([,\.]\d{0,2})/) || // Prefixed currency
      item.match(/^-?\d+\s*([,\.]\d{0,2})?[£\x24Û¢´€]/) || // Suffixed currency
      item.match(/^-?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/); // Number
  }, function(a, b) {
    a = cleanNumber(a);
    b = cleanNumber(b);

    return compareNumber(b, a);
  });

  Tablesort.extend("range", function(item){
    return item.match(/^\s*\d+\s*-\s*\d+/);
  }, function(a,b){
    var md_a = a.match(/^\s*(\d+)\s*-\s*(\d+)/);
    var md_b = b.match(/^\s*(\d+)\s*-\s*(\d+)/);

    var d_min = parseInt(md_b[1]) - parseInt(md_a[1]);
    var d_max = parseInt(md_b[2]) - parseInt(md_a[2]);
    return d_min + d_max;
  });
}());
