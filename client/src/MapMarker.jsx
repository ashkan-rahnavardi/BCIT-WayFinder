import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { createPath } from "./pathfinding";

const MapMarker = ({ lat, lng, text, markerType, tooltip, mapConfig, setMapConfig, currentLocation, searchAlert, zoomState, clear }) => {
  const [show, setShow] = useState(searchAlert);
  const [zoom, setZoom] = useState(zoomState);
  // const [searched, setSearched] = useState(searchAlert);

  const handleClose = () => {
    setShow(false);
    clear();
  }
  const handleShow = () => {
    console.log(`You clicked on ${tooltip} (${markerType})`);
    setShow(true);
  };
  
  useEffect(() => {
    setShow(searchAlert)
  }, [searchAlert])   // [searchAlert] as a second param makes it so useEffect is only
                      // called if searchAlert's value changes

  const handleRoute = () => {
    console.log(lat, lng);
    createPath(mapConfig, setMapConfig, currentLocation, lat, lng);
    setShow(false);
    console.log('searchAlert');
  }

  const classTypes = (zoomState)? `${markerType} bigMarker`: `${markerType} smallMarker`;

  const building = () => {
    return (
      <Card >
      <Card.Img variant="top" src="https://media.architecturaldigest.com/photos/579120d446eb3e65136a5213/master/w_2580%2Cc_limit/buzzworthy-buildings-brooklyn-03.jpg" />
      <Card.Body>
        <Card.Text>
        A detailed description of the building would go here. {lat}, {lng}
        </Card.Text>
      </Card.Body>
    </Card>
    )
  }

  const modalButtons = () => {
    return (
      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="primary" onClick={handleRoute}>
            Find Route
        </Button>
    </Container>

    )
  }

  const modalContent = () => {
    return (
      <ListGroup>
      <ListGroupItem>{building()}</ListGroupItem>
      <ListGroupItem>{modalButtons()}</ListGroupItem>
    </ListGroup>
    )
  }

  return (
    <>
      <div className={classTypes} onClick={handleShow}>
      </div>
      <div className="circleText" title={tooltip}>
          {text}
      </div>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{tooltip}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {modalContent()}
        </Offcanvas.Body>
      </Offcanvas>

      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{tooltip}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {desc}
          {desc.length === 0 && <>A detailed description of the building would go here. {lat}, {lng}</>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRoute}>
            Find Route
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>

  );
};

export default MapMarker;
