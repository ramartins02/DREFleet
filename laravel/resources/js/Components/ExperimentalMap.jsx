import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

function Routing({ waypoints }) {

    const map = useMap();

    useEffect(() => {
        if (!map || waypoints.length < 2) return;

        const routingControl = L.Routing.control({
            waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
            routeWhileDragging: true,
            showAlternatives: true,
            altLineOptions: {
                styles: [
                    {
                        color: 'red',
                    },
                    {
                        color: 'blue',
                    },
                    {
                        color: 'grey',
                    }
                ],
            },
        }).addTo(map);

        routingControl.on('routesfound', function (e) {
            console.log('routes found ', e.routes)                      // TODO: CHECK THIS CONSOLE.LOG
            const trajectory = e.routes[0].coordinates;

            // Pass the trajectory waypoints back to the form through the callback
            //onTrajectoryChange(trajectory);          // TODO: Change waypoints with coordinates property, CHECK ABOVE console.log
        });

        return () => map.removeControl(routingControl);
    }, [map, waypoints]);

    return null;
}

export default function ExperimentalMap({ waypoints }) {
    console.log(waypoints)
    return (
        <MapContainer center={[32.6443385, -16.9167589]} zoom={12} style={{ height: '500px', width: '100%' }}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Routing waypoints={waypoints} />
        </MapContainer>
    );
}
