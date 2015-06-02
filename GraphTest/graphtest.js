var URL_START = "http://api.penncoursereview.com/v1/";
var URL_END = "?token=public";
var QUERY = "/depts";
var depts;
var courses;
var dataset = [];


function loadData() {
	var url = URL_START + QUERY + URL_END;
	$.ajax({
		url: url,
		async: false,
		dataType: 'json',
		success: function (json) {
			depts = json.result.values;
			for (var i = 0; i < depts.length; i++) {
			//document.write(URL_START + depts[i].path + URL_END);
				$.ajax({
 					url: URL_START + depts[i].path + URL_END,
  					async: false,
  					dataType: 'json',
  					success: function (json) {
   						courses = json.result.coursehistories;
						for (var i = 0; i < courses.length; i++) {
							dataset.push(courses[i].name);
						//document.write(dataset[i] + " ");
						//makeMeSomeD3Graphs();
						}
  					}
				});
			// d3.json(URL_START + depts[i].path + URL_END, function (error, json) {
			// 	if (error) {
			// 		return console.warn(error);
			// 	}
			// 	courses = json.result.coursehistories;
			// 	for (var i = 0; i < courses.length; i++) {
			// 		dataset.push(courses[i].aliases[0]);
			// 	}

			// });

			}
		//courses = d3.json (URL_START + depts.)
		//makeMeSomeD3Graphs();
		}});
	makeMeSomeD3Graphs();


}

function makeMeSomeD3Graphs() {

svg.selectAll("rect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr("x", function(d, i) {
		return i * (w / dataset.length);
	})
	.attr("y", function(d, i) {
		return h - 5 * dataset[i].length;
	})
	.attr("width", w / dataset.length)
	.attr("height", function(d, i) {
		return 5 * dataset[i].length;
	})
	.attr("fill", "teal");

}

var w = 800;
var h = 600;
var svg = d3.select("body")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

loadData();
