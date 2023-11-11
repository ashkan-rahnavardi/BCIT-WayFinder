import React, { useState } from 'react';
import { findRoute } from "./pathfinding";
import createGraph from 'ngraph.graph';

let path = require('ngraph.path');

const NavNode = ({ key, lat, lng, next, mapConfig, setMapConfig, currentLocation, id, nav, graph }) => {

  const getNearest = (start) => {
    let nearest;
    let nearestId;

    nav.forEach(coord => {
      let distance = Math.sqrt(((start.lat - coord.pos.lat) ** 2) + ((start.lng - coord.pos.lng) ** 2));
      if (nearest == null || distance < nearest) {
        nearest = distance;
        nearestId = coord.id;
      }
    });
    return nearestId;
  }

  const handleClick = () => {
    let start = getNearest(currentLocation);
    let dest = id;
    console.log(start, dest);

    // This stuff is for debugging purposes. Uncomment it to see the whole nav mesh by clicking.
    //
    // let nextCoords = next.map(key => {
    //   return {lat: nav[key].pos.lat, lng: nav[key].pos.lng}
    // });

    // nextCoords.forEach(coord => {
    //   let path = [{lat: lat, lng: lng}, {lat: coord.lat, lng: coord.lng}]
    //   let mapRoute = new mapConfig.mapApi.Polyline({
    //     path: path,
    //     strokeColor: "#000000",
    //     strokeOpacity: 1.0,
    //     strokeWeight: 3,
    //   });
    //   mapRoute.setMap(mapConfig.mapInstance);
    // });

    let route = findRoute(graph, start, dest);

    let polyLinePath = route.map(navNode => {
      return { lat: navNode.data.lat, lng: navNode.data.lng };
    });

    mapConfig.poly.setMap(null);

    let mapRoute = new mapConfig.mapApi.Polyline({
      path: polyLinePath,
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
    mapRoute.setMap(mapConfig.mapInstance);
    setMapConfig({...mapConfig, poly: mapRoute});
  }

  return (
    <>
      <div className="building" onClick={handleClick}>
        <span className="circleText">
          {id}
        </span>
      </div>
    </>

  );
};

export default NavNode;
