import Cube from '../Cube';

describe('Cube', () => {
  it('should initialize', () => {
    const cube = new Cube();
    cube.initialize();
    expect(cube.cubieMap.size).toBe(27);
    expect(cube.cubies.shape).toEqual([3, 3, 3]);
  });
});