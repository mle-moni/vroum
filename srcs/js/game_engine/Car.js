/*
	creates a car object,
	you need to add car.moddel to the scene in order to see it
*/

class Car {
	constructor(skin, skinArray) {
		this.model = skinArray[skin].clone();
		this.physics = new CarPhysics(this);
	}
}