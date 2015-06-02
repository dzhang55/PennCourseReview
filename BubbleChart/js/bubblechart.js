var URL_START = "http://api.penncoursereview.com/v1/";
var URL_END = "?token=public";
var INITIAL_QUERY = "semesters/2014c/";

var diameter = 900;
var color = d3.scale.category20c();

var bubbleLayout = d3.layout.pack()
	.sort(null)
	.size([diameter, diameter])
	.padding(1);

var svg = d3.select("body").append("svg")
	.attr("width", diameter)
	.attr("height", diameter);

function loadData() {
	var url = URL_START + INITIAL_QUERY + URL_END;
	var deptObjs, depts = [], deptUrls = [];
	var i;
	d3.json(url, function (error, json) {
		console.log("first d3.json callback");
		if (error) {
			return console.warn(error);
		}

		deptObjs = json.result.depts;
		for (i = 0; i < deptObjs.length; i++) {
			depts.push(deptObjs[i].id);
		}
		for (i = 0; i < depts.length; i++) {
			deptUrls.push(URL_START + INITIAL_QUERY + 
				depts[i] + URL_END);
		}
		
		loadDepts(deptUrls);
	});

	function loadDepts(deptUrls) {
		console.log("second d3.json callback");
		var deptNodes = [];
		for (i = 0; i < deptUrls.length; i++) {
			d3.json(deptUrls[i], function (error, json) {
				if (error) {
					return console.warn(error);
				}
				deptNodes.push({
					name: json.result.id,
					value: json.result.courses.length
				});
				if (json.result.id === "YDSH") {
					visualizeData({
						children: deptNodes
					});
				}
			});
		}
	}

	function visualizeData(data) {
		console.log("visualizing " +
			data.children.length + " data points");
		var node = svg.selectAll(".node")
			.data(bubbleLayout.nodes(data)
								.filter(function (d) {
									return !d.children;	
								}))
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node.append("circle")
			.attr("r", function (d) {
				return d.r;
			})
			.style("fill", function (d) {
				return color(d.name);
			});

		node.append("text")
			.style("text-anchor", "middle")
			.text(function (d) {
				return d.name;
			});

	}

}

loadData();
