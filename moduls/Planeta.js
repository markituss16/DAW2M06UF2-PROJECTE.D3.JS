import { Astre } from './Astre.js';

class Planeta extends Astre {
    constructor(nom, radi, massa, edat, color, centre, vRotacio, angleRotacio, descripcio, gravetat, velocitat, periode) {
        super(nom, radi, massa, edat, color, centre, vRotacio, angleRotacio, descripcio, periode);
        this.gravetat = gravetat;
        this.velocitat = velocitat;
    }

    metodePolimorfisme1(){
        return "Gravetat: " + this.gravetat + " m/s^2";
    }

    metodePolimorfisme2(){
        return "Velocitat O.: " + this.velocitat + " Km/s";
    }

}

export {Planeta as Planeta};