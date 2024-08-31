/** Source: https://github.com/colbyfayock/gatsby-starter-leaflet/blob/master/src/lib/util.js */
export function isDomAvailable() {
  return (
    typeof window !== "undefined" &&
    !!window.document &&
    !!window.document.createElement
  );
}
