var Cube = function (cubeNetIndex) {
	return UI.createComponent(`cube-${cubeNetIndex}`, {
		name: 'cube',
		appearance: {
			style: {
				'position': 'relative',
				'top': '50%',
				'left': '50%',
				'transform': 'translate(-50%, -50%)',
				'display': 'inline-block',
			},
		},
	}).then(function (base) {

		// vars
		base.size = 60;
		base.colors = [
			'white',
			'red',
			'blue',
			'orange',
			'green',
			'yellow',
		]
		base.nets = [
			'(0(0(21)))',
			'(0(0(2)1))',
			'(0(0(2))1)',
			'(0(0(2)))1',
			'(0(021))',
			'(0(02)1)',
			'(2(0(0(2))))',
			'(0(1(0)2))',
			'(0(2(0(0))))',
			'(0(2(0))1)',
			'(2(0(2(0))))',
		]

		// methods
		base.move = function (command) {
			// command is of the form 0, or 0', where ' indicates counter-clockwise rotation'.
			// The number 0-5 specifies which face is to be rotated.

		}
		base.generate = function (netIndex) {
			var net = base.nets[netIndex];
			// net is of the form '0(0(0(21)))'
			// where 0 is forwards, 1 is right, and 2 is left, in arbitrary orientation
			// faces are numbered according to their occurrence in the net pattern
			// The first face is always 0, and is omitted. The first number is in the coordinate system of the first face.

			var index = 1;
			var coords = [[0,0], [0,1]];
			var directions = [[0,1], [1,0], [-1,0]];
			var minX = 0, maxX = 0, maxY = 0;
			var i;

			for (i=0; i<net.length; i++) {
				let char = net[i];
				if (char === '(') {
					index += 1;
				} else if (char === ')') {
					index -= 1;
				} else {
					let direction = directions[parseInt(char)];
					let parent = index - 1;
					let child = [coords[parent][0] + direction[0], coords[parent][1] + direction[1]];
					coords.push(child);

					// min
					minX = child[0] < minX ? child[0] : minX;
					maxX = child[0] > maxX ? child[0] : maxX;
					maxY = child[1] > maxY ? child[1] : maxY;
				}
			}

			// maybe shift coords by max and min
			for (j=0; j<coords.length; j++) {
				coords[j] = [coords[j][0] - minX, coords[j][1]];
			}

			// use list of coords to generate faces
			return Promise.ordered(coords.map(function (coord, index) {
				return function () {
					return base.face(`cube-${cubeNetIndex}-face-${index}`, {
						x: coord[0],
						y: coord[1],
						index: index,
					}).then(function (face) {
						return base.setChildren([face]);
					});
				}
			})).then(function () {
				return base.setAppearance({style: {
					'height': `${(maxY + 1) * base.size * 3}px`,
					'width': `${(maxX - minX + 1) * base.size * 3}px`,
				}});
			});
		}

		// children
		base.face = function (id, args) {
			// face serves as a container for cells at the end of a cycle.
			return UI.createComponent(id, {
				name: id,
				appearance: {
					style: {
						'position': 'absolute',
						'height': `${base.size * 3}px`,
						'width': `${base.size * 3}px`,
						'border': '1px solid black',
						'left': `${args.x * base.size * 3}`,
						'bottom': `${args.y * base.size * 3}`,
					},
				},
			}).then(function (face) {
				face.data = [
					[args.index, args.index, args.index],
					[args.index, args.index, args.index],
					[args.index, args.index, args.index],
				]


				return Promise.ordered(face.data.map(function (array, i) {
					return function () {
						return Promise.ordered(array.map(function (datum, j) {
							return function () {
								return base.cell(`f${args.index}-cell-${i}-${j}`, {
									name: `${i}${j}`,
									appearance: {
										style: {
											'position': 'absolute',
											'height': `${base.size}px`,
											'width': `${base.size}px`,
											'background-color': base.colors[args.index],
											'border': '1px solid black',
											'top': `${i * base.size}px`,
											'left': `${j * base.size}px`,
										},
									},
								}).then(function (cell) {
									return face.setChildren([cell]);
								});
							}
						}));
					}
				})).then(function () {
					return face;
				});
			});
		}
		base.cell = function (id, args) {
			// cell displays a square of a single colour.
			// It contains coordinates of where it began, and where it ended.
			return UI.createComponent(id, args);
		}
		base.train = function () {
			// trains are containers holding three cells

		}
		return base.generate(cubeNetIndex).then(function () {
			return base;
		});
	});
}
