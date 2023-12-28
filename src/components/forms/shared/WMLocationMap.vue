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
import { watch } from "vue";
import { ref, onMounted } from "vue";

const myMapRef = ref(null);
let marker;
let geocoder;

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
});

watch(
  () => props.location,
  () => {
    geocode();
  },
  { deep: true }
);

const geocode = () => {
  if (!props.location.street || !props.location.city) return;
  myMapRef.value.$mapPromise.then((map) => {
    if (!marker) {
      marker = new window.google.maps.Marker();
      marker.setMap(map);
    }
    geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: getLocation() }, (results) => {
      map.panTo(results[0].geometry.location);

      marker.setPosition(results[0].geometry.location);
    });
  });
};

onMounted(() => {
  geocode();
});

const defaultCenter = ref({
  lat: 32.0853,
  lng: 34.7818,
});

const getLocation = () => {
  if (!props.location.street || !props.location.city) return;
  return `${props.location.street.value_he} ${props.location.house_number} , ${props.location.city.value_he}`;
};
</script>
