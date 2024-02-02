# BCIT Wayfinder

My second academic project at BCIT. The original repo is no longer available. 

Date: February 2023              Team: 3 People

## Demo
Live demo available [here](https://www.ashkans.world/projects/WayFinder)

## Description
### Context 
New students and faculty were having difficulty navigating the BCIT campus. The only resource available to them was a downloadable PDF map available on the BCIT website.
  
Google maps does not work for foot paths on campus, so students and faculty would have to go back and forth between google maps and the PDF map.

### Scope
This project was developed as a proof of concept wayfinding application for the BCIT Burnaby campus. My team consisted of myself and two other students, and we were given 4 x 1 week sprints for development.
  
The main focus of the project was developing a way to get accurate foot path data from the campus, and creating a frontend which would use this data to show the shortest path between any two given points.

### Objective
The goal of this project was to create a MVP wayfinding mobile application for the BCIT Burnaby campus. The application would be able to geolocate the user on the campus, and provide them with directions to their destination.

### Challenges

The biggest challenge we faced was the lack of data for footpaths on campus. To generate this data we created a JSON to represent the intersections and corners of footpaths on campus. 

We then developed a python script which would interpolate the nodes between the corners and intersections to create a more accurate representation of the footpaths on campus.

### Implementation

Since we were only developing a prototype we decided to focus solely on the wayfinding aspect of the app. This allowed us to focus on the core functionality and not get bogged down by the additional features that would be required for a full-fledged app.

We ruled out the need to connect the app to a database. Instead, we created a JSON file with the data we needed and used the Google Maps API to display the data on the map.

### UI/UX
The UI/UX of the app was designed to closely mimic that of Google Maps in order to minimize the learning curve for users. Familiar navigation icons and layouts were employed to make the app easy to understand and use for those already familiar with Google Maps.

The map view, search bar, and menu options were all modeled after the well-known Google Maps interface to ensure a seamless transition for users.

### Next Steps
More accurate footpath data is required to improve the functionality of the app. This data could be crowd sourced by students and staff and would include routes that go through buildings and other areas that are not currently included in the app.

An admin control panel would be required to allow for updating the map, and sending out alerts to all users. This would allow for the app to be used for emergency situations such as fire alarms and lockdowns.

### Technical Overview

This is a technical overview of the app which tries to explain how everything works and fits together. Sections are organized by folder, then individual files, and then the contents of those files.

#### 1. /Assets

Contains various scripts and resources used for building the project.

#### 1.1. /Assets/build_nav_mesh.py

A python script that parses a list of coordinates and outputs them into a json format used by the app. The json is written to the same folder. The script contains a list of coordinates already, which were ones we used for building the app's data.

The coordinatess were obtained by simply clicking points on the map and using coordinate pairs printed out into the console.

The outputted json still requires some manual data entry to select which nodes connect to which others.

#### 1.2. /Assets/Building Coordinates w Names.xls

Excel file containing building coordinates and names, provided by BCIT. Covers Burnaby campus.

#### 1.3. /Assets/excel_to_json.py

Script for converting the excel file into a format usable by the app. This data is used for placing the map markers.

#### 1.3. /Assets/refine_grid.py

After running build_nav_mesh.py and setting the adjacent nodes (in the 'next' field), run this script on the data to interpolate notes between the manually defined ones. This will create a more fine-grained navigation graph that has nodes all along the defined paths. The script also contains additional settings which are disabled by default, and have not been as thoroughly tested.

#### 1.4. /Assets/update_locations.py

This was used to parse the json and add additional fields to it, without overwriting anything. This script probably won't be useful as-is but if you ever need to make changes to the data structure, you can use this as a reference for how to do it easily and efficiently.

### 2. /client

Contains the React app itself.

#### 2.1. /client/public

Auto-generated static files created by React. The index.html here will only be served if something goes wrong.

#### 2.2. /client/.env

This is not included in the repository! You must create a .env file and set REACT_APP_MAP_API_KEY to your Google Maps API key.

#### 2.3. /client/package.json and package-lock.json

Dependency information and project configuration for node. Make sure to commit these whenever installing new packages.

#### 2.4. /client/src

The source code and other data for the app itself.

#### 2.4.1. /client/src/App.css

Default stylesheet created by React. We have not made any changes to this file.

#### 2.4.2. /client/src/styles.css

Custom styles used by the app. Make changes here if you want to configure how the app looks.

#### 2.4.3. /client/src/reportWebVitals.js and setupTests.js

Auto-generated by react. These have not been modified.

#### 2.4.4. /client/src/App.js

This is the main component for the wayfinder app and contains most of the code and high level logic for rendering it. A few critical sections are worth pointing out.

const handleApiLoaded
This callback contains code that directly access the maps API. Some features are accessed through a react wrapper, but the stuff here is just raw api code.

const MapMarkers
Logic for rendering map markers. This returns an array of markers that is used by the actual rendering code. It will either return a list of all the markers available, or a single marker that is your currently searched location.

GoogleMapReact element
This is part of a lightweight wrapper library that lets us use React with Google Maps fairly seamlessly. Features that are not available in the wrapper can be accessed through the handleApiLoaded callback. A block of commented out code exists here for debugging purposes. If you uncomment it, the app will render text on the map showing navigation nodes.

mapConfig object and setMapConfig
This object contains references to the map, the API, and the currently drawn path. It is passed down to various components when they need to access the map API or map itself. setMapConfig is only called when the path needs to be updated to store a reference to it. The state of the map itself is handled by google maps.

#### 2.4.5. /client/src/BottomButtons.js

Component for buttons that are displayed in the hamburger menu. This is just a placeholder that renders the UI element. There is no real functionality.

#### 2.4.6. /client/src/CenterMarker.jsx

Component displayed on the map for the user's current location. Just a div with some css. If you want to add additional functionality or styling to the current location marker, this is where you can add it.

#### 2.4.7. /client/src/DropDown.js

Dropdown menu component for searching and filtering map locations.

#### 2.4.8. /client/src/index.js

Entrypoint for the app. Contains the App element.

#### 2.4.9. /client/src/locations.json

Building and food vendor locations, with lat/lng coordinates, names, and description fields. If you want to add additional locations, they should go in this file. The app will parse it and add the markers automatically as long as the coordinates are within bounds.

#### 2.4.10. /client/src/MapMarker.jsx

Component for location map markers. This contains the logic for displaying the modal window when you click the markers. There is a callback which invokes pathfinding as well, although the pathfinding logic is not contained here.

#### 2.4.11. /client/src/nav_grid.json

This is a mostly autogenerated file containing the raw data for the pathfinding. It is similar to locations.json, but is used for routes instead of buildings.

#### 2.4.12. /client/src/NavNode.jsx

Component for displaying the nodes on the map itself, for debugging purposes. This is not rendered by default.

#### 2.4.13. /client/src/pathfinding.js

Contains code for building the navigation graph datastructure, as well as the pathfinding logic. The graph is built using the nav_grid.json data. The graph is then sent to an algorithm which calulates the route.

There is also code for drawing the path on the map and updating the react state accordingly.

#### 2.4.14. /client/src/SearchBar.js

Component for the search bar at the top of the UI.
