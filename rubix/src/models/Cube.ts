import ndarray, { NdArray } from "ndarray";
import zeros from "zeros";

export const colorMap = {
  0: "white",
  1: "yellow",
  2: "orange",
  3: "red",
  4: "green",
  5: "blue",
};

class Cubie {
  // id
  id: number;

  // orientation
  orientation: NdArray<number[]>;

  // 3x4 array of integers
  faces: NdArray<number[][]>;

  constructor(id: number, x: number, y: number, z: number) {
    this.id = id;
    this.orientation = ndarray([0, 0, 0]);
    this.faces = ndarray([]);
    this.initialize(x, y, z);
  }

  // initialize
  initialize(x: number, y: number, z: number) {    
    // create faces
    const faces = [];

    // Add faces based on cubie position on the cube boundaries
    if (x === 0) faces.push([-1, 0, 0, 3]); // -x face
    if (x === 2) faces.push([1, 0, 0, 2]); // +x face
  
    if (y === 0) faces.push([0, -1, 0, 4]); // -y face
    if (y === 2) faces.push([0, 1, 0, 5]); // +y face
  
    if (z === 0) faces.push([0, 0, -1, 0]); // -z face
    if (z === 2) faces.push([0, 0, 1, 1]); // +z face

    this.faces = ndarray(faces);
  }
}

class Cube {
  // cubieMap - map of cubie id to cubie
  cubieMap: Map<number, Cubie>;

  // 3x3x3 array of cubie ids
  cubies: NdArray<number[][][]>;

  constructor() {
    this.cubieMap = new Map<number, Cubie>();
    this.cubies = zeros([3, 3, 3]);
  }

  // initialize
  initialize() {
    // create cubies
    let id = 0;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const cubie = new Cubie(id, x, y, z);
          this.cubieMap.set(cubie.id, cubie);
          this.cubies.set(x, y, z, cubie.id);
          id++;
        }
      }
    }
  }

  // move(axis: number, layer: number, sense: number) {
  //   // create new array for this.cubies by translating existing cubies
  //   // Each cubie should also have its orientation updated, but faces should remain the same
  // }
}

export default Cube;