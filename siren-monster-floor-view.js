document.addEventListener("DOMContentLoaded", function(){
  new MonsterView;
});

function MonsterView(){
  this.tableElt = document.getElementById("main-table");
  this.dungeonElt = document.getElementById("dungeon-select");
  this.floorElt = document.getElementById("floor-select");
  this.sirenAttackElement = document.getElementById("siren-attack");
  this.sirenDefenceElement = document.getElementById("siren-defence");
  this.sirenStatusElement = document.getElementById("siren-status-container");

  this.initTable();
  this.initDungeonSelect();
  this.initFloorSelect();

  this.initSirenAttack();
  this.initSirenDefence();

  this.initSirenStatus();

  this.setFloors(this.dungeonElt.value);
}

MonsterView.prototype = {
  showTable: function(dungeon_key, floor_key){
    var floor_list = Floors[dungeon_key];
    var floor = floor_list.find(function(f){ return f[0] == floor_key });
    var monsters = floor.slice(1);

    var siren_def = this.getSirenDefence();
    var siren_atk = this.getSirenAttack();

    this.damageToSirenHeaderElt.style.display = siren_def == null ? 'none' : 'table-cell';
    this.damageFromSirenHeaderElt.style.display = siren_atk == null ? 'none' : 'table-cell';

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
    this.damageToSirenHeaderElt = makeHeaderCell('シレンへのダメージ', 'damage-range', 'range');
    this.damageFromSirenHeaderElt = makeHeaderCell('シレンからのダメージ', 'damage-range', 'range');

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
      _this.showSelectedTable();
    });
    document.getElementById("siren-attack-button").addEventListener("click", function(){
      if (getComputedStyle(_this.sirenStatusElement).display == 'none'){
        _this.sirenStatusElement.style.display = 'block';
      }else{
        _this.sirenStatusElement.style.display = 'none';
      }
    });
  },

  initSirenDefence: function(){
    var _this = this;
    this.sirenDefenceElement.addEventListener("input", function(){
      _this.showSelectedTable();
    });
  },

  initSirenStatus: function(){
    var _this = this;
    this.sirenStatusElement.addEventListener("input", function(){
      var lv = _this.getInputNumberForId("siren-level");
      var str = _this.getInputNumberForId("siren-strength");
      var weapon = _this.getInputNumberForId("siren-weapon");
      if (lv != null && str != null && weapon != null){
        _this.sirenAttackElement.value = _this.computeSirenAttack(lv, str, weapon);
        _this.showSelectedTable();
      }
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

  getInputNumberForId: function(id){
    return this.getInputNumber(document.getElementById(id));
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

  SirenAttackBase: [0,
    5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 26, 28, 31, 34, 37, 41, 44, 47, 50, 53, 56, 58,
    60, 63, 66, 70, 74, 78, 80, 82, 84, 86, 88, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
    100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 115, 116, 117,
    118, 119, 120, 121, 122, 123, 124, 125, 126, 127
  ],

  computeSirenAttack: function(lv, str, weapon){
    var pow = Math.min(str + weapon, 0xFF);
    var p1 = Math.abs(pow - 8);
    var p2 = (p1 * this.SirenAttackBase[lv]) >> 3;
    var p3 = Math.min((p2 >> 1) + (p2 & 1), 0xFF);
    return Math.min(this.SirenAttackBase[lv] + (pow < 8 ? -p3 : p3), 0xFF);
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
