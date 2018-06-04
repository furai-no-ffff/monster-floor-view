document.addEventListener("DOMContentLoaded", function(){
  new MonsterView;
});

function MonsterView(){
  this.tableElt = document.getElementById("main-table");
  this.dungeonElt = document.getElementById("dungeon-select");
  this.floorElt = document.getElementById("floor-select");
  this.sirenAttackElement = document.getElementById("siren-attack");
  this.sirenDefenceElement = document.getElementById("siren-defence");

  this.initTable();
  this.initDungeonSelect();
  this.initFloorSelect();

  this.initSirenAttack();
  this.initSirenDefence();

  this.setFloors(this.dungeonElt.value);
}

MonsterView.prototype = {
  showTable: function(dungeon_key, floor_key){
    var floor_list = Floors[dungeon_key];
    var floor = floor_list.find(function(f){ return f[0] == floor_key });
    var monsters = floor.slice(1);

    var siren_def = this.getSirenDefence();
    var siren_atk = this.getSirenAttack();

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
      if (siren_def != null){
        setupCell(row.insertCell(-1), _this.rangeToText(_this.computeDamageRange(monster.atk, siren_def)));
      }
      if (siren_atk != null){
        setupCell(row.insertCell(-1), _this.rangeToText(_this.computeDamageRange(siren_atk, monster.def)));
      }
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

    makeHeaderCell('名前', null, null);
    makeHeaderCell('', null, null);
    ['出現率', 'HP', '攻撃力', '防御力', '経験値', 'ドロップ'].forEach(function(text){
       makeHeaderCell(text, null, "number");
    });
    ['シレンへのダメージ', 'シレンからのダメージ'].forEach(function(text){
       makeHeaderCell(text, "damage-range", "range");
    });

    this.sort = new Tablesort(this.tableElt, {
      descending: true
    });

    function makeHeaderCell(text, class_name, sort_method){
      var td = rowh.insertCell(-1);
      if (class_name){
        td.className = class_name;
      }
      if (sort_method){
        td.setAttribute("data-sort-method", sort_method);
      }
      td.appendChild(document.createTextNode(text));
      return td;
    }
  },

  initDungeonSelect: function(){
    var _this = this;
    this.dungeonElt.addEventListener('change', function(e){
      _this.setFloors(_this.dungeonElt.value);
    });
  },

  initSirenAttack: function(){
    var _this = this;
    this.sirenAttackElement.addEventListener("input", function(){
      _this.showSelectedTable()
    });
  },

  initSirenDefence: function(){
    var _this = this;
    this.sirenDefenceElement.addEventListener("input", function(){
      _this.showSelectedTable()
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

  getSirenAttack: function(){
    return this.getInputNumber(this.sirenAttackElement);
  },

  getSirenDefence: function(){
    return this.getInputNumber(this.sirenDefenceElement);
  },

  getInputNumber: function(elt){
    var n = elt.valueAsNumber;
    if (!isNaN(n) &&
          parseInt(elt.min) <= n &&
          n <= parseInt(elt.max)){
      return n;
    }else{
      return null;
    }
  },

  computeDamageRange: function(atk, def){
    return [damageOfRand(0), damageOfRand(0x1F)];
    function damageOfRand(rnd){
      var dmg = atk * (rnd + 0x70);
      for (var i=0; i<def; i++){
        dmg -= dmg >> 4;
      }
      return Math.min(dmg >> 7, 255);
    }
  },

  rangeToText: function(range){
    return range[0] + ' - ' + range[1];
  }
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
