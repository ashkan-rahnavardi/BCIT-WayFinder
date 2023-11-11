import React, { useEffect, useState } from "react";
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import IconButton from '@mui/material/IconButton';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsIcon from '@mui/icons-material/Directions';
import Alert from '@mui/material/Alert';
import "./styles.css";

export default function NavCard(SearchBar, mapConfig) {

    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        const crd = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        const coords = {
            lat: crd.latitude,
            lng: crd.longitude
        }

        mapConfig.mapInstance.setCenter(coords);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        
        return (
            <Alert severity="error">Error: {err.message}</Alert>
        )
    }

    const getLocation = () => {
        console.log("Getting location");
        if (navigator.geolocation) {
            console.log("Geolocation is supported!");
            navigator.geolocation.getCurrentPosition(success, error, options);
        } else {
            console.warn("Geolocation is not supported for this Browser/OS version yet.");
        }
    }

    const navButtons = (
        <div id='navButtonsContainer'>
            <IconButton aria-label="location" size="medium" onClick={getLocation}><MyLocationIcon /></IconButton>
            <div class="vr"></div>
            <IconButton aria-label="directions" color="primary" size="medium"><DirectionsIcon /></IconButton>
        </div>
    )

    const menu = (
        <ListGroup >
            <ListGroupItem>Do something</ListGroupItem>
            <ListGroupItem>Do something</ListGroupItem>
            <ListGroupItem>Do something</ListGroupItem>
        </ListGroup>
    )
    return (
        <div id="NavCard">
            <IconButton aria-label="menu" onClick={handleShow}><MenuIcon /></IconButton>
            {SearchBar}
            {navButtons}
            <Offcanvas show={show} onHide={handleClose} >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>BCIT Wayfinder</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {menu} 
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}

