class Edge {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  getP1() {
    return this.p1;
  }

  getP2() {
    return this.p2;
  }

  equals(e, strict = true) {
    if (this.p1 == null && this.p2 == null) {
      return e.getP1() == null && e.getP2() == null;
    }
    if (this.p1 == null) {
      return e.getP1() == null && this.p2.equals(e.getP2(), strict);
    }
    if (this.p2 == null) {
      return this.p1.equals(e.getP1(), strict) && e.getP2() == null;
    }
    return this.p1.equals(e.getP1(), strict) && this.p2.equals(e.getP2(), strict);
  }

  static createFromBuffer(buffer) {
    if (buffer.length % 2 !== 0) {
      throw Error('createFromBuffer must receive a buffer whose length is a multiple of 2');
    }
    const edges = [];
    for (let i = 0; i < buffer.length; i += 2) {
      edges.push(new Edge(buffer[i], buffer[i + 1]));
    }
    return edges;
  }

  static arrayEquals(edges1, edges2, strict = true) {
    if (edges1.length !== edges2.length) {
      return false;
    }
    for (let i = 0; i < edges1.length; i += 1) {
      if (!edges1[i].equals(edges2[i], strict)) {
        return false;
      }
    }
    return true;
  }
}

export default Edge;
