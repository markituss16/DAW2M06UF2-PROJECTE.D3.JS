import { SISTEMASOLAR } from './sistemaSolar.js';

var margin = {top: 100, right: 50, bottom: 100, left: 50 };

var width = 1300 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        .text(d => "Radi: " + d.radi + "km");
    info.append("text")
        .attr("y", 12)
        .text(d => "Massa: " + d.massa + "yg");
    info.append("text")
        .attr("y", 24)
        .text(d => "Període: " + d.periode);

    var labels = boundingArea.append("text")
        .attr("class", "label")
        .attr("y", -boundingSize / 2)
        .attr("dy", -12)
        .text(d => d.nom);

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

        d3.timer((elapsed) => {
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
    SISTEMASOLAR.sort((a, b) => {
        return b.radi - a.radi;
    });
    displayPlanets(config, SISTEMASOLAR);
});

document.getElementById("weight_button").addEventListener("click", function () {
    SISTEMASOLAR.sort((a, b) => {
        return b.massa - a.massa;
    });
    displayPlanets(config, SISTEMASOLAR);
});

document.getElementById("period_button").addEventListener("click", function () {
    SISTEMASOLAR.sort((a, b) => {
        return b.periode - a.periode;
    });
    displayPlanets(config, SISTEMASOLAR);
});