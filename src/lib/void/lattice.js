import { Delaunay } from 'd3-delaunay';
import { createNoise3D } from 'simplex-noise';

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

export function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed) {
  let state = hashString(String(seed));
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function localDateSeed(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function millisecondsUntilLocalMidnight(date = new Date()) {
  const midnight = new Date(date);
  midnight.setHours(24, 0, 1, 0);
  return midnight.getTime() - date.getTime();
}

export function fitBoxToViewport({
  centerX,
  centerY,
  width,
  height,
  viewportWidth,
  viewportHeight,
  inset = 16
}) {
  const safeInset = Math.max(0, Math.min(inset, (viewportWidth - 1) / 2, (viewportHeight - 1) / 2));
  const safeWidth = Math.max(1, Math.min(width, viewportWidth - safeInset * 2));
  const safeHeight = Math.max(1, Math.min(height, viewportHeight - safeInset * 2));
  return {
    width: safeWidth,
    height: safeHeight,
    x: clamp(centerX - safeWidth / 2, safeInset, viewportWidth - safeInset - safeWidth),
    y: clamp(centerY - safeHeight / 2, safeInset, viewportHeight - safeInset - safeHeight)
  };
}

function makeSites(count, width, height, random) {
  const aspect = width / height;
  const columns = Math.max(1, Math.ceil(Math.sqrt(count * aspect)));
  const rows = Math.ceil(count / columns);
  const slots = Array.from({ length: columns * rows }, (_, index) => index);

  for (let index = slots.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [slots[index], slots[target]] = [slots[target], slots[index]];
  }

  return Array.from({ length: count }, (_, index) => {
    const slot = slots[index];
    const column = slot % columns;
    const row = Math.floor(slot / columns);
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    const x = (column + 0.5 + (random() - 0.5) * 0.46) * cellWidth;
    const y = (row + 0.5 + (random() - 0.5) * 0.46) * cellHeight;
    return [clamp(x, 24, width - 24), clamp(y, 24, height - 24)];
  });
}

function vertexKey(point) {
  return `${point[0].toFixed(3)},${point[1].toFixed(3)}`;
}

function samePoint(first, second) {
  return Math.abs(first[0] - second[0]) < 0.001 && Math.abs(first[1] - second[1]) < 0.001;
}

function polygonBounds(points) {
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys)
  };
}

function polygonArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current[0] * next[1] - next[0] * current[1];
  }
  return Math.abs(area) / 2;
}

function boundarySide(vertex, width, height) {
  if (Math.abs(vertex.baseX) < 0.01) return 'left';
  if (Math.abs(vertex.baseX - width) < 0.01) return 'right';
  if (Math.abs(vertex.baseY) < 0.01) return 'top';
  if (Math.abs(vertex.baseY - height) < 0.01) return 'bottom';
  return '';
}

function edgeKey(firstId, secondId) {
  return firstId < secondId ? `${firstId}:${secondId}` : `${secondId}:${firstId}`;
}

export function buildLattice(posts, { width, height, seed }) {
  const random = seededRandom(`${seed}:${width}x${height}:${posts.length}`);
  const sites = makeSites(posts.length, width, height, random);
  const delaunay = Delaunay.from(sites);
  const voronoi = delaunay.voronoi([0, 0, width, height]);
  const vertices = [];
  const vertexIds = new Map();

  const cells = posts.map((post, cellIndex) => {
    const rawPolygon = voronoi.cellPolygon(cellIndex) || [];
    const polygon = rawPolygon.length > 1 && samePoint(rawPolygon[0], rawPolygon.at(-1))
      ? rawPolygon.slice(0, -1)
      : rawPolygon;

    const ids = polygon.map((point) => {
      const key = vertexKey(point);
      let id = vertexIds.get(key);
      if (id === undefined) {
        id = vertices.length;
        vertexIds.set(key, id);
        vertices.push({ id, baseX: point[0], baseY: point[1], cells: [] });
      }
      if (!vertices[id].cells.includes(cellIndex)) vertices[id].cells.push(cellIndex);
      return id;
    });

    const bounds = polygonBounds(polygon);
    return {
      index: cellIndex,
      post,
      siteX: sites[cellIndex][0],
      siteY: sites[cellIndex][1],
      vertexIds: ids,
      area: polygonArea(polygon),
      cellWidth: bounds.width,
      cellHeight: bounds.height,
      breathPhase: random() * Math.PI * 2,
      breathRate: 0.72 + random() * 0.42,
      d: ''
    };
  });

  const edges = new Map();
  for (const cell of cells) {
    for (let index = 0; index < cell.vertexIds.length; index += 1) {
      const firstId = cell.vertexIds[index];
      const secondId = cell.vertexIds[(index + 1) % cell.vertexIds.length];
      const key = edgeKey(firstId, secondId);
      if (edges.has(key)) continue;
      const first = vertices[Math.min(firstId, secondId)];
      const second = vertices[Math.max(firstId, secondId)];
      const length = Math.hypot(second.baseX - first.baseX, second.baseY - first.baseY);
      const sharedBoundary = boundarySide(first, width, height);
      const isOuterEdge = sharedBoundary && sharedBoundary === boundarySide(second, width, height);
      edges.set(key, {
        firstId: first.id,
        secondId: second.id,
        isOuterEdge,
        length,
        midpointX: (first.baseX + second.baseX) / 2,
        midpointY: (first.baseY + second.baseY) / 2,
        bendStart: isOuterEdge ? 0 : (random() - 0.5) * clamp(length * 0.36, 8, 30),
        bendEnd: isOuterEdge ? 0 : (random() - 0.5) * clamp(length * 0.36, 8, 30),
        noiseOffset: random() * 1000
      });
    }
  }

  return {
    width,
    height,
    seed,
    cells,
    vertices,
    edges,
    noise3D: createNoise3D(seededRandom(`${seed}:noise`))
  };
}

