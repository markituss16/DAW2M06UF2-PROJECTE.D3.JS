var width = 600,
	height = 500,
	sens = 0.25,
	focused;

var mesos = new Set (["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre","Desembre"]);

var selected_year = 2004;
var selected_month = 4;

//piles
var temperatures1, temperatures2;

var colors = new Set (['#1EFFFF', '#24FFFF', '#2AFFFF', '#30FFFF', '#36FFFF', '#3CFFFF', '#42FFFF', '#48FFFF', '#4EFFFF',
	'#54FFFF', '#5AFFFF', '#60FFFF', '#66FFFF', '#6CFFFF', '#72FFFF', '#78FFFF', '#7EFFFF', '#84FFFF', '#8AFFFF',
	'#90FFFF', '#96FFFF', '#9CFFFF', '#A2FFFF', '#A8FFFF', '#AEFFFF', '#B4FFFF', '#BAFFFF', '#C0FFFF', '#C6FFFF',
	'#CCFFFF', '#D2FFFF', '#D8FFFF', '#DEFFFF', '#E4FFFF', '#EAFFFF', '#F0FFFF', '#F6FFFF', '#FCFFFF', '#FFFCFC',
	'#FFF6F6', '#FFF0F0', '#FFEAEA', '#FFE4E4', '#FFDEDE', '#FFD8D8', '#FFD2D2', '#FFCCCC', '#FFC6C6', '#FFC0C0',
	'#FFBABA', '#FFB4B4', '#FFAEAE', '#FFA8A8', '#FFA2A2', '#FF9C9C', '#FF9696', '#FF9090', '#FF8A8A', '#FF8484', 
    '#FF7E7E', '#FF7878', '#FF7272', '#FF6C6C', '#FF6666', '#FF6060', '#FF5A5A', '#FF5454', '#FF4E4E', '#FF4848', 
    '#FF4242', '#FF3C3C', '#FF3636', '#FF3030', '#FF2A2A', '#FF2424', '#FF1E1E', '#FF1818', '#FF1212', '#FF0C0C', 
    '#FF0606', '#FF0000'
    ]);

//Setting projection
var projection = d3.geo.orthographic()
    .scale(245)
    .rotate([0, 0])
    .translate([width / 2, height / 2])
	.clipAngle(90);

var path = d3.geo.path()
	.projection(projection);

//SVG container
var svg = d3.select("#globo").append("svg")
	.attr("width", width)
	.attr("height", height);

//Adding water
svg.append("path")
	.datum({type: "Sphere"})
    .attr("class", "water")
	.attr("d", path);

var countryTooltip = d3.select("#globo").append("div").attr("class", "countryTooltip"), countryList = d3.select("#globo").attr("name", "countries");

queue()
	.defer(d3.json, "https://raw.githubusercontent.com/d3/d3.github.com/master/world-110m.v1.json")
	.defer(d3.tsv,	"./data/countryList.tsv")
	.await(ready);

var min = 300, max = -300;

var data = d3.csv("./data/GlobalLandTemperaturesByCountry.csv", function (data) {
	dataset = data.map(function (row) {
		if (+row["AverageTemperature"].trim().length != 0) {
			if (+row["AverageTemperature"] < min) {
				min = +row["AverageTemperature"];
			}
			if (+row["AverageTemperature"] > max) {
				max = +row["AverageTemperature"];
			}
			return { year: row["dt"].slice(0, 4), month: row["dt"].slice(5, 7), temperature: +row["AverageTemperature"], country: row["Country"] }
		}
	});
	dataset_cleaned = dataset.filter(function (x) {
		return x !== undefined && x.year >= 1900;
	});
	return dataset_cleaned;
});

