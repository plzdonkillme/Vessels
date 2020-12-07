import BSPTree from '../../js/render/BSPTree';
import BSPNode from '../../js/render/BSPNode';
import Point from '../../js/render/Point';
import Vector from '../../js/render/Vector';
import Face from '../../js/render/Face';
import Edge from '../../js/render/Edge';

describe('BSPTree', () => {
  describe('sortPoints', () => {
    const p0 = new Point(0, 0, 0);
    const n = new Vector(0, 0, 1);

    it('should properly sort points on the same plane', () => {
      const points = Point.createFromBuffer([
        1, 1, 0,
        1, -1, 0,
        -1, -1, 0,
        -1, 1, 0,
      ]);
      const expFrontPoints = Point.createFromBuffer([
        1, 1, 0,
        1, -1, 0,
        -1, -1, 0,
        -1, 1, 0,
      ]);
      const expBackPoints = Point.createFromBuffer([
        1, 1, 0,
        1, -1, 0,
        -1, -1, 0,
        -1, 1, 0,
      ]);
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);
      expect(Point.arrayEquals(frontPoints, expFrontPoints)).to.be.true;
      expect(Point.arrayEquals(backPoints, expBackPoints)).to.be.true;
    });

    it('should properly sort points in front', () => {
      const points = Point.createFromBuffer([
        1, 1, 1,
        1, -1, 1,
        -1, -1, 1,
        -1, 1, 1,
      ]);
      const expFrontPoints = Point.createFromBuffer([
        1, 1, 1,
        1, -1, 1,
        -1, -1, 1,
        -1, 1, 1,
      ]);
      const expBackPoints = Point.createFromBuffer([]);
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);
      expect(Point.arrayEquals(frontPoints, expFrontPoints)).to.be.true;
      expect(Point.arrayEquals(backPoints, expBackPoints)).to.be.true;
    });

    it('should properly sort points in back', () => {
      const points = Point.createFromBuffer([
        1, 1, -1,
        1, -1, -1,
        -1, -1, -1,
        -1, 1, -1,
      ]);
      const expFrontPoints = Point.createFromBuffer([]);
      const expBackPoints = Point.createFromBuffer([
        1, 1, -1,
        1, -1, -1,
        -1, -1, -1,
        -1, 1, -1,
      ]);
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);
      expect(Point.arrayEquals(frontPoints, expFrontPoints)).to.be.true;
      expect(Point.arrayEquals(backPoints, expBackPoints)).to.be.true;
    });

    it('should properly sort points in front, mid, and back', () => {
      const points = Point.createFromBuffer([
        1, 1, -1,
        1, 0, 0,
        1, 1, 1,
      ]);
      const expFrontPoints = Point.createFromBuffer([
        1, 1, 0,
        1, 0, 0,
        1, 1, 1,
      ]);
      const expBackPoints = Point.createFromBuffer([
        1, 1, 0,
        1, 1, -1,
        1, 0, 0,
      ]);
      const { frontPoints, backPoints } = BSPTree.sortPoints(points, p0, n);
      expect(Point.arrayEquals(frontPoints, expFrontPoints)).to.be.true;
      expect(Point.arrayEquals(backPoints, expBackPoints)).to.be.true;
    });
  });

  describe('sortNodes', () => {
    const p0 = new Point(0, 0, 0);
    const n = new Vector(0, 0, 1);

    it('should properly sort nodes on same plane', () => {
      const face = Face.createFromBuffer([
        1, 1, 0,
        1, 0, 0,
        0, 0, 0,
      ]);
      const edges = Edge.createFromBuffer([
        face.getPoints()[0], face.getPoints()[1],
        face.getPoints()[1], face.getPoints()[2],
        face.getPoints()[2], face.getPoints()[0],
      ]);
      const node = new BSPNode(face.getPoints(), edges, face.getNormal(), face);
      const { frontNodes, backNodes, currNodes } = BSPTree.sortNodes([node], p0, n);
      expect(frontNodes).to.deep.equal([]);
      expect(backNodes).to.deep.equal([]);
      expect(currNodes).to.deep.equal([node]);
    });

    it('should properly sort nodes in front', () => {
      const face = Face.createFromBuffer([
        1, 1, 1,
        1, 0, 1,
        0, 0, 1,
      ]);
      const edges = Edge.createFromBuffer([
        face.getPoints()[0], face.getPoints()[1],
        face.getPoints()[1], face.getPoints()[2],
        face.getPoints()[2], face.getPoints()[0],
      ]);
      const node = new BSPNode(face.getPoints(), edges, face.getNormal(), face);
      const { frontNodes, backNodes, currNodes } = BSPTree.sortNodes([node], p0, n);
      expect(frontNodes).to.deep.equal([node]);
      expect(backNodes).to.deep.equal([]);
      expect(currNodes).to.deep.equal([]);
    });

    it('should properly sort nodes in back', () => {
      const face = Face.createFromBuffer([
        1, 1, -1,
        1, 0, -1,
        0, 0, -1,
      ]);
      const edges = Edge.createFromBuffer([
        face.getPoints()[0], face.getPoints()[1],
        face.getPoints()[1], face.getPoints()[2],
        face.getPoints()[2], face.getPoints()[0],
      ]);
      const node = new BSPNode(face.getPoints(), edges, face.getNormal(), face);
      const { frontNodes, backNodes, currNodes } = BSPTree.sortNodes([node], p0, n);
      expect(frontNodes).to.deep.equal([]);
      expect(backNodes).to.deep.equal([node]);
      expect(currNodes).to.deep.equal([]);
    });

    it('should properly split nodes', () => {
      const face = Face.createFromBuffer([
        1, 1, -1,
        1, 0, 0,
        1, 1, 1,
      ]);
      const edges = Edge.createFromBuffer([
        face.getPoints()[0], face.getPoints()[1],
        face.getPoints()[1], face.getPoints()[2],
        face.getPoints()[2], face.getPoints()[0],
      ]);
      const expectedFrontFace = Face.createFromBuffer([
        1, 1, 0,
        1, 0, 0,
        1, 1, 1,
      ]);
      const expectedBackFace = Face.createFromBuffer([
        1, 1, 0,
        1, 1, -1,
        1, 0, 0,
      ]);
      const node = new BSPNode(face.getPoints(), edges, face.getNormal(), face);
      const { frontNodes, backNodes, currNodes } = BSPTree.sortNodes([node], p0, n);

      expect(frontNodes).to.have.lengthOf(1);
      const frontFace = new Face(frontNodes[0].getPoints(), frontNodes[0].getNormal());
      expect(expectedFrontFace.equals(frontFace)).to.be.true;
      expect(frontNodes[0].getFace()).to.equal(face);

      expect(backNodes).to.have.lengthOf(1);
      const backFace = new Face(backNodes[0].getPoints(), backNodes[0].getNormal());
      expect(expectedBackFace.equals(backFace)).to.be.true;
      expect(backNodes[0].getFace()).to.equal(face);

      expect(currNodes).to.deep.equal([]);
    });
  });

  describe('addFaces', () => {
    const p = new Point(1, 0, -2);
    function traverse(bsp) {
      const sortedNodes = [];
      const fn = (node) => sortedNodes.push(node);
      bsp.traverse(fn, p);
      return sortedNodes;
    }

    it('should properly add faces without splitting', () => {
      const faces = [
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      const bsp = new BSPTree();
      bsp.addFaces(faces);
      const sortedNodes = traverse(bsp);
      expect(sortedNodes).to.have.lengthOf(3);

      const sortedFaces = sortedNodes.map((node) => new Face(node.getPoints(), node.getNormal()));
      const expSortedFaces = [
        [0, 0, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      expect(Face.arrayEquals(sortedFaces, expSortedFaces)).to.be.true;
    });

    it('should properly add faces with splitting', () => {
      const faces = [
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, -1, 0, 1, 1, 0, -1, 1, 0, -1, -1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      const bsp = new BSPTree();
      bsp.addFaces(faces);
      const sortedNodes = traverse(bsp);
      expect(sortedNodes).to.have.lengthOf(4);

      const sortedFaces = sortedNodes.map((node) => new Face(node.getPoints(), node.getNormal()));
      const expSortedFaces = [
        [0, 1, 0, 0, 1, 1, 0, -1, 1, 0, -1, 0],
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, -1, 0, 1, 0, 0, -1, 0, 0, -1, -1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      expect(Face.arrayEquals(sortedFaces, expSortedFaces)).to.be.true;
    });
  });

  describe('removeFaces', () => {
    const p = new Point(1, 0, -2);
    function traverse(bsp) {
      const sortedNodes = [];
      const fn = (node) => sortedNodes.push(node);
      bsp.traverse(fn, p);
      return sortedNodes;
    }

    it('should properly remove leaf', () => {
      const faces = [
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      let bsp = new BSPTree();
      bsp.addFaces(faces);
      bsp = BSPTree.removeFaces(bsp, [faces[1]]);
      const sortedNodes = traverse(bsp);
      expect(sortedNodes).to.have.lengthOf(2);

      const sortedFaces = sortedNodes.map((node) => new Face(node.getPoints(), node.getNormal()));
      const expSortedFaces = [
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      expect(Face.arrayEquals(sortedFaces, expSortedFaces)).to.be.true;
    });

    it('should properly remove single links', () => {
      const faces = [
        [0, 0, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      let bsp = new BSPTree();
      bsp.addFaces(faces);
      bsp = BSPTree.removeFaces(bsp, [faces[1]]);
      const sortedNodes = traverse(bsp);
      expect(sortedNodes).to.have.lengthOf(2);

      const sortedFaces = sortedNodes.map((node) => new Face(node.getPoints(), node.getNormal()));
      const expSortedFaces = [
        [0, 0, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      expect(Face.arrayEquals(sortedFaces, expSortedFaces)).to.be.true;
    });

    it('should properly redistribute', () => {
      const faces = [
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      let bsp = new BSPTree();
      bsp.addFaces(faces);
      bsp = BSPTree.removeFaces(bsp, [faces[0]]);
      const sortedNodes = traverse(bsp);
      expect(sortedNodes).to.have.lengthOf(2);

      const sortedFaces = sortedNodes.map((node) => new Face(node.getPoints(), node.getNormal()));
      const expSortedFaces = [
        [0, 0, 1, 1, 0, 1, 0, 1, 1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      expect(Face.arrayEquals(sortedFaces, expSortedFaces)).to.be.true;
    });

    it('should properly redistribute with splitting 1', () => {
      const faces = [
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, -1, 0, 1, 1, 0, -1, 1, 0, -1, -1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      let bsp = new BSPTree();
      bsp.addFaces(faces);
      bsp = BSPTree.removeFaces(bsp, [faces[1]]);
      const sortedNodes = traverse(bsp);
      expect(sortedNodes).to.have.lengthOf(2);

      const sortedFaces = sortedNodes.map((node) => new Face(node.getPoints(), node.getNormal()));
      const expSortedFaces = [
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      expect(Face.arrayEquals(sortedFaces, expSortedFaces)).to.be.true;
    });

    it('should properly redistribute with splitting 2', () => {
      const faces = [
        [0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, -1, 0, 1, 1, 0, -1, 1, 0, -1, -1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      let bsp = new BSPTree();
      bsp.addFaces(faces);
      bsp = BSPTree.removeFaces(bsp, [faces[0]]);
      const sortedNodes = traverse(bsp);
      expect(sortedNodes).to.have.lengthOf(3);

      const sortedFaces = sortedNodes.map((node) => new Face(node.getPoints(), node.getNormal()));
      const expSortedFaces = [
        [0, 1, 0, 0, 1, 1, 0, -1, 1, 0, -1, 0],
        [0, 1, -1, 0, 1, 0, 0, -1, 0, 0, -1, -1],
        [0, 0, -1, 1, 0, -1, 0, 1, -1],
      ].map((buff) => Face.createFromBuffer(buff));
      expect(Face.arrayEquals(sortedFaces, expSortedFaces)).to.be.true;
    });
  });
});
