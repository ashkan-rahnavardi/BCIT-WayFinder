import createGraph from 'ngraph.graph';

const navData = require('./nav_grid.json');

let path = require('ngraph.path');
let graph;

// This builds the graph data structure for the pathfinding. This code is parsing the data in the navData
// json, which describes which nodes link to which others. It is then being put into a proper graph structure
// which can be used by the ngraph library.
const buildNavGraph = (navData) => {
  graph = createGraph();

  navData.forEach(navNode => {
    graph.addNode(navNode.id, { lat: navNode.pos.lat, lng: navNode.pos.lng });
    navNode.next.forEach(nextNode => {
      graph.addLink(navNode.id, nextNode);
    });
  });
  console.log("Built navagation graph.");
  return graph;
}

// Finds the nearest node to a given {lat, lng} location. It iterates through every node in the map and
// calculates distance based on the pythagorean theorem, which is a good enough approximation over small
// distances (true distance requires using haversines).
const getNearest = (location) => {
  let nearest;
  let nearestId;

  navData.forEach(coord => {
    let distance = Math.sqrt(((location.lat - coord.pos.lat) ** 2) + ((location.lng - coord.pos.lng) ** 2));
    if (nearest == null || distance < nearest) {
      nearest = distance;
      nearestId = coord.id;
    }
  });
  return nearestId;
}

// Finds a path based on approximate distance calculated via pythagorean theorem. The "heuristic" part of the
// code here is an optimization that the library uses to make the calculation faster.
const findRoute = (graph, start, dest) => {
  let pathFinder = path.aStar(graph, {
    distance(fromNode, toNode) {
      let dx = fromNode.data.lng - toNode.data.lng;
      let dy = fromNode.data.lat - toNode.data.lat;
      return Math.sqrt(dx * dx + dy * dy);
    },
    heuristic(fromNode, toNode) {
      let dx = fromNode.data.lng - toNode.data.lng;
      let dy = fromNode.data.lat - toNode.data.lat;
      return Math.sqrt(dx * dx + dy * dy);
    }
  });

  let route = pathFinder.find(start, dest);
  return route;
}

// Draws the path along the map.
const createPath = (mapConfig, setMapConfig, currentLocation, lat, lng) => {
  let startId = getNearest(currentLocation);
  let destNodeId = getNearest({ lat: lat, lng: lng });
  let route = findRoute(graph, startId, destNodeId);

  let polyLinePath = route.map(navNode => {
    return { lat: navNode.data.lat, lng: navNode.data.lng };
  });

  // Delete the old path on the map if any. Without this, the new lines will be added on top of the
  // old ones. 
  mapConfig.poly.setMap(null);

  let mapRoute = new mapConfig.mapApi.Polyline({
    path: polyLinePath,
    strokeColor: "#000000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
  });

  // Save the reference to the new line to react state, this way we can clear it later.
  mapRoute.setMap(mapConfig.mapInstance);
  setMapConfig({ ...mapConfig, poly: mapRoute });
}

export { buildNavGraph, findRoute, createPath };

