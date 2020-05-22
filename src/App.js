import React, { useState, useEffect } from 'react';
import { 
  Map,
  Marker,
  Popup,
  TileLayer,
  Circle
} from 'react-leaflet';
import Menu from './Menu';
//import { popup, Circle } from 'leaflet';


const floatStyle = {
    position: "fixed",
    width: "60px",
    height: "60px",
    bottom: "10px",
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
        data = data.map(tip =>{
          tip.lat = Math.floor(tip.lat * 100)/100.0;
          tip.lng = Math.floor(tip.lng * 100)/100.0;
          return tip;
        });
        const aggTips = {};
        data.forEach(tip => {
          const key = `${tip.lat}${tip.lng}`;
          console.log(tip);
          if(key in aggTips){
            aggTips[key].count = aggTips[key].count + 1;
            aggTips[key].tip = aggTips[key].tip + tip.tip;
            aggTips[key].subtotal = aggTips[key].subtotal + tip.sub_total;
          }
          else{
            aggTips[key] = {
              count: 1,
              tip: tip.tip,
              subtotal: tip.sub_total,
              lat: tip.lat,
              lng: tip.lng
            }
          }
        });
        data = aggTips;
        console.log(aggTips);
        const maxMeanTip = Object.keys(data).reduce((acc, key) => {
          const tip = data[key];
          const meanTip = tip.tip / tip.count;
          if(meanTip > acc)
            return meanTip;
          else
            return acc;
        }, 0);
        setMarkers(
          Object.keys(data).map(key => {
            const tip = data[key];
            const tipPos = [tip.lat, tip.lng];
            console.log(maxMeanTip);
            return (
              <>
                <Marker position={tipPos}>
                  <Popup>
                    <h3>
                      Tips
                  </h3>
                    <b>Average Amount: </b>${tip.tip / tip.count}
                    <br/>
                    <b>Average Percent : </b>{(() => {
                      const tipPercent = tip.tip / (tip.tip + tip.subtotal) * 100;
                      return tipPercent.toFixed(2)
                    })()
                    }%
                  </Popup>
                </Marker>
                <Circle
                  center={tipPos}
                  radius={(tip.tip / tip.count) * (340 / maxMeanTip) + 50}
                >
                </Circle>
              </>
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