function animatedVertices(lattice, time, activeCellIndex, focusStrength) {
  const frequency = 0.005;
  const timeScale = time * 0.000045;
  const activeCell = activeCellIndex === null ? null : lattice.cells[activeCellIndex];
  const focusRadius = activeCell
    ? Math.max(activeCell.cellWidth, activeCell.cellHeight) * 2.3
    : 0;
  const focusExpansion = activeCell
    ? clamp(Math.min(activeCell.cellWidth, activeCell.cellHeight) * 0.34, 16, 58) * focusStrength
    : 0;

  return lattice.vertices.map((vertex) => {
    let x = vertex.baseX + lattice.noise3D(
      vertex.baseX * frequency,
      vertex.baseY * frequency,
      timeScale
    ) * 3.8;
    let y = vertex.baseY + lattice.noise3D(
      vertex.baseX * frequency + 47,
      vertex.baseY * frequency - 31,
      timeScale
    ) * 3.8;

    for (const cellIndex of vertex.cells) {
      const cell = lattice.cells[cellIndex];
      const dx = vertex.baseX - cell.siteX;
      const dy = vertex.baseY - cell.siteY;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const pulse = Math.sin(time * 0.00042 * cell.breathRate + cell.breathPhase) * 1.7;
      x += (dx / distance) * pulse;
      y += (dy / distance) * pulse;
    }

    if (activeCell && focusStrength > 0) {
      const dx = vertex.baseX - activeCell.siteX;
      const dy = vertex.baseY - activeCell.siteY;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const isMembrane = vertex.cells.includes(activeCellIndex);
      const falloff = Math.max(0, 1 - distance / focusRadius);
      const pressure = isMembrane ? 1 : falloff * falloff * 0.42;
      x += (dx / distance) * focusExpansion * pressure;
      y += (dy / distance) * focusExpansion * pressure;
    }

    if (Math.abs(vertex.baseX) < 0.01 || Math.abs(vertex.baseX - lattice.width) < 0.01) x = vertex.baseX;
    if (Math.abs(vertex.baseY) < 0.01 || Math.abs(vertex.baseY - lattice.height) < 0.01) y = vertex.baseY;
    return { x, y };
  });
}

function pathForCell(lattice, cell, positions, time) {
  if (!cell.vertexIds.length) return '';
  const first = positions[cell.vertexIds[0]];
  let path = `M${first.x.toFixed(2)},${first.y.toFixed(2)}`;

  for (let index = 0; index < cell.vertexIds.length; index += 1) {
    const fromId = cell.vertexIds[index];
    const toId = cell.vertexIds[(index + 1) % cell.vertexIds.length];
    const from = positions[fromId];
    const to = positions[toId];
    const edge = lattice.edges.get(edgeKey(fromId, toId));
    const forward = fromId === edge.firstId;
    const start = forward ? from : to;
    const end = forward ? to : from;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const normalX = -dy / length;
    const normalY = dx / length;
    const livingBend = edge.isOuterEdge
      ? 0
      : lattice.noise3D(
        edge.midpointX * 0.004,
        edge.midpointY * 0.004,
        time * 0.000035 + edge.noiseOffset
      ) * clamp(edge.length * 0.08, 2, 8);
    const controlOne = {
      x: start.x + dx * 0.3 + normalX * (edge.bendStart + livingBend),
      y: start.y + dy * 0.3 + normalY * (edge.bendStart + livingBend)
    };
    const controlTwo = {
      x: start.x + dx * 0.7 + normalX * (edge.bendEnd - livingBend),
      y: start.y + dy * 0.7 + normalY * (edge.bendEnd - livingBend)
    };
    const firstControl = forward ? controlOne : controlTwo;
    const secondControl = forward ? controlTwo : controlOne;
    path += ` C${firstControl.x.toFixed(2)},${firstControl.y.toFixed(2)} ${secondControl.x.toFixed(2)},${secondControl.y.toFixed(2)} ${to.x.toFixed(2)},${to.y.toFixed(2)}`;
  }

  return `${path} Z`;
}

export function renderLattice(lattice, time = 0, activeCellIndex = null, focusStrength = 0) {
  const positions = animatedVertices(lattice, time, activeCellIndex, focusStrength);
  return lattice.cells.map((cell) => ({
    ...cell,
    d: pathForCell(lattice, cell, positions, time)
  }));
}
