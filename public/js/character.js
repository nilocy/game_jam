var BedJam = BedJam || {};

BedJam.Character = function Character(options) {
  this.name = (options.name),
  this.lvl = (options.lvl),
  this.maxHp = (5 * options.def),
  this.maxMp = (3 * options.imn),
  this.hp = this.maxHp,
  this.mp = this.maxMp,
  this.att = options.att,
  this.def = options.def,
  this.imn = options.imn,
  this.spd = options.spd,
  this.inventory = options.inventory || [],
  this.abilities = options.abilities || [],
  this.weapon = options.weapon|| null,
  this.equipment = options.equipment || null,
  this.player = options.play || false,
  this.exp = 0,
  this.expMax = this.lvl * 10,
  this.deBuff = null,
  this.buff = null,
  this.turn = 0,
  this.buffTurns = 0,
  this.deBTurns = 0,
  this.damageDealt = "",
  this.statusMessage,
  this.expMessage = "",
  this.image = options.image,
  this.stats = options.stats || [
    //[att,def,imn,spd]
      //fl 1
        [1,  1,  0,  1],
        [2,  2,  1,  2],
        [3,  3,  2,  3],
      //fl 2
        [6,  4,  3,  5],
        [8,  7,  4,  7],
        [9, 10, 5, 9],
      //3
        [15, 11, 6, 10],
        [18, 15, 7, 15],
        [22, 18, 8, 20],
        [26, 22, 9, 25]
  ]
}

BedJam.Character.prototype.battle = function battle(enemy){
  this.statusMessage = '';

  this.turn++;
  if (this.buffTurns>1){
    this.buffTurns--;
    // this.critCheck(enemy);
  } else if (this.buffTurns===1) {
    this.buffTurns--;
    this.statusMessage = (this.name+" is no longer buffed!")
    if (buff==='temper'){
      this.def=Math.round(this.def/1.5);
      this.buff=null;
    }
    // this.critCheck(enemy);
  }
  if (this.deBTurns>1){
    this.deBTurns--;
    this.statusMessage = (this.name +" is fast asleep!")
    // enemy.battle(this);
  } else if (this.deBTurns===1){
    this.deBTurns--;
    this.statusMessage = (this.name +" woke up!");
    this.deBuff=null;
    // this.critCheck(enemy);
  }else{
    // this.critCheck(enemy);
  }
  console.log(this.statusMessage);
  return this.statusMessage;
}

BedJam.Character.prototype.critCheck= function critCheck(enemy){
  console.log(this.name+' attacked '+enemy.name);
  var success=Math.random();
  var crit;
  if (success<(0.03*this.spd)){
    crit=true;
    this.bam(crit, enemy);
  }else{
    crit=false;
    this.bam(crit, enemy);
  }
  return this.damageDealt;
};

BedJam.Character.prototype.bam= function bam(crit,enemy){
  if (crit){
    dmg=Math.floor((this.att-(enemy.def/2)))*3;
  }else{
    dmg=Math.floor((this.att-(enemy.def/2)));
  }
  this.dodge(dmg, enemy, crit);
  return this.damageDealt;
};

BedJam.Character.prototype.dodge = function dodge(dmg, enemy, crit) {
  var success=Math.random();
  if (success>(0.03*(enemy.spd))){
    this.dmgDealt(dmg, enemy,crit,false);
  }else{
    this.dmgDealt(0,enemy,crit,true);
  }
  return this.damageDealt;
};

BedJam.Character.prototype.dmgDealt= function dmgDealt(dmg, enemy, crit, dodge){
  this.damageDealt = this.name + " hits " + enemy.name + "!<br>";
  console.log(this.damageDealt);

  if (dodge){
    this.damageDealt += (enemy.name+' dodged the attack!');
    //dodge
  } else if (dmg<=0) {
      if (crit){
        enemy.hp--;
        this.damageDealt += ("It's a critical hit! <br> " + enemy.name + " lost 1 health!");
      } else {
        dmg=Math.floor(Math.random()*2);
        enemy.hp-=dmg;
        if (dmg===1){
          this.damageDealt += (enemy.name+ ' lost 1 health!');
        } else {
          this.damageDealt += ('It did no damage!');
        }
      }
  } else {
      this.damageDealt += (enemy.name+ " lost "+dmg+" health!");
      enemy.hp-=dmg;
    }
  // this.turnEnd(enemy);
  console.log(this.damageDealt);
  return this.damageDealt;
};

BedJam.Character.prototype.magic= function magic(enemy){
    //populate menu via this.abilities[i]
    //call abilities when clicked via girl.abilities[i].spell(this,enemy)
};

BedJam.Character.prototype.flee= function flee(enemy){
  console.log(this.name+' tried to runaway')
  var success=Math.random();
  if ((this.lvl/enemy.lvl)>success){
    console.log(this.name+' got away safely!')
    //back to overhead screen
  }
  else{
    console.log(this.name+' failed to get away');
    enemy.critCheck(this);
  }
};

BedJam.Character.prototype.win = function win(enemy){
  console.log(enemy.hp);
  if (enemy.hp <= 0) {
    this.deBuff=null;
    this.buff=null;
    this.turn=0;
    this.buffTurns=0;
    this.deBTurns=0;
    if (this.player) {
      return (this.name+" won!");
    } else {
      return ("GAME OVER!");
    }
  } else {
    return false;
  }
};

