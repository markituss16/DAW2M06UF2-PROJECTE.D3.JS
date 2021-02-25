import { SISTEMASOLAR } from './sistemaSolar.js';

const DB_VERSION = 19;
var ASTRES = [];

//no utilitzar var
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
    READ_WRITE: "readwrite"
};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

//la petició d'obertura no crea la DB, retorna de manera asíncrona un IDBOpenDBRequest, amb un objecte exit o error.
var peticioObertura = window.indexedDB.open("SISTEMASOLAR", DB_VERSION);
var db;

peticioObertura.onerror = function (event) {
    alert("Problema!");
};
peticioObertura.onsuccess = function (event) {
    db = event.target.result;
};
peticioObertura.onupgradeneeded = function (event) {
    var db = event.target.result;
    try {
        db.deleteObjectStore("astres");

    }
    catch (e) {

    }
    // ObjectStore conté la informació sobre els nostres clients. El codi
    // "SSN" es la ruta de la clau perquè es garanteix que sigui única
    var magatzemObjsClients = db.createObjectStore("astres", {
        keyPath: "nom"
    });

    // Utilitzeu la transacció OnComplete per assegurar-se que la creació és ObjectStore
    // Acabat abans d'afegir dades en ell.
    magatzemObjsClients.transaction.oncomplete = function (event) {
        // Emmagatzemar els valors de la magatzemObjsClients acabat de crear.
        var magatzemObjsClients = db.transaction("astres", "readwrite").objectStore("astres");
        for (var i in SISTEMASOLAR) {
            console.log(SISTEMASOLAR[i]);
            var peticio = magatzemObjsClients.add(SISTEMASOLAR[i]);
        }

        var peticio = magatzemObjsClients.get("Sol");
        peticio = magatzemObjsClients.get("Mercuri");
        peticio = magatzemObjsClients.get("Venus");
        peticio = magatzemObjsClients.get("Terra");
        peticio = magatzemObjsClients.get("Júpiter");
        peticio = magatzemObjsClients.get("Saturn");
        peticio = magatzemObjsClients.get("Úra");
        peticio = magatzemObjsClients.get("Neptú");

        peticio.onerror = function (event) {

        };
        peticio.onsuccess = function (event) {
            ASTRES.push(peticio.result.nom);
        };
        

        magatzemObjsClients.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                console.log(cursor.key + " es " + cursor.value.nom);
                cursor.continue();
            }
        };


    };
};

var margin = {top: 100, right: 50, bottom: 100, left: 50 };

var width = 1500 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;

var config = {padding: 10, axisMultiplier: 1.4, velocity: [0.01, 0], starRadius: 1, glowRadius: 2 };

function displayPlanets(cfg, planets) {
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

    var boundingArea = svg.append("g")
        .selectAll("g")
        .data(planets)
        .enter().append("g")
        .attr("transform", (d, i) => "translate(" + [i * (boundingSize + cfg.padding), height / 2] + ")")
        .on("mouseover", showInfo)
        .on("mouseout", hideInfo);

    var boundingRect = boundingArea.append("rect")
        .attr("class", "bounding-box")
        .attr("y", -boundingSize / 2)
        .attr("width", boundingSize)
        .attr("height", boundingSize);

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
        .text(d => "" + d.metodePolimorfisme1())
        .style("font-size", "14px");
    info.append("text")
        .attr("y", 85)
        .text(d => "" + d.metodePolimorfisme2())
        .style("font-size", "14px");

    var labels = boundingArea.append("text")
        .attr("class", "label")
        .attr("y", -boundingSize / 2)
        .attr("dy", -12)
        .text(d => d.nom)
        .style("font-size", "14px");

    var radiusScale = d3.scaleLinear()
        .domain([0, d3.max(planets, d => d.radi)])
        .range([0, (boundingSize / 2) - 3]);

    var graticuleScale = d3.scaleLinear()
        .domain(d3.extent(planets, d => d.radi))
        .range([20, 10]);

    var planets = boundingArea.each(function (d) {
        var x = d3.select(this);
        drawPlanet(x, d);
    });

    function drawPlanet(element, data) {
        var rotation = [0, 0, data.angleRotacio];

        var projection = d3.geoOrthographic()
            .translate([0, 0])
            .scale(radiusScale(data.radi))
            .clipAngle(90)
            .precision(0.1);

        var path = d3.geoPath()
            .projection(projection);

        var graticule = d3.geoGraticule();

        var planet = element.append("g")
            .attr("class", "planet")
            .attr("transform", "translate(" + [boundingSize / 2, 0] + ")");

        var defs = d3.select("svg").select("defs");

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

        var axis = planet.append("line")
            .attr("class", "axis-line")
            .attr("x1", -radiusScale(data.radi) * cfg.axisMultiplier)
            .attr("x2", radiusScale(data.radi) * cfg.axisMultiplier)
            .attr("transform", "rotate(" + (90 - data.angleRotacio) + ")");

        var fill = planet.append("circle")
            .attr("r", radiusScale(data.radi))
            .style("fill", "url(#gradient" + data.nom + ")")
            .style("filter", "url(#glow)");

        var gridLines = planet.append("path")
            .attr("class", "graticule")
            .datum(graticule.step([graticuleScale(data.radi), graticuleScale(data.radi)]))
            .attr("d", path);

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

document.getElementById("radius_button").addEventListener("click", function () {
    SISTEMASOLAR.sort(function (a, b) {
        return b.radi - a.radi;
    });
    displayPlanets(config, SISTEMASOLAR);
});

document.getElementById("weight_button").addEventListener("click", function () {
    SISTEMASOLAR.sort(function (a, b) {
        return b.massa - a.massa;
    });
    displayPlanets(config, SISTEMASOLAR);
});

document.getElementById("period_button").addEventListener("click", function () {
    SISTEMASOLAR.sort(function (a, b) {
        return b.periode - a.periode;
    });
    displayPlanets(config, ASTRES);
});