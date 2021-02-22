import { SISTEMASOLAR } from './sistemaSolar.js';

const DB_VERSION = 19;
var ASTRES = [{SISTEMASOLAR}];

var db;

let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
    READ_WRITE: "readwrite"
};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var peticioObertura = indexedDB.open("astresBD", DB_VERSION);

peticioObertura.onupgradeneeded = function(e) {
    var thisDB = e.target.result;

    if(!thisDB.objectStoreNames.contains("astres")) {
        var objectStore = thisDB.createObjectStore("astres", {keyPath: "id", autoIncrement: true});
        objectStore.createIndex('nom', 'nom', {unique: false});
        objectStore.createIndex('radi', 'radi', {unique: false});
        objectStore.createIndex('massa', 'massa', {unique: false});
        objectStore.createIndex('edat', 'edat', {unique: false});
        objectStore.createIndex('color', 'color', {unique: false});
        objectStore.createIndex('centre', 'centre', {unique: false});
        objectStore.createIndex('vRotacio', 'vRotacio', {unique: false});
        objectStore.createIndex('angleRotacio', 'angleRotacio', {unique: false});
        objectStore.createIndex('periode', 'periode', {unique: false});
    }
    //addData();
}

function addData() {
    console.log("aaa");
    var transaction = db.transaction(["astres"], "readwrite");
    var objectStore = transaction.objectStore("astres");
    var nom = $("#nom").val();
    var radi = $("#radi").val();
    var massa = $("edat").val();
    var edat = $("color").val.split(",");
    console.log("afegint " + nom + "radi " + radi);
    var req = objectStore.add({nom: nom, radi: radi});
    req.onsuccess = function() {
        console.log("Dades afegides");
    };
}

/*peticioObertura.addEventListener('error', mostrarError);
peticioObertura.addEventListener('iniciar',iniciar);
peticioObertura.addEventListener('upgradeneeded', crearBD);

function mostrarError(e) {
    alert('Error: ' + e.code + '' + e.message);
} 

function iniciar(e) {
    db = e.target.result;
}

function crearBD(e) {
    var base = e.target.result;
    var desar = base.createObjectStore('astres', {keypath: 'id'});
    desar.createIndex('buscarNom', 'nom', {unique: false});
    desar.createIndex('buscarRadi', 'radi', {unique: false});
    desar.createIndex('buscarMassa', 'massa', {unique: false});
    desar.createIndex('buscarEdat', 'edat', {unique: false});
    desar.createIndex('buscarColor', 'color', {unique: false});
    desar.createIndex('buscarCentre', 'centre', {unique: false});
    desar.createIndex('buscarVRotacio', 'vRotacio', {unique: false});
    desar.createIndex('buscarAngleRotacio', 'angleRotacio', {unique: false});
    desar.createIndex('buscarPeriode', 'periode', {unique: false});

    desar.transaction.oncomplete = function(e){
        var desarInfo = db.transaction("astres", "readwrite").desar("astres");
        for (var i in ASTRES) {
            desarInfo.add(ASTRES[i]);
        }
    }
};
*/

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
    displayPlanets(config, SISTEMASOLAR);
});