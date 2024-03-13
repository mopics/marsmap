import { Coordinate } from "ol/coordinate";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const ELEVATION_SHADED_MOLA = 'http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/mola-color/';
export const OPM = 'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png';
export const VIKING_MDIM21 = 'http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/viking_mdim21_global/';
export const COLOR_SHADED = 'http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/celestia_mars-shaded-16k_global/';

export class MarsTileLayers {

    opmLayer = new TileLayer({
        opacity: .8,
        source: new XYZ({
            url: OPM
        })
    });

    vikingLayer = new TileLayer({
        opacity: 1,
        source: new XYZ({
            tileUrlFunction: (coordinate: Coordinate) => {

                return VIKING_MDIM21 +
                    coordinate[0] + '/' +
                    coordinate[1] + '/' +
                    // coordinate[2] + '.png';
                    (this.getNumRows(coordinate[0]) - coordinate[2]) + '.png';
            }
        })
    });

    colorShadedLayer = new TileLayer({
        opacity: 1,
        source: new XYZ({
            tileUrlFunction: (coordinate) => {

                return COLOR_SHADED +
                    coordinate[0] + '/' +
                    coordinate[1] + '/' +
                    // coordinate[2] + '.png';
                    (this.getNumRows(coordinate[0]) - coordinate[2]) + '.png';
            }
        })
    });

    molaShadelayer = new TileLayer({
        opacity: 1,
        source: new XYZ({
            tileUrlFunction: (coordinate) => {

                return ELEVATION_SHADED_MOLA +
                    coordinate[0] + '/' +
                    coordinate[1] + '/' +
                    // coordinate[2] + '.png';
                    (this.getNumRows(coordinate[0]) - coordinate[2]) + '.png';
            }
        })
    });

    constructor() {

    }

    getNumRows = (z: number) => {
        let nz = 4;

        for (let i = 2; i < z; i++) {
            nz = nz * 2;
        }

        return nz - 1;
    }
}