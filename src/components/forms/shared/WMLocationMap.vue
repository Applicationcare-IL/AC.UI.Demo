<template>
  <GMapMap
    :center="defaultCenter"
    :zoom="15"
    style="width: 355px; height: 196px"
    :disableDefaultUI="false"
    ref="myMapRef"
  >
  </GMapMap>
</template>

<script setup>
import { ref, onMounted } from "vue";

const myMapRef = ref(null);
const myMarkerRef = ref(null);
let geocoder;

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  myMapRef.value.$mapPromise.then((map) => {
    geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: getLocation() }, (results) => {
      console.log(results);
      map.panTo(results[0].geometry.location);
      console.log(myMarkerRef.value);

      new window.google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
      });
    });
  });
});

const defaultCenter = ref({
  lat: 32.0853,
  lng: 34.7818,
});

const getLocation = () => {
  console.log(
    `${props.location.street} ${props.location.house_number} , ${props.location.city}`
  );
  return `${props.location.street.value} ${props.location.house_number} , ${props.location.city.value}`;
};
</script>
