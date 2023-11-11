import React, { useEffect, useState } from "react";
import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import GoogleMapReact from "google-map-react";
import MapMarker from "./MapMarker";
import CenterMarker from "./CenterMarker";
import NavNode from "./NavNode";
import { buildNavGraph } from "./pathfinding";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import NavCard from "./SearchBar";

const locations = require('./locations.json');
const navData = require('./nav_grid.json');

const mapBounds = {
  north: 49.25525202301286,
  south: 49.24127188170095,
  east: -122.99542519679582,
  west: -123.00638180711358,
};

const mapCenter = {
  lat: 49.24896943891257,
  lng: -123.00189476728642
};

const defaultZoom = 18;
const ash = 2;

const navGraph = buildNavGraph(navData);

let counter = 0;

export default function App() {
  const [mapConfig, setMapConfig] = useState();
  const [currentLocation, setCurrentLocation] = useState(mapCenter);
  const [searchedLocation, setSearchedLocation] = useState();

  const handleMapClick = (lat, lng) => {
    setCurrentLocation({ lat: lat, lng: lng });
    console.log(`(${lat}, ${lng}), `);

    // const infoWindow = new mapConfig.mapApi.InfoWindow();
    // infoWindow.setPosition({lat: lat, lng: lng});
    // infoWindow.setContent(`${counter}`);
    // counter++;
    // infoWindow.open(mapConfig.mapInstance);

  }

  const handleApiLoaded = (map, maps) => {
    const campusOverlay = new maps.GroundOverlay(
      "NoTextsIcons.png",
      mapBounds
    );
    campusOverlay.setMap(map);

    // Starts blank, we update this later via route finding functionality
    let mapRoute = new maps.Polyline({
    });
    mapRoute.setMap(map);

    // Store the map references in global state so we can use it in other componenets.
    setMapConfig({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
      poly: mapRoute
    });

    // This is mostly copied from the API documentation and serves as a proof of concept.
    // The button should be part of the main UI, but this serves as a prototype. It also
    // currently doesn't work if you are outside of map bounds! We need to detect this
    // and display a suitable message.
    const infoWindow = new maps.InfoWindow();
    const locationButton = document.createElement("button");
    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    locationButton.setAttribute("id", "locationButton");
    map.controls[maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(pos);
            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            map.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    });

    const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    }
  };

  const findCoord = (name) => {

    let location = {};

    for (const [key, value] of Object.entries(locations)) {

      if (value.title === name) {
        // coords['lat'] = value.lat;
        // coords['lng'] = value.lng;
        location = value

      }
    }
    return location;
  }


  const searchLocation = (event, value) => {

    let location = findCoord(value);

    let coord = {};

    coord['lat'] = location.lat;
    coord['lng'] = location.lng;

    setSearchedLocation(location);
    // handleMapClick(coord.lat, coord.lng);

    mapConfig.mapInstance.setCenter(coord);


    console.log(coord)

  }

  let searchBar = (
    <Box>
      <Autocomplete
        // freeSolo
        sx={{ width: 196, height: 46 }}
        onChange={searchLocation}
        id="free-solo-2-demo"
        disableClearable
        options={locations.map((option) => option.title)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Locations"
            size="small"
            InputProps={{
              ...params.InputProps,
              type: 'search',
              style: {
                height: 46,
              }
            }}
          />
        )}
      />
    </Box>
  )

  const clear = () => {
    setSearchedLocation(null);
  }

  useEffect(() => {
    console.log(searchedLocation);
  }, [searchedLocation]);

  const nav = NavCard(searchBar, mapConfig);

  const mapMarkers = () => {

    let markers = [];

    if (!searchedLocation) {
      locations.map(({ lat, lng, id, title, type, label, desc }) => {

        markers.push(
          <MapMarker
            key={id}
            lat={lat}
            lng={lng}
            text={label}
            markerType={type}
            tooltip={title}
            mapConfig={mapConfig}
            setMapConfig={setMapConfig}
            currentLocation={currentLocation}
            searchAlert={false}
            zoomState={true}
            desc={desc}
            clear={clear}
          />
        )
      })
    } else {
      markers.push(
        <MapMarker
          key={searchedLocation.id}
          lat={searchedLocation.lat}
          lng={searchedLocation.lng}
          text={searchedLocation.id}
          markerType={searchedLocation.type}
          tooltip={searchedLocation.title}
          mapConfig={mapConfig}
          setMapConfig={setMapConfig}
          currentLocation={currentLocation}
          searchAlert={true}
          zoomState={true}
          clear={clear}
        />
      )
    }

    return markers;
  }

  const mapMarkersRedraw = (zoom) => {

    let markers = [];

    if (!searchedLocation) {
      locations.map(({ lat, lng, id, title, type }) => {

        markers.push(
          <MapMarker
            key={id}
            lat={lat}
            lng={lng}
            text={id}
            markerType={type}
            tooltip={title}
            mapConfig={mapConfig}
            setMapConfig={setMapConfig}
            currentLocation={currentLocation}
            searchAlert={false}
            zoomState={zoom}
          />
        )
      })
    } else {
      markers.push(
        <MapMarker
          key={searchedLocation.id}
          lat={searchedLocation.lat}
          lng={searchedLocation.lng}
          text={searchedLocation.id}
          markerType={searchedLocation.type}
          tooltip={searchedLocation.title}
          mapConfig={mapConfig}
          setMapConfig={setMapConfig}
          currentLocation={currentLocation}
          searchAlert={true}
          zoomState={true}
        />
      )
    }

    return markers;
  }

  let markers = mapMarkers();

  let currentZoom = defaultZoom;

  const handleZoomChanged = (zoom) => {
    if (currentZoom != zoom) {
      let zoomState = (zoom < 19)
      if (zoom < 18) {
        console.log("redraw markers as small");
        // markers = mapMarkersRedraw(zoomState);
      }
      else {
        console.log("redraw markers as large");
        // markers = mapMarkersRedraw(zoomState);
      }
      currentZoom = zoom;
    }
  }

  return (
    <div className="App">
      {/* {searchBar()} */}
      {nav}
      <GoogleMapReact
        bootstrapURLKeys={{
          // Key needs to be defined in .env file, in root of client directory.
          key: process.env.REACT_APP_MAP_API_KEY,
          language: "en",
          region: "US"
        }}
        defaultCenter={mapCenter}
        defaultZoom={defaultZoom}
        fullscreenControl={false}
        onChange={({ center, zoom, bounds, marginBounds }) => handleZoomChanged(zoom)}
        options={{
          restriction: {
            latLngBounds: mapBounds,
            strictBounds: true,
          }
        }}
        yesIWantToUseGoogleMapApiInternals={true}
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        onClick={({ lat, lng }) => handleMapClick(lat, lng)}
      >
        <CenterMarker lat={currentLocation.lat} lng={currentLocation.lng} />

        {markers}
        {/* {navData.map(({ id, pos, next }) => {
          if (id % 1 === 0) {
            return (
              <NavNode
                key={id}
                lat={pos.lat}
                lng={pos.lng}
                next={next}
                mapConfig={mapConfig}
                setMapConfig={setMapConfig}
                currentLocation={currentLocation}
                id={id}
                nav={navData}
                graph={navGraph}
              />
            );
          }
        })} */}
      </GoogleMapReact>
    </div>
  );
}
