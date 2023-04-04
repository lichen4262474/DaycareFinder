mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: daycare.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
  .setLngLat(daycare.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      "<h3>${daycare.title}</h3><p>${daycare.location}</p>"
    )
  )
  .addTo(map);