//Main function
function ready(error, world, countryData) {
	
    var countryById = {}, countries = topojson.feature(world, world.objects.countries).features;

    //Adding countries to select

	countryData.forEach(function (d) {
		countryById[d.id] = d.name;
		option = countryTooltip.append("option");
		option.text(d.name);
	});

	//Drawing countries on the globe

    var world = svg.selectAll("path.land")
		.data(countries)
		.enter()
        .append("path")
		.attr("class", "land")
		.attr("d", path)

	    //Drag event

		.call(d3.behavior.drag()
            .origin(function () {
                var r = projection.rotate();
                return { x: r[0] / sens, y: -r[1] / sens }
            })
            .on("drag", function () {
                var rotate = projection.rotate();
                projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
                svg.selectAll("path.land").attr("d", path);
                svg.selectAll(".focused").classed("focused", focused = false);
            })
        )

		//Mouse events

		.on("mouseover", function (d) {
			countryTooltip.text(countryById[d.id])
                .style("left", (d3.event.pageX + 7) + "px")
                .style("top", (d3.event.pageY - 15) + "px")
                .style("display", "block")
                .style("opacity", 1);
		})
		.on("mouseout", function (d) {
			countryTooltip.style("opacity", 0)
			    .style("display", "none");
		})
		.on("mousemove", function (d) {
			countryTooltip.style("left", (d3.event.pageX + 7) + "px")
			    .style("top", (d3.event.pageY - 15) + "px");
		});


	d3.select("#slider_month").on("input", function () {
		selected_month = +this.value;

		let compt = 0;
		for(let m of mesos){
			if( compt == selected_month - 1){
				document.getElementById("label_month").innerHTML = "Mes: " + m;
			}
			compt ++;
		}

        filtered_data = dataset_cleaned.filter(row => +row.year === selected_year && +row.month === selected_month);
		map_data = new Map();
		temperatures2 = [];
		for (let r of filtered_data) {
			map_data.set(r["country"], r["temperature"]);
		}
		for (let r of filtered_data) {
			temperatures2.push(r["temperature"]);
		}
		render(map_data);
		const reducer = (acumulator, currentValue) => acumulator + currentValue;
		document.getElementById("label_mitjana").innerHTML = "Temperatura mitjana d'aquest mes i any: " + (temperatures2.reduce(reducer)/temperatures2.length).toFixed(2);
		for(let i=0; i< temperatures2.length; i++){
			temperatures2.pop();
		}
	});

	d3.select("#slider_year").on("input", function () {
		selected_year = +this.value;
		document.getElementById("label_year").innerHTML = "Any: " + selected_year;
        filtered_data = dataset_cleaned.filter(row => +row.year === selected_year && +row.month === selected_month);
		map_data = new Map();
		temperatures1 = [];
		for (let r of filtered_data) {
			map_data.set(r["country"], r["temperature"]);
		}
		for (let r of filtered_data) {
			temperatures1.push(r["temperature"]);
		}
		render(map_data);
		const reducer = (acumulator, currentValue) => acumulator + currentValue;
		document.getElementById("label_mitjana").innerHTML = "Temperatura mitjana d'aquest mes i any: " + (temperatures1.reduce(reducer)/temperatures1.length).toFixed(2);
		for(let i=0; i< temperatures1.length; i++){
			temperatures1.pop();
		}
	});

	function changeColor(d, i) {
		var newColor = "#000000";
		var temperature = map_data.get(countryById[d.id]);
		var j = -40;
		while (temperature > j && j < 40) {
			j = j + 1;
		}
		let compt = 0;
		for(let c of colors){
			if( compt == j +40){
				newColor = c;
			}
			compt ++;
		}
		if (temperature !== undefined) {
			d3.select(this).attr("style", "fill: " + newColor);
		} else {
			d3.select(this).attr("style", "fill: #A98B6");
		}
	}

	function render(map_data) {
		d3.select("svg").remove();
		svg = d3.select("#globo").append("svg")
    		.attr("width", width)
			.attr("height", height);
	    svg.append("path")
			.datum({
				type: "Sphere"
			})
			.attr("class", "water")
			.attr("d", path);
		world = svg.selectAll("path.land")
			.data(countries)
			.enter().append("path")
			.attr("class", "land")
			.attr("d", path)

		    //Drag event

			.call(d3.behavior.drag()
				.origin(function () {
					var r = projection.rotate();
					return { x: r[0] / sens, y: -r[1] / sens };
				})
                .on("drag", function () {
                    var rotate = projection.rotate();
                    projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
                    svg.selectAll("path.land").attr("d", path);
                    svg.selectAll(".focused").classed("focused", focused = false);
                })
            )

		    //Mouse events

			.on("mouseover", function (d) {
				countryTooltip.text(countryById[d.id])
					.style("left", (d3.event.pageX + 7) + "px")
					.style("top", (d3.event.pageY - 15) + "px")
					.style("display", "block")
					.style("opacity", 1);
			})
			.on("mouseout", function (d) {
				countryTooltip.style("opacity", 0)
					.style("display", "none");
			})
			.on("mousemove", function (d) {
				countryTooltip.style("left", (d3.event.pageX + 7) + "px")
					.style("top", (d3.event.pageY - 15) + "px");
			});
			svg.selectAll("path.land").each(changeColor);

			world.call(d3.behavior.drag()
				.origin(function () {
					var r = projection.rotate();
					return { x: r[0] / sens, y: -r[1] / sens};
				})
				.on("drag", function () {
					var rotate = projection.rotate();
					projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
					svg.selectAll("path.land").attr("d", path);
					svg.selectAll(".focused").classed("focused", focused = false);
				})
            )
			.on("mouseover", function (d) {
				countryTooltip.text(countryById[d.id] + " Temperatura: " + map_data.get(countryById[d.id]).toFixed(2))
					.style("left", (d3.event.pageX + 7) + "px")
					.style("top", (d3.event.pageY - 15) + "px")
					.style("display", "block")
					.style("opacity", 1);
			})
			.on("mouseout", function (d) {
				countryTooltip.style("opacity", 0)
					.style("display", "none");
			})
			.on("mousemove", function (d) {
				countryTooltip.style("left", (d3.event.pageX + 7) + "px")
					.style("top", (d3.event.pageY - 15) + "px");
			});
	}
};