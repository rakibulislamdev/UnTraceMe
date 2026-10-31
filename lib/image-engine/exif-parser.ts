import exifr from "exifr";

export interface ExifParsedData {
  hasExif: boolean;
  hasGps: boolean;
  camera?: {
    make?: string;
    model?: string;
    software?: string;
    lensModel?: string;
  };
  shot?: {
    exposureTime?: string;
    fNumber?: string;
    iso?: number;
    focalLength?: string;
    dateTimeOriginal?: string;
    createDate?: string;
  };
  gps?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    googleMapsUrl: string;
    openStreetMapUrl: string;
  };
  rawMetadata: Record<string, any>;
}

export async function parseImageExif(file: File): Promise<ExifParsedData> {
  try {
    // Parse comprehensive tags including GPS, IPTC, XMP, TIFF, EXIF
    const rawData = await exifr.parse(file, {
      tiff: true,
      xmp: true,
      icc: false,
      iptc: true,
      jfif: true,
      ihdr: true,
    });

    const gpsData = await exifr.gps(file);

    if (!rawData && !gpsData) {
      return {
        hasExif: false,
        hasGps: false,
        rawMetadata: {},
      };
    }

    const data = rawData || {};

    const camera = {
      make: data.Make,
      model: data.Model,
      software: data.Software,
      lensModel: data.LensModel || data.LensInfo,
    };

    const shot = {
      exposureTime: data.ExposureTime ? `1/${Math.round(1 / data.ExposureTime)}s` : undefined,
      fNumber: data.FNumber ? `ƒ/${data.FNumber}` : undefined,
      iso: data.ISO || data.ISOSpeedRatings,
      focalLength: data.FocalLength ? `${data.FocalLength}mm` : undefined,
      dateTimeOriginal: data.DateTimeOriginal ? new Date(data.DateTimeOriginal).toLocaleString() : undefined,
      createDate: data.CreateDate ? new Date(data.CreateDate).toLocaleString() : undefined,
    };

    let gps: ExifParsedData["gps"] = undefined;

    if (gpsData && typeof gpsData.latitude === "number" && typeof gpsData.longitude === "number") {
      const lat = gpsData.latitude;
      const lon = gpsData.longitude;
      gps = {
        latitude: lat,
        longitude: lon,
        altitude: (gpsData as any).altitude,
        googleMapsUrl: `https://www.google.com/maps?q=${lat},${lon}`,
        openStreetMapUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`,
      };
    }

    return {
      hasExif: true,
      hasGps: Boolean(gps),
      camera,
      shot,
      gps,
      rawMetadata: data,
    };
  } catch (err) {
    return {
      hasExif: false,
      hasGps: false,
      rawMetadata: {},
    };
  }
}