BedJam.Character.prototype.calculateExp = function calculateExp(enemy) {
  this.expMessage = "";
  var gain=Math.floor((enemy.lvl*5)/2);
  this.exp += gain;
  console.log(this.exp, gain, this.expMax);
  if (this.exp>=this.expMax){
    if (this.lvl < 10) {
      this.expMessage = this.lvlUp();
      return this.expMessage;
    }
  } else {
    this.expMessage = (this.name+" gained "+gain+" experience points!");
    return this.expMessage;
  }
}

BedJam.Character.prototype.lvlUp = function lvlUp(){
  if (this.lvl<10){
    var levelMessage = (this.name+" leveled up!<br>");
    this.lvl+=1;
    this.getStats();
    this.exp=0;
    this.expMax=this.lvl*10;
    $('.levelDisplay').html('Level: ' + this.lvl);
  }

  if (this.lvl===2) {
    this.abilities.push({name: 'hurt', spell:this.hurt});
    levelMessage += (this.name+" learned Hurt!");
  };
  if (this.lvl===4){
    this.abilities.push({name: 'heal', spell:this.heal});
    levelMessage += (this.name+" learned Heal!");
  };
  if (this.lvl===6){
    this.abilities.push({name: 'bedtime', spell:this.bedtime});
    levelMessage += (this.name+" learned Bedtime!");
  };
  if (this.lvl===8){
    this.abilities.push({name: 'temper', spell:this.temper});
    levelMessage += (this.name+" learned Temper!");
  };
  if (this.lvl===10){
    this.abilities.push({name: 'tantrum', spell:this.tantrum});
    levelMessage += (this.name+" learned Tantrum!");
  };
  //this.ptSelect(); menu for lvl up
  return levelMessage;
};

BedJam.Character.prototype.getStats = function getStats() {

  // [level-1][0]att [1]def [2]imn [3]spd

  this.att = this.stats[this.lvl-1][0];
  this.def = this.stats[this.lvl-1][1];
  this.imn = this.stats[this.lvl-1][2];
  this.spd = this.stats[this.lvl-1][3];

  this.maxHp = ( 5 * this.def);
  this.maxMp = ( 3 * this.imn);


  // fully heals after every level?
  this.hp = this.maxHp;
  this.mp = this.maxMp;

  return this;
};


BedJam.Character.prototype.getItem = function getItem(item){
  this.inventory.push(item);
};

BedJam.Character.prototype.checkIfInInventory = function checkIfInInventory(item) {
  if (this.inventory.indexOf(item) !== -1) {
    return true;
  } else {
    return false;
  }
};

BedJam.Character.prototype.applyItemStats = function applyItemStats(equippedItem) {
  this.hp += equippedItem.raiseHealth,
  this.mp += equippedItem.raiseImagination,

  this.att += equippedItem.atkModifier,
  this.def += equippedItem.defModifier,
  this.imn += equippedItem.imnModifier,
  this.spd += equippedItem.spdModifier
};

BedJam.Character.prototype.useItem = function useItem(item) {
  this.applyItemStats(item);
};

BedJam.Character.prototype.removeItemStats = function removeItemStats(removedItem) {
  this.hp -= removedItem.raiseHealth,
  this.maxHp -= removedItem.maxHealthModifier,
  this.mp -= removedItem.raiseImagination,
  this.maxMp -= removedItem.imnPointsModifier,
  this.exp -= removedItem.xpModifier,
  this.att -= removedItem.atkModifier,
  this.def -= removedItem.defModifier,
  this.imn -= removedItem.imnModifier,
  this.spd -= removedItem.spdModifier
};

BedJam.Character.prototype.equipWeapon = function equipWeapon(item) {
    this.weapon = item;
    this.applyItemStats(this.weapon);
};

BedJam.Character.prototype.equipEquipment = function equipEquipment(item) {
    this.equipment = item;
    this.applyItemStats(this.equipment);
};

BedJam.Character.prototype.equipItem = function equipItem(item){

  if (this.checkIfInInventory(item)) {

    if (item.type === "weapons") {
      this.equipWeapon(item);
    } else if (item.type === "equipment") {
      this.equipEquipment(item);
    } else {
      console.log("This Item is not equipable.")
    }

  } else {
    console.log("Equip Item:  This item is not in your inventory.")
  }
};

BedJam.Character.prototype.unequipWeapon = function unequipWeapon(item) {
    this.removeItemStats(this.weapon);
    this.weapon = null;
};

BedJam.Character.prototype.unequipEquipment = function unequipEquipment(item) {
    this.removeItemStats(this.equipment);
    this.equipment = null;
};

BedJam.Character.prototype.unequipItem = function unequipItem(item){
  if (this.weapon === item || this.equipment === item) {

    if (item.type === "weapons") {
      this.unequipWeapon(item);
    } else if (item.type === "equipment") {
      this.unequipEquipment(item);
    } else {
      console.log("This Item is not equipable.")
    }

  } else {
    console.log("Remove Item:  This item is not equipped.")
  }

};

// var player={name:'sophia',lvl:1,att:20,def:50,imn:2,spd:4,play: true};
// var enemy= {name:'fear',lvl:200,att:2,def:2,imn:2,spd:2};
// var girl = new Character(player);
// var fear = new Character(enemy);
