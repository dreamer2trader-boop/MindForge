import { useEffect } from "react";

export function PWAHead() {
  useEffect(() => {
    // Add viewport meta tag for mobile optimization
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.setAttribute("name", "viewport");
      document.head.appendChild(viewport);
    }
    viewport.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover");

    // Add meta tags for PWA
    const metaTags = [
      { name: "theme-color", content: "#00d4ff" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "NeonFlow" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "application-name", content: "NeonFlow" },
      { name: "description", content: "Premium gamified habit and task tracking app with XP, levels, and streaks" },
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    });

    // Add manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement("link");
      manifestLink.setAttribute("rel", "manifest");
      document.head.appendChild(manifestLink);
    }
    manifestLink.setAttribute("href", "/manifest.json");

    // Add apple touch icons
    const iconSizes = ["180x180", "167x167", "152x152", "120x120"];
    iconSizes.forEach((size) => {
      let appleIcon = document.querySelector(`link[rel="apple-touch-icon"][sizes="${size}"]`);
      if (!appleIcon) {
        appleIcon = document.createElement("link");
        appleIcon.setAttribute("rel", "apple-touch-icon");
        appleIcon.setAttribute("sizes", size);
        document.head.appendChild(appleIcon);
      }
      appleIcon.setAttribute("href", `/icon-${size.split("x")[0]}.png`);
    });

    // Add favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      document.head.appendChild(favicon);
    }
    favicon.setAttribute("href", "/icon-192.png");
  }, []);

  return null;
}
