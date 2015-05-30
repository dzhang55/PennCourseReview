var URL_START = "http://api.penncoursereview.com/v1/"
var URL_END = "?token=public";
var DEPTS = "depts/"

// var diameter = 1000;

// var svg = d3.select("body").append("svg")
// 	.attr("width", diameter)
// 	.attr("height", diameter);

function loadData() {
	document.write("loading depts");
	var deptUrl = URL_START + DEPTS + URL_END;
	var deptObjs, depts = [];
	d3.json(deptUrl, function (error, json) {
		if (error) return console.warn(error);
		deptObjs = json.result.values;
		for (var i = 0; i < deptObjs.length; i++) {
			depts.push(deptObjs[i].id);
		}
		for (var i = 0; i < depts.length; i++) {
			document.writeln(URL_START + DEPTS + depts[i] + URL_END);
		}
	});
}

loadData();
