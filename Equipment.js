function Equipment(game, x, y) {
	Pawn.apply(this, arguments);
}

Equipment.extends(Pawn);

Equipment.prototype.holder = null;

Equipment.prototype.destroy = function() {
	if(this.holder)
		this.holder.dropEquipment();

	Pawn.prototype.destroy.apply(this, arguments);
};

Equipment.prototype.canEquip = function() {
	return false;
};

Equipment.prototype.canSwing = function() {
	return false;
}
