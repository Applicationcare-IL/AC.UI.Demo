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
import { ref, onMounted, watchEffect } from "vue";

const myMapRef = ref(null);
let marker;
let geocoder;

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  watchEffect(() => {
    console.log(props.location.house_number);
    geocode();
  });
});

const geocode = () => {
  if (!props.location.street || !props.location.city) return;
  myMapRef.value.$mapPromise.then((map) => {
    marker = new window.google.maps.Marker();
    geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: getLocation() }, (results) => {
      map.panTo(results[0].geometry.location);
      marker.setMap(map);
      marker.setPosition(results[0].geometry.location);
    });
  });
};

const defaultCenter = ref({
  lat: 32.0853,
  lng: 34.7818,
});

const getLocation = () => {
  if (!props.location.street || !props.location.city) return;
  return `${props.location.street.value_he} ${props.location.house_number} , ${props.location.city.value_he}`;
};
</script>
