UI.app('hook', [
	Cube(8),
]).then(function (app) {
	return app.render();
}).catch(function (error) {
	console.log(error);
});
