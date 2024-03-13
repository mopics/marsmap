import { Feature, Map, MapBrowserEvent, Overlay } from "ol";
import { LineString, Polygon } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw } from "ol/interaction";
import Style from "ol/style/Style";
import { getArea, getLength } from 'ol/sphere.js';
import { unByKey } from "ol/Observable";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import { EventsKey } from "ol/events";

export class MeasureTool {

    source = new VectorSource();
    vectorLayer = new VectorLayer({
        source: this.source,
        style: {
            'fill-color': 'rgba(255, 255, 255, 0.2)',
            'stroke-color': '#ffcc33',
            'stroke-width': 2,
            'circle-radius': 7,
            'circle-fill-color': '#ffcc33',
        }
    });
    style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2,
        }),
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
        }),
    });

    sketch?: Feature;
    helpTooltipElement?: HTMLElement;
    helpTooltip?: Overlay;
    measureTooltipElement?: HTMLElement;
    measureTooltip?: Overlay;
    continuePolygonMsg = 'Click to continue drawing the polygon';
    continueLineMsg = 'Click to continue drawing the line';
    draw?: Draw;


    constructor() {
        this.helpTooltipElement = this.createHelpTooltipDiv();
        this.measureTooltipElement = this.createMeasureTooltipDiv();
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        this.helpTooltip = this.createHelpTooltip();
        this.measureTooltip = this.createMeasureTooltip();
    }

    createHelpTooltipDiv = () => {
        if (this.helpTooltipElement) {
            this.helpTooltipElement.parentNode!.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'ol-tooltip hidden';
        return this.helpTooltipElement;
    }

    createHelpTooltip = () => {
        this.helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        // this.map.addOverlay(this.helpTooltip); TODO do outside of class
        return this.helpTooltip;
    }

    createMeasureTooltipDiv = () => {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode!.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        return this.measureTooltipElement;
    }

    createMeasureTooltip() {
        const measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        });
        // map.addOverlay(measureTooltip);
        return measureTooltip;
    }

    pointerMoveHandler = (evt: MapBrowserEvent<any>) => {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        let helpMsg = 'Click to start drawing';

        if (this.sketch) {
            const geom = this.sketch.getGeometry();
            if (geom instanceof Polygon) {
                helpMsg = this.continuePolygonMsg;
            } else if (geom instanceof LineString) {
                helpMsg = this.continueLineMsg;
            }
        }

        this.helpTooltipElement!.innerHTML = helpMsg;
        this.helpTooltip?.setPosition(evt.coordinate);

        this.helpTooltipElement!.classList.remove('hidden');
    }

    formatArea = (polygon: Polygon) => {
        const area = getArea(polygon);
        let output;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
        }
        return output;
    };

    formatLength = (line: LineString) => {
        const length = getLength(line);
        let output;
        if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        }
        return output;
    };

    addInteraction(map: Map) {
        const type = 'LineString'; // typeSelect.value == 'area' ? 'Polygon' : 'LineString';
        this.draw = new Draw({
            source: this.source,
            type: type,
            style: (feature) => {
                const geometryType = feature.getGeometry()!.getType();
                if (geometryType === type || geometryType === 'Point') {
                    return this.style;
                }
            },
        });
        map.addInteraction(this.draw);

        let listener: EventsKey;
        this.draw.on('drawstart', (evt) => {
            // set sketch
            this.sketch = evt.feature;

            /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
            let tooltipCoord = evt.target.getGeometry().getLastCoordinate();

            listener = this.sketch.getGeometry()!.on('change', (evt) => {
                const geom = evt.target;
                let output;
                if (geom instanceof Polygon) {
                    output = this.formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = this.formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                this.measureTooltipElement!.innerHTML! = output ?? '';
                this.measureTooltip!.setPosition(tooltipCoord);
            });
        });

        this.draw.on('drawend', () => {
            this.measureTooltipElement!.className = 'ol-tooltip ol-tooltip-static';
            this.measureTooltip!.setOffset([0, -7]);
            // unset sketch
            this.sketch = undefined;
            // unset tooltip so that a new one can be created
            this.measureTooltipElement = undefined;
            this.measureTooltip = this.createMeasureTooltip();
            unByKey(listener);
        });
    }
}