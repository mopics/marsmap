import React, { useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { Feature, Graticule } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { fromLonLat, toLonLat, transform } from 'ol/proj';

export const mapId = 'mars-map';
const elevationMOLA = 'http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/mola-color/';
const marsOPMBase = 'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png';
const marsVikingMDIM21 = 'http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/viking_mdim21_global/';
const shaded = 'http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/celestia_mars-shaded-16k_global/';

interface Props {

}

export const Marsmap: React.FC<Props> = () => {

    const mapRef = React.useRef<Map | null>(null);
    const vikingLayer = new TileLayer({
        opacity: 1,
        source: new XYZ({
            tileUrlFunction: (coordinate) => {

                return marsVikingMDIM21 +
                    coordinate[0] + '/' +
                    coordinate[1] + '/' +
                    // coordinate[2] + '.png';
                    (getNumRows(coordinate[0]) - coordinate[2]) + '.png';
            }
        })
    });
    const shadedLayer = new TileLayer({
        opacity: 1,
        source: new XYZ({
            tileUrlFunction: (coordinate) => {

                return shaded +
                    coordinate[0] + '/' +
                    coordinate[1] + '/' +
                    // coordinate[2] + '.png';
                    (getNumRows(coordinate[0]) - coordinate[2]) + '.png';
            }
        })
    });
    const molalayer = new TileLayer({
        opacity: 1,
        source: new XYZ({
            tileUrlFunction: (coordinate) => {

                return elevationMOLA +
                    coordinate[0] + '/' +
                    coordinate[1] + '/' +
                    // coordinate[2] + '.png';
                    (getNumRows(coordinate[0]) - coordinate[2]) + '.png';
            }
        })
    });
    const baseLayer = new TileLayer({
        opacity: .5,
        source: new XYZ({
            url: marsOPMBase
        })
    });

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
                    molalayer,
                    // shadedLayer,
                    // baseLayer,
                    new Graticule({ showLabels: true }),
                    vectorLayer
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 0,
                    // projection: 'EPSG:4326'
                }),
            });

            mapRef.current = map;
        }
    }, []);

    const getNumRows = (z: number) => {
        let nz = 4;

        for (let i = 2; i < z; i++) {
            nz = nz * 2;
        }

        return nz - 1;
    }

    return (<div style={{ width: '100vw', height: '100vh' }} id={mapId}></div>);
}

export default Marsmap;