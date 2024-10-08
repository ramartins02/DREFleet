import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

// Component to initialize Leaflet-Geoman controls and apply boundaries
function GeomanControls({ onAreaChange, color, bounds }) {
    const map = useMap();
    const polygonLayerRef = useRef(null);

    useEffect(() => {
        // Add Leaflet-Geoman controls
        map.pm.addControls({
            position: 'topleft',
            drawPolygon: true,
            drawMarker: false,
            drawPolyline: false,
            drawCircle: false,
            drawRectangle: false,
            editMode: true,
            dragMode: false,
            cutPolygon: false,
            removalMode: true,
        });
        map.pm.setLang('pt-br');

        // Restrict drawing to the defined boundaries
        map.on('pm:drawstart', (e) => {
            map.pm.setGlobalOptions({
                limitMarkersToCount: 50, // Example: Limit marker count
                limitMarkersToBoundary: true,
            });
        });

        // Enforce boundary restriction when drawing a polygon
        map.on('pm:create', (e) => {
            const layer = e.layer;
            const polygonCoordinates = layer.getLatLngs();
            polygonLayerRef.current = layer; // Save reference to the polygon

            // Apply the selected color to the polygon
            layer.setStyle({
                color: color,
                fillColor: color,
                fillOpacity: 0.4,
            });

            // Check if the polygon is within the boundary
            if (bounds && !bounds.contains(layer.getBounds())) {
                map.removeLayer(layer); // Remove the polygon if it's outside the boundary
                alert('Polygon must be within the defined area!');
            } else {
                onAreaChange(polygonCoordinates); // Send coordinates back to parent
            }
        });

    }, [map, color, bounds, onAreaChange]);

    useEffect(() => {
        // Update the polygon color whenever the color changes
        if (polygonLayerRef.current) {
            polygonLayerRef.current.setStyle({
                color: color,
                fillColor: color,
                fillOpacity: 0.4,
            });
        }
    }, [color]); // This effect runs whenever the color changes

    return null;
}

// Main component to render the map
export default function OrderRoutePolygon({ onAreaChange, color }) {
    // Define the boundary as LatLngBounds (southwest corner and northeast corner)
    const bounds = L.latLngBounds(
        [32.269181, -17.735033], // Southwest boundary
        [33.350247, -15.861279]  // Northeast boundary
    );

    return (
        <MapContainer
            center={[32.6443385, -16.9167589]}
            zoom={13}
            style={{ height: '500px', width: '100%' }}
            maxBounds={bounds} // Limit map panning and zooming to this area
            maxBoundsViscosity={1.0} // Make boundary strict
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {/* GeomanControls to manage drawing and polygon creation */}
            <GeomanControls onAreaChange={onAreaChange} color={color} bounds={bounds} />
        </MapContainer>
    );
}
