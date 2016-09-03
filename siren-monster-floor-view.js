function MonsterView(table_elt, dungeon_elt, floor_elt){
  this.tableElt = table_elt;
  this.dungeonElt = dungeon_elt;
  this.floorElt = floor_elt;

  this.initTable();
  this.initDungeonSelect();
  this.initFloorSelect();

  this.setFloors(this.dungeonElt.value);
}

MonsterView.prototype = {
  showTable: function(dungeon_key, floor_key){
    var floor_list = Floors[dungeon_key];
    var floor = floor_list.find(function(f){ return f[0] == floor_key });
    var monsters = floor.slice(1);

    var _this = this;
    Array.prototype.forEach.call(this.tableElt.tBodies, function(tbody){
      _this.tableElt.removeChild(tbody);
    });

    var tbody = document.createElement('tbody');
    this.tableElt.appendChild(tbody);

    monsters.forEach(function(info){
      var name = info[0];
      var ratio = info[1];
      var monster = new Monster(name);
      var row = tbody.insertRow(-1);
      setupCell(row.insertCell(-1), name);
      setupCellWithChild(row.insertCell(-1), monster.createImage());
      setupCell(row.insertCell(-1), ratio);
      setupCell(row.insertCell(-1), monster.hp);
      setupCell(row.insertCell(-1), monster.atk);
      setupCell(row.insertCell(-1), monster.def);
      setupCell(row.insertCell(-1), monster.exp);
      setupCell(row.insertCell(-1), monster.drop);
    });

    this.sort.refresh();

    function setupCell(cell, content){
      cell.appendChild(document.createTextNode(content));
      return cell;
    }

    function setupCellWithChild(cell, child){
      cell.appendChild(child);
      return cell;
    }
  },

  showSelectedTable: function(){
    this.showTable(this.dungeonElt.value, this.floorElt.value);
  },

  initTable: function(){
    this.tableElt.innerHTML = '';

    var rowh = this.tableElt.createTHead().insertRow(-1);
    ['名前', '', '出現率',
     'HP', '攻撃力', '防御力', '経験値', 'ドロップ'].forEach(function(text){
      var td = rowh.insertCell(-1);
      td.appendChild(document.createTextNode(text));
    });

    this.sort = new Tablesort(this.tableElt, {
      descending: true
    });
  },

  initDungeonSelect: function(){
    var _this = this;
    this.dungeonElt.addEventListener('change', function(e){
      _this.setFloors(_this.dungeonElt.value);
    });
  },

  setFloors: function(dungeon_key){
    this.floorElt.innerHTML = '';

    var floors = Floors[dungeon_key];
    var _this = this;
    floors.forEach(function(floor){
      var floor_key = floor[0];
      var opt = document.createElement('option');
      opt.value = floor_key;
      opt.text = floor_key;
      _this.floorElt.add(opt);
    });

    this.showSelectedTable();
  },

  initFloorSelect: function(){
    var _this = this;
    this.floorElt.addEventListener('change', function(e){
      _this.showSelectedTable();
    });
  },
}

function Monster(name){
  var st = MonsterStatuses[name];
  this.hp = st[0];
  this.atk = st[1];
  this.def = st[2];
  this.exp = st[3];
  this.drop = st[4];
  this.image = st[5];
}

Monster.prototype.createImage = function(){
  var elt = new Image;
  elt.src = 'images/' + this.image;
  return elt;
}
