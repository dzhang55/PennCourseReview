var deptUrl = 'http://api.penncoursereview.com/v1/depts?token=public';

d3.json(deptUrl, function(error, json) {
	if (error) return console.warn(error);
	document.write(json);
});