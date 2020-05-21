import React, { useState, useEffect } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Menu from './Menu';
import { popup } from 'leaflet';


const floatStyle = {
    position: "fixed",
    width: "60px",
    height: "60px",
    top: "10px",
    right: "10px",
    borderRadius: "10px",
    textAlign: "center",
    zIndex: 1500
}

var mapZoom = 13;
const url = "http://localhost:8080/"
var geoposition = {};

const MapView = props => {
  const [position, setPosition] = useState([45, 45]);
  const [canPlacePin, setCanPlacePin] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [markers, setMarkers] = useState(
      <Marker position={position}>
        <Popup>Your current location</Popup>
      </Marker>
  )

  useEffect(() => {
    const [latitude, longitude] = position;
    fetch(`${url}api/${latitude}/${longitude}`)
      .then(resp => resp.json())
      .then(data => {
        setMarkers(
          data.map(tip => {
            const tipPos = [tip.lat, tip.lng];
            console.log(tip);
            return (
              <Marker position={tipPos}>
                <Popup>
                  {tip.tip}
                </Popup>
              </Marker>
            )
          })
        );
      });
  }, [position]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
    })
  }, []);
  return (
    <Map 
      center={position}
      zoom={mapZoom} 
      id="map"
      onClick={e => {
        if (canPlacePin) {
          geoposition = e.latlng;
          setModalShow(true);
          setCanPlacePin(!canPlacePin);
        }
      }} 
      onmoveend ={(e) => {
        mapZoom = e.target._zoom;
        const newPos = e.target.getCenter();
        setPosition([newPos.lat, newPos.lng]);
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <Menu
        show={modalShow}
        geoposition={geoposition}
        onHide={() => setModalShow(false)}
      />
      {markers}
      <button style={floatStyle} 
        onClick={()=>setCanPlacePin(!canPlacePin)}
      >
        <div 
          style={{ fontSize: "40px" }}
        >
          +
        </div>
      </button>
      <circle center={position} radius={200} ></circle>
    </Map>
  )
}

function App() {
  return (
    <div className="App"
    >
      <div style={{ height: '100vh' }}>
        <MapView>
          <Menu/>
        </MapView>
      </div>
    </div>
  );
}

export default App;
