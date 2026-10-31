"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ArrowRight01Icon, GlobeIcon } from "hugeicons-react";

interface ExifMapProps {
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  openStreetMapUrl: string;
}

export function ExifMap({
  latitude,
  longitude,
  googleMapsUrl,
  openStreetMapUrl,
}: ExifMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Custom dark pin icon
    const customIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: #5e6ad2;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 14px rgba(94, 106, 210, 0.7);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    // CartoDB Dark Matter tiles (Linear-style dark aesthetic)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        subdomains: "abcd",
      }
    ).addTo(map);

    L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div className="space-y-3">
      {/* Map Viewport */}
      <div
        ref={mapContainerRef}
        data-lenis-prevent
        className="w-full h-64 rounded-lg border border-border overflow-hidden bg-[#010102]"
      />

      {/* External Map Direct Links */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="font-mono text-muted-foreground text-[11px]">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
        <div className="flex items-center gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline flex items-center gap-1 font-medium text-xs"
          >
            Google Maps
            <ArrowRight01Icon className="size-3" />
          </a>
          <span className="text-border">•</span>
          <a
            href={openStreetMapUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
          >
            OpenStreetMap
            <ArrowRight01Icon className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

