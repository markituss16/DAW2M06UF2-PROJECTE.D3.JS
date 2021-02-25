import {SISTEMASOLAR} from "../moduls/sistemaSolar.js";

var orbitsOn = true;

const radis = [];

for(let p of SISTEMASOLAR){
  for(let prop in p){
    if(prop == "radi"){
      radis.push(p[prop]/24764);
    }
  }
}

const radisOrbitals = [0, 0.9, 1.5, 1.9, 2.5, 3.5, 5, 6.8, 9.5];

const velocitats = [0];

for(let p of SISTEMASOLAR){
  for(let prop in p){
    if(prop == "velocitat"){
      velocitats.push(p[prop]*10000);
    }
  }
}

var cua = [];

for (var i=0; i < SISTEMASOLAR.length; i++){
    SISTEMASOLAR[i].radi = radis[i];
    SISTEMASOLAR[i].massa = radisOrbitals[i];
    SISTEMASOLAR[i].velocitat = velocitats[i];
}

for(let p of SISTEMASOLAR){
  let nom, desc;
  for(let prop in p){
    if(prop == "nom"){
      nom = p[prop];
    }else if(prop == "descripcio"){
      desc= p[prop];
    }
  }
  cua.push({"nom": nom, "desc": desc});
}

function desarDescripcio(){
  for(let i=0; i<cua.length; i++){
    let e = cua.shift();
    localStorage.setItem(e.nom, e.desc);    
  }
}

desarDescripcio();

//Width and height
var w = window.innerWidth;
var h = window.innerHeight;

if (w>h) {var max = h}
else {var max = w}

var planet_displayed = "";

// Select info div by ID
var svgDiv = d3.select("#planetes");

// define scales
var posScale = d3.scale.linear()
            .domain([0, 10])
            .range([0, max/2]);

var sizeScale = d3.scale.sqrt()
            .domain([0, 10])
            .range([0, max/20])

//Create SVG element
var svg = d3.select("#planetes")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// add circles
var all = svg.selectAll("circle")
  .data(SISTEMASOLAR)
  .enter();

  // orbits
  if (orbitsOn) {
    all.append("circle")
    .attr("cx", w/2)
    .attr("cy", h/2)
    .attr("r", function(d) {
      return posScale(d.massa);
    })
    .style("stroke", function(d) {
      return d.color[0];
    })
    .style("fill", "rgba(0,0,0,0)");
  }
  
  // planets
  all.append("circle")
  .classed("planet", true)
  .attr("id", function(d) {return "planet" + d.nom})
  .attr("cx", function(d) {
     return w/2 + posScale(d.massa);
  })
  .attr("cy", h/2)
  .attr("r", function(d) {
    return sizeScale(d.radi);
  })
  .style("fill", function(d) {
    return d.color[1];
  })
  .on("click", function(d){
    if (planet_displayed !== d.nom){
      document.getElementById("info_planetes").innerHTML = "<h1>"+d.nom+"</h1>" + localStorage.getItem(d.nom);
      planet_displayed = d.nom;
    }else{
      document.getElementById("info_planetes").innerHTML = "";
      planet_displayed = "";
    }
  })
  .on("mouseover", function(d){
    d3.select(this).attr("style","fill:"+ d.color[0]);
    d3.select(this).style("cursor", "pointer");
  })
  .on("mouseout", function(d){
    d3.select(this).attr("style","fill:"+ d.color[1]);
    d3.select(this).style("cursor", "default");
  });

// timer adapted from http://bl.ocks.org/cloudshapes/5662234

// Kick off the timer, and the action begins: 
d3.timer(tickFn);

function tickFn(_elapsed) {
  var timer_elapsed = _elapsed;
  // Process all circles data. 
  for (var i = 1; i<SISTEMASOLAR.length;i++)  {

    var t_circleData = SISTEMASOLAR[i];
    if (t_circleData.start === undefined) {
      t_circleData.start = _elapsed;
    };

    // Calc elapsed time.
    var t_elapsed = _elapsed - t_circleData.start;
    // Calculate how far through the desired time for one iteration.
    if (t_circleData.velocitat !== undefined){
        var t = t_elapsed / t_circleData.velocitat;
    }

    // Calculate new x/y positions
    var rotation_radius = t_circleData.massa;
    var t_angle = (2 * Math.PI) * t;
    var t_x = rotation_radius * Math.cos(t_angle);
    var t_y = rotation_radius * Math.sin(t_angle);

    t_circleData.x = t_x - rotation_radius;
    t_circleData.y = t_y;

    SISTEMASOLAR[i].centre.x = t_circleData.x;
    SISTEMASOLAR[i].centre.y = t_circleData.y;
  }


  // Actually move the circles and the text.
  var t_circle = svg.selectAll(".planet");
  t_circle
    .attr("transform", function(d) {return "translate(" + posScale(d.centre.x) + "," + posScale(d.centre.y) + ")"});

}