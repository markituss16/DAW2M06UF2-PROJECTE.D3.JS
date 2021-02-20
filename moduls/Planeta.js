import { Astre } from './Astre.js';

class Planeta extends Astre {
    constructor(nom, radi, massa, edat, color, centre, vRotacio, angleRotacio, descripcio, gravetat, velocitat, periode) {
        super(nom, radi, massa, edat, color, centre, vRotacio, angleRotacio, descripcio);
        this.gravetat = gravetat;
        this.velocitat = velocitat;
        this.periode = periode;
    }
}

export {Planeta as Planeta};