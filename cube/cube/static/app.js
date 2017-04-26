UI.app('hook', [
	Cube(1),
]).then(function (app) {
	return app.render();
}).catch(function (error) {
	console.log(error);
});

// unfold cube
// 1. bind face to surface
// 2. all moves symmetrical, 8 variations
// 3. 
