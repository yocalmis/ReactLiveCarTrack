import {observer} from 'mobx-react-lite'
import car from './car.png'
import React, {useEffect, useState, useRef, useCallback} from 'react'
import {store} from './store'
import {DirectionsRenderer, GoogleMap , InfoWindow , Marker, useLoadScript} from "@react-google-maps/api";



const LatLng = (lat, lng) => (`${lat}, ${lng}`);

function App() {
  
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyBs6_yKxVZQECnfQoWx46VyHsCE3kJNwDs"
    })



    const [zoom, setZoom] = useState(18)
    const [arac, setArac] = useState("")	
    let [directions, setDirections] = useState(null)
    const [lastElement, setLastElement] = useState({ lat: 41.85, lng: -87.65 })
    const {markers} = store
    const [mapInstance, setMapInstance] = useState(null)
    const mapRef = useRef(null)

    const [addrtype, setAddrtype] = useState(["Otomobil", "Kamyon", "Otobüs"])
    const Add = addrtype.map(Add => Add
    )
  


    useEffect(() => {
        if (mapRef) {
            console.log('Harita, ', mapRef)
        }
    }, [mapRef])

    useEffect(() => {
        store.getMarkerPosition(arac)

        const intervalId = setInterval(() => {
        console.log(arac)
            store.getMarkerPosition(arac)

        }, 10 * 1000)

        return () => clearInterval(intervalId);
    }, [arac])

    useEffect(() => {
        if (markers) {

            const waypoints = markers.map((item, index) => {
                if(index !== 0 && index !== markers.length - 1) {
                    return {location: `${item.lat}, ${item.lng}`}
                }
            }).filter(_ => _)

            const google = window.google
            const lastel = markers[markers.length - 1]
            
            setLastElement(lastel)
            const DirectionsService = new google.maps.DirectionsService();

            
            const newZoom = mapInstance.getZoom()
            setZoom(newZoom)

            DirectionsService.route({
                origin: LatLng(markers[0].lat, markers[0].lng),
                destination: LatLng(markers[markers.length - 1].lat, markers[markers.length - 1].lng),
                optimizeWaypoints: false,
                waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    
                    setDirections(result)
                } else {
                    console.error("error fetching directions", result);
                }
            })
            
            
            mapInstance.setCenter({lat: lastel.lat, lng: lastel.lng})
        }
    }, [markers])
    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
    }
    const onLoad = _mapInstance => {
        setMapInstance(_mapInstance)
    }

    return (
        <div className="App">
            {isLoaded ? (
                <GoogleMap
                onLoad={onLoad}
                ref={mapRef}
                center={lastElement}
                zoom={zoom}
                mapContainerStyle={{
                width: '70%',
                height: '70vh'
            }}
                >
            {markers && <Marker icon={car} position={{ lat: lastElement.lat, lng: lastElement.lng }} >
            <InfoWindow
position={{ lat: lastElement.lat, lng: lastElement.lng }}
>
<div>
  <h1>InfoWindow</h1>
</div>
</InfoWindow>
            </Marker>}
            {directions && <DirectionsRenderer directions={directions} options={{suppressMarkers: true, preserveViewport: true}} />}
             

             
                </GoogleMap>

                ) : "Loading..."}
                         <p>Getirilen Araç : {arac} </p>
   
         < select
      onChange={ e => setArac(e.target.value)}
      className="browser-default custom-select" >
      {
        Add.map((address, key) => <option key={key} value={address}>{address}</option>)
      }
    </select >

        </div>
                        
    );
}


export default observer(App);

/*    const [count, setCount] = useState(0);
<button onClick={() => setArac("Kamyon")}>
Click me
</button> 

            <InfoWindow
      onLoad={onLoad}
      position={{ lat: lastElement.lat, lng: lastElement.lng }}
    >
      <div>
        <h1>InfoWindow</h1>
      </div>
    </InfoWindow>

*/