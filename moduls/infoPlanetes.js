//Ús de mòduls
import { SISTEMASOLAR } from './sistemaSolar.js';
import { Planeta } from './Planeta.js';
import { Estrella } from './Estrella.js';

function inici(){

    //Creació de variables
    const DB_VERSION = 19;
    var ASTRES = [], p;
    var margin = {top: 100, right: 50, bottom: 100, left: 50 };
    var width = 1500 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;
    var config = {padding: 10, axisMultiplier: 1.4, velocity: [0.01, 0], starRadius: 1, glowRadius: 2 };

    //Ús d'objectes prototipats
    let punt = new Object({x:0, y:0});
    let colors = new Object({sol: ['#FFFF00', '#FF0000'], mercuri: ["#E7E8EC", "#B1ADAD"], venus: ["#F8E2B0", "#D3A567"], terra: ["#9FC164", "#6B93D6"], mart: ["#EF1501", "#AD0000"], jupiter: ["#D8CA9D", "#A59186"], saturn: ["#F4D587", "#F4A587"], ura: ["#E1EEEE", "#ADB0C3"], neptu:  ["#85ADDB", "#3F54BA"]});

    //Variables per a la base de dades indexedDB
    //window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
        READ_WRITE: "readwrite"
    };
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    //la petició d'obertura de la base de dades
    var peticioObertura = window.indexedDB.open("SISTEMASOLAR", DB_VERSION);
    var db;

    //Execució en cas de retorn d'error a l'obertura
    peticioObertura.onerror = function (event) {
        alert("Problema!");
    };

    //Execució en cas de retorn d'èxit a l'obertura
    peticioObertura.onsuccess = function (event) {
        db = event.target.result;

        //Recuperem les dades de la base de dades indexedDB
        var magatzemObjsAstres = db.transaction("astres", "readwrite").objectStore("astres");
        magatzemObjsAstres.openCursor().onsuccess = function (event) {
            magatzemObjsAstres.get("Sol")
            .onsuccess = function (event) {
                p = new Estrella(this.result.nom, this.result.radi, this.result.massa, this.result.edat, Object.create(colors.sol), Object.create(punt), this.result.vRotacio, this.result.angleRotacio, this.result.descripcio, this.result.tSuperficial, this.result.lluminositat, this.result.periode);
                ASTRES.push(p) ;
            };
            magatzemObjsAstres.get("Mercuri")
            .onsuccess = function (event) {
                p = new Planeta(this.result.nom, this.result.radi, this.result.massa, this.result.edat, Object.create(colors.mercuri), Object.create(punt), this.result.vRotacio, this.result.angleRotacio, this.result.descripcio, this.result.gravetat, this.result.velocitat, this.result.periode);
                ASTRES.push(p) ;
            };
            magatzemObjsAstres.get("Venus")
            .onsuccess = function (event) {
                p = new Planeta(this.result.nom, this.result.radi, this.result.massa, this.result.edat, Object.create(colors.venus), Object.create(punt), this.result.vRotacio, this.result.angleRotacio, this.result.descripcio, this.result.gravetat, this.result.velocitat, this.result.periode);
                ASTRES.push(p) ;
            };
            magatzemObjsAstres.get("Terra")
            .onsuccess = function (event) {
                p = new Planeta(this.result.nom, this.result.radi, this.result.massa, this.result.edat, Object.create(colors.terra), Object.create(punt), this.result.vRotacio, this.result.angleRotacio, this.result.descripcio, this.result.gravetat, this.result.velocitat, this.result.periode);
                ASTRES.push(p) ;
            };
            magatzemObjsAstres.get("Mart")
            .onsuccess = function (event) {
                p = new Planeta(this.result.nom, this.result.radi, this.result.massa, this.result.edat, Object.create(colors.mart), Object.create(punt), this.result.vRotacio, this.result.angleRotacio, this.result.descripcio, this.result.gravetat, this.result.velocitat, this.result.periode);
                ASTRES.push(p) ;
            };
            magatzemObjsAstres.get("Júpiter")
            .onsuccess = function (event) {
                p = new Planeta(this.result.nom, this.result.radi, this.result.massa, this.result.edat, Object.create(colors.jupiter), Object.create(punt), this.result.vRotacio, this.result.angleRotacio, this.result.descripcio, this.result.gravetat, this.result.velocitat, this.result.periode);
                ASTRES.push(p) ;
            };
            magatzemObjsAstres.get("Saturn")
            .onsuccess = function (event) {
                p = new Planeta(this.result.nom, this.result.radi, this.result.massa, this.result.edat, Object.create(colors.saturn), Object.create(punt), this.result.vRotacio, this.result.angleRotacio, this.result.descripcio, this.result.gravetat, this.result.velocitat, this.result.periode);
                ASTRES.push(p) ;
            };
            magatzemObjsAstres.get("Urà")
            .onsuccess = function (event) {
                p = new Planeta(this.result.nom, this.result.radi, this.result.massa, this.result.edat, Object.create(colors.ura), Object.create(punt), this.result.vRotacio, this.result.angleRotacio, this.result.descripcio, this.result.gravetat, this.result.velocitat, this.result.periode);
                ASTRES.push(p) ;
            };
            magatzemObjsAstres.get("Neptú")
            .onsuccess = function (event) {
                p = new Planeta(this.result.nom, this.result.radi, this.result.massa, this.result.edat, Object.create(colors.neptu), Object.create(punt), this.result.vRotacio, this.result.angleRotacio, this.result.descripcio, this.result.gravetat, this.result.velocitat, this.result.periode);
                ASTRES.push(p) ;
            };
        }
    };

    //En cas de modificació
    peticioObertura.onupgradeneeded = function (event) {

        //Obrim petició
        var db = event.target.result;
        try {
            db.deleteObjectStore("astres");
        }
        catch (e) {
        }
        
        //Conté els nostres Astres amb nom com a clau ja que es diferent
        var magatzemObjsAstres = db.createObjectStore("astres", {
            keyPath: "nom"
        });

        //Quan la creació ha acabat afegim les dades
        magatzemObjsAstres.transaction.oncomplete = function (event) {
            //Desem les dades dels astres
            var magatzemObjsAstres = db.transaction("astres", "readwrite").objectStore("astres");
            for (var i in SISTEMASOLAR) {
                magatzemObjsAstres.add(SISTEMASOLAR[i]);
            }        
        };
    };

    //Funció per dibuixar els planetes
    function displayPlanets(cfg, planets) {

        //Netegem i dibuixem el div amb id planetes
        d3.select("svg").remove();
        var svg = d3.select("#planetes").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var definitions = d3.select("svg").append("defs");
        var filter = definitions.append("filter")
            .attr("id", "glow");
        filter.append("feGaussianBlur")
            .attr("class", "blur")
            .attr("stdDeviation", config.glowRadius)
            .attr("result", "coloredBlur");
        var feMerge = filter.append("feMerge")
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
        var boundingSize = (width / planets.length) - cfg.padding;

        //Aparició de esdeveniments segons el ratolí
        var boundingArea = svg.append("g")
            .selectAll("g")
            .data(planets)
            .enter().append("g")
            .attr("transform", (d, i) => "translate(" + [i * (boundingSize + cfg.padding), height / 2] + ")")
            .on("mouseover", showInfo)
            .on("mouseout", hideInfo);

        //Mida dels planetes
        boundingArea.append("rect")
            .attr("class", "bounding-box")
            .attr("y", -boundingSize / 2)
            .attr("width", boundingSize)
            .attr("height", boundingSize);

        //Informació a que es mostra 
        var info = boundingArea.append("g")
            .attr("transform", "translate(" + [0, (boundingSize / 2) + 18] + ")")
            .attr("class", "info")
            .style("opacity", 0);
        info.append("text")
            .text(d => "Radi: " + d.radi + " Km")
            .style("font-size", "14px");
        info.append("text")
            .attr("y", 12)
            .text(d => "Massa: " + d.massa + " yg")
            .style("font-size", "14px");
        info.append("text")
            .attr("y", 24)
            .text(d => "Període: " + d.periode + " dies")
            .style("font-size", "14px");
        info.append("text")
            .attr("y", 36)
            .text(d => "Edat: " + d.edat + " Bilions d'anys")
            .style("font-size", "14px");
        info.append("text")
            .attr("y", 48)
            .text(d => "Velocitat R.: " + d.vRotacio + " Km/s")
            .style("font-size", "14px");
        info.append("text")
            .attr("y", 60)
            .text(d => "Angle de rotació: " + d.angleRotacio + " º")
            .style("font-size", "14px");
        info.append("text")
            .attr("y", 72)
            .text(d => "" + d.metodePolimorfisme1()) //crida al polimorfisme
            .style("font-size", "14px");
        info.append("text")
            .attr("y", 85)
            .text(d => "" + d.metodePolimorfisme2()) //crida al polimorfisme
            .style("font-size", "14px");

        //Nom de l'astre
        boundingArea.append("text")
            .attr("class", "label")
            .attr("y", -boundingSize / 2)
            .attr("dy", -12)
            .text(d => d.nom)
            .style("font-size", "14px");

        //Eix de rotacio
        var radiusScale = d3.scaleLinear()
            .domain([0, d3.max(planets, d => d.radi)])
            .range([0, (boundingSize / 2) - 3]);

        //Malla
        var graticuleScale = d3.scaleLinear()
            .domain(d3.extent(planets, d => d.radi))
            .range([20, 10]);

        //Planeta
        var planets = boundingArea.each(function (d) {
            var x = d3.select(this);
            drawPlanet(x, d);
        });

        //Dibuixem els planetes
        function drawPlanet(element, data) {

            //Rotació de la malla
            var rotation = [0, 0, data.angleRotacio];

            //Projecció esferica de cada planeta
            var projection = d3.geoOrthographic()
                .translate([0, 0])
                .scale(radiusScale(data.radi))
                .clipAngle(90)
                .precision(0.1);

            //Camí del planeta
            var path = d3.geoPath()
                .projection(projection);

            //Malla del planeta
            var graticule = d3.geoGraticule();

            //Translació planeta
            var planet = element.append("g")
                .attr("class", "planet")
                .attr("transform", "translate(" + [boundingSize / 2, 0] + ")");

            var defs = d3.select("svg").select("defs");

            //Gradients de colors
            var gradient = defs.append("radialGradient")
                .attr("id", "gradient" + data.nom)
                .attr("cx", "25%")
                .attr("cy", "25%");

            gradient.append("stop")
                .attr("offset", "5%")
                .attr("stop-color", data.color[0]);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", data.color[1]);

            //dibuixar eix de rotació
            planet.append("line")
                .attr("class", "axis-line")
                .attr("x1", -radiusScale(data.radi) * cfg.axisMultiplier)
                .attr("x2", radiusScale(data.radi) * cfg.axisMultiplier)
                .attr("transform", "rotate(" + (90 - data.angleRotacio) + ")");

            //pintar el planeta amb el gradient que toca
            planet.append("circle")
                .attr("r", radiusScale(data.radi))
                .style("fill", "url(#gradient" + data.nom + ")")
                .style("filter", "url(#glow)");

            //Dibuixar malla
            var gridLines = planet.append("path")
                .attr("class", "graticule")
                .datum(graticule.step([graticuleScale(data.radi), graticuleScale(data.radi)]))
                .attr("d", path);

            //Aplicar moviment a la malla
            d3.timer(function (elapsed) {
                projection.rotate([rotation[0] + elapsed * cfg.velocity[0] / data.periode, rotation[1] + elapsed * cfg.velocity[1] / data.periode, rotation[2]]);
                gridLines.attr("d", path);
            })
        }
    }

    //Ús de funcions dinàmiques
    var showInfo = new Function("d", "d3.select(this).select(\"g.info\") .transition() .style(\"opacity\",1)");
    var hideInfo = new Function("d", "d3.select(this).select(\"g.info\") .transition() .style(\"opacity\",0)");

    displayPlanets(config, SISTEMASOLAR);

    //Ús de sort
    document.getElementById("radius_button").addEventListener("click", function () {
        SISTEMASOLAR.sort(function (a, b) {
            return b.radi - a.radi;
        });
        displayPlanets(config, SISTEMASOLAR);
    });

    //Ús de sort
    document.getElementById("gravetat_button").addEventListener("click", function () {
        SISTEMASOLAR.sort(function (a, b) {
            return b.gravetat - a.gravetat;
        });
        displayPlanets(config, SISTEMASOLAR);
    });

    //Ús de sort
    document.getElementById("v_button").addEventListener("click", function () {
        ASTRES.sort(function (a, b) {
            return b.vRotacio - a.vRotacio;
        });
        displayPlanets(config, ASTRES);
    });

    //Ús de sort
    document.getElementById("weight_button").addEventListener("click", function () {
        ASTRES.sort(function (a, b) {
            return b.massa - a.massa;
        });
        displayPlanets(config, ASTRES);
    });

    //Ús de sort
    document.getElementById("period_button").addEventListener("click", function () {
        ASTRES.sort(function (a, b) {
            return b.periode - a.periode;
        });
        displayPlanets(config, ASTRES);
    });

}
window.onload = inici;