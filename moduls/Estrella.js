import { Astre } from './Astre.js';

class Estrella extends Astre {
    constructor(nom, radi, massa, edat, color, centre, vRotacio, angleRotacio, descripcio, tSuperficial, lluminositat, periode) {
        super(nom, radi, massa, edat, color, centre, vRotacio, angleRotacio, descripcio, periode);
        this.tSuperficial = tSuperficial;
        this.lluminositat = lluminositat;
        this.gravetat = 273;
    }

    metodePolimorfisme1(){
        return "Temperatura Superficial: " + this.tSuperficial + " ºC";
    }

    metodePolimorfisme2(){
        return "Lluminositat: " + this.lluminositat + " GW";
    }

}

export {Estrella as Estrella};