import React, { useState, useEffect } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Menu from './Menu';


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

const MapView = props => {
  const [position, setPosition] = useState([45, 45]);
  const [canPlacePin, setCanPlacePin] = useState(false);
  const [modalShow, setModalShow] = useState(false);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
    })
  }, []);
  return (
    <Map 
      center={position}
      zoom={13} 
      id="map"
      onClick={e => {
        if (canPlacePin) {
          setModalShow(true);
          setCanPlacePin(!canPlacePin);
        }
      }} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <Menu
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <Marker position={position}>
        <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
      </Marker>
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
