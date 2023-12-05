<template>
  <GMapMap
    :center="center"
    :zoom="15"
    style="width: 355px; height: 196px"
    :disableDefaultUI="true"
  >
    <GMapCluster>
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center = m.position"
      />
    </GMapCluster>
  </GMapMap>
</template>

<script setup>
import { ref } from "vue";

const center = ref({
  lat: 32.0853,
  lng: 34.7818,
});
const markers = ref([
  {
    position: {
      lat: 32.0853,
      lng: 34.7818,
    },
  },
  {
    position: {
      lat: 32.0853,
      lng: 34.7818,
    },
  },
  {
    position: {
      lat: 32.0853,
      lng: 34.7818,
    },
  },
]);
</script>
