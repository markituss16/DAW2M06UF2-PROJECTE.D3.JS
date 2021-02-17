class Estrella extends Astre {
    constructor(nom, radi, massa, edat, color, centre, vRotacio, angleRotacio, descripcio, tSuperficial, lluminositat) {
        super.constructor(nom, radi, massa, edat, color, centre, vRotacio, angleRotacio, descripcio);
        this.tSuperficial = tSuperficial;
        this.lluminositat = lluminositat;
    }
}

export {Estrella as Estrella};