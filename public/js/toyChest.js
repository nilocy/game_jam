//Toy Chest - Generates Item and can have traps
//requires items

function ToyChest(options) {
  this.item = options.item || null,
  this.trapActive = options.trapActive || false,
  this.damage = options.damage || 1,
  this.canHeal = options.canHeal || false,
  this.heal = options.heal || 0
}

ToyChest.prototype.trapTriggered = function trapTriggered(player) {
<<<<<<< HEAD
  console.log("Its a trap!")
=======
  console.log("It\'s a trap!")
>>>>>>> 9f1f1c73f33b1a05671a303853f83e63d62af009
  // hurt player by this.damage
};

ToyChest.prototype.healTriggered = function healTriggered(player) {
  console.log("Heal!")
  // heal player by this.heal
};
