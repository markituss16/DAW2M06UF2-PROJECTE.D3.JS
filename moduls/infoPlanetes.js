import { SISTEMASOLAR } from './sistemaSolar.js';

//Declaracions de variables per a definir el fons
var marge = {top: 100, right: 50, bottom: 100, left: 50};
var width = 960 - marge.left - marge.right, 
    height = 500 - marge.top - marge.bottom;

var fons = d3.select("body").append("svg")
    .attr("width", width + marge.left + marge.right)
    .attr("height", height + marge.top + marge.bottom)
    .append("g")
    .attr("transform", "translate(" + marge.left + "," + marge.top + ")");

var areaEstrella = d3.select("svg").append("g");

//Configuració estrelles 
var config = {
    padding: 10,
    eix: 1.4,
    velocitat: [0.01, 0],
    radiEstrella: 1,
    radiLluminositat: 2
};

var definicions = d3.select("svg").append("defs");
var filtrar = definicions.append("filter")
    .attr("id", "glow");
    filtrar.append("feGaussianBlur")
    .attr("stdDeviation",config.radiLluminositat)
    .attr("result", "coloredBlur");

var feMerge = filtrar.append("feMerge") //Permet aplicar efectes concurrentment en comptes de seqüencialment
    feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
    feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");

function generarEstrelles(nombre) {
    var estrelles = areaEstrella.selectAll("circle") //Selecciona tots els elements que contenen el selector especificat
        .data(d3.range(nombre).map(d =>  //Ús de map, a més de fer-ho amb format fletxa
            i = {x: Math.random() * (width + marge.left + marge.right), y: Math.random() * (height + marge.top + marge.bottom), r: Math.random() * config.radiEstrella}
        ))
        .enter().append("circle")
            .attr("class","estrella")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr('r', d => d.r);
}

function mostrarPlanetes(configuracio, planetes) {
    var delimitarMida = (width / planetes.length) - configuracio.padding;

    var delimitarArea = svg.append("g")
        .selectAll("g")
        .data(planetes)
        .enter().append("g")
            .attr("transform", (d, i) => "translate(" + [i * (delimitarMida + configuracio.padding), height / 2] + ")")
        .on("mouseover", mostrarInfo)
        .on("mouseout", amagarInfo);

    var delimitarRectangle = delimitarArea.append("rect")
        .attr("class", "bounding-box")
        .attr("y", -delimitarMida / 2)
        .attr("width", delimitarMida)
        .attr("height", delimitarMida);

    /*var info = delimitarArea.append("g")
        .attr("transform", "translate(" + [0, (delimitarMida / 2) + 18] + ")")
        .attr("class", "info")
        .style("opacity", 0);
    info.append("text")
        .text(d => "")*/

    var escalarRadi = d3.scaleLinear()
        .domain([0, d3.max(planetes, d => d.radi)])
        .range([0, (delimitarMida / 2) - 3]);

    var escalarReticula = d3.scaleLinear()
        .domain(d3.extent(planetes, d => d.radi))
        .range([20,10]);

    var planetes = delimitarArea.each((d) => { //Ús de funció fletxa
        var x = d3.select(this); 
        dibuixarPlaneta(x,d);
    });

    function dibuixarPlaneta(element, dades) {
        var rotacio = [0, 0, dades.angleRotacio];

        var projeccio = d3.geoOrthographic()
            .translate([0,0])
            .scale(escalarRadi(dades.radi))
            .precision(0.1);

        var ruta = d3.geoPath()
            .projection(projeccio);
        
        var reticula = d3.geoGraticule();

        var planeta = element.append("g")
            .attr("class","planet")
            .attr("transform", "translate(" + [delimitarMida / 2, 0] + ")");

        var defs = d3.select("svg").select("defs");

        var planeta = element.append("g")
            .attr("id", "gradient" + data.nom)
            .attr("cx", "25%")
            .attr("cy", "25%");
    }
}

generarEstrelles(404);
mostrarPlanetes(config, SISTEMASOLAR);