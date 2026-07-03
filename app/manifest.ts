import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Elegant Drapes Order Tracker",
    short_name: "Elegant Drapes",
    description: "Order and profit tracker for Elegant Drapes",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f4f7f5",
    theme_color: "#0f766e",
    orientation: "portrait"
  };
}
