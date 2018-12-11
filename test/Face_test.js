import Face from '../js/Face';

describe('Face', () => {
  describe('findParentEdges', () => {
    it('should correctly return parent edges', () => {
      const parentFace = Face.createFromBuffer([
        0, 0, 100,
        0, 100, 100,
        100, 100, 100,
        100, 0, 100,
      ]);
      const face = Face.createFromBuffer([
        0, 25, 100,
        0, 75, 100,
        100, 75, 100,
        100, 25, 100,
      ]);
      const parentEdges = face.findParentEdges(parentFace);
      expect(parentEdges).to.deep.equal([[0, 1], [2, 3]]);
    });

    it('should correctly return parent edges 2', () => {
      const parentFace = Face.createFromBuffer([
        0, 0, 100,
        0, 100, 100,
        100, 100, 100,
        100, 0, 100,
      ]);
      const face = Face.createFromBuffer([
        0, 0, 100,
        0, 100, 100,
        100, 100, 100,
        100, 0, 100,
      ]);
      const parentEdges = face.findParentEdges(parentFace);
      expect(parentEdges).to.deep.equal([[0, 1], [1, 2], [2, 3], [0, 3]]);
    });
  });
});
