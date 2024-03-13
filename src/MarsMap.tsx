import React, { useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { Feature, Graticule } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { MarsTileLayers } from './layers/MarsTileLayers';
import { MeasureTool } from './tools/MeasureTool';

export const mapId = 'mars-map';
const tileLayers = new MarsTileLayers();
const measureTool = new MeasureTool();

interface Props {

}

export const Marsmap: React.FC<Props> = () => {

    const mapRef = React.useRef<Map | null>(null);

    const vectorLayer = new VectorLayer({
        source: new VectorSource({
            features: [
                new Feature({
                    geometry: new Point(fromLonLat([-113.55, -.5])),
                    name: 'Lave Tubes at Pavonis Mons'
                })
            ]
        })
    })

    useEffect(() => {
        if (mapRef.current == null) {
            const map = new Map({
                target: mapId,
                layers: [
                    tileLayers.molaShadelayer,
                    tileLayers.opmLayer,
                    new Graticule({ showLabels: true }),
                    vectorLayer
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 0,
                    // projection: 'EPSG:4326'
                }),
            });

            measureTool.addInteraction(map);
            mapRef.current = map;
        }
    }, []);

    return (<div style={{ width: '100vw', height: '100vh' }} id={mapId}></div>);
}

export default Marsmap;