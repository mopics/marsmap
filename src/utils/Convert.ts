// https://www.usgs.gov/faqs/how-much-distance-does-a-degree-minute-and-second-cover-your-maps#:~:text=One%20degree%20of%20latitude%20equals,one%2Dsecond%20equals%20101%20feet.

import { Coordinate } from "ol/coordinate";

// https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html

//                              Mars    Earth   ratio
// Equatorial radius (km)	    3396.2	6378.1	0.532
// Polar radius (km)	        3376.2	6356.8	0.531
// Volumetric mean radius (km)	3389.5	6371.0	0.532
// Core radius (km)	            1830**	3485	0.525
// Ellipticity (Flattening)	    0.00589	0.00335	1.76

// Mars Equatorial Circumference	    21,344 km
// Mars Polar Circumference	            21,376 km
// Mars Volumetric Mean Circumference	21,297 km

// Earth Equatorial Circumference	    40,075 km
// Earth Polar Circumference	        40,008 km
// Earth Volumetric Mean Circumference	40,075 km

// Earth 1 degree of Lat = 111.32 km
// Earth 1 degree of Lon = 111.32 km * cos( latitude )

// Mars 1 degree of Lat = 111.32 km * 0.532 = 59.15 km
// Mars 1 degree of Lon = 59.15 km * cos( latitude )

export const earthMtToMarsMt = (coord: Coordinate): Coordinate => {
    return [coord[0] * 0.532, coord[1] * 0.532];
}
export const marsMtToEarthMt = (coord: Coordinate): Coordinate => {
    return [coord[0] / 0.532, coord[1] / 0.532];
}