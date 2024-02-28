<template>
  <GMapMap
    ref="myMapRef"
    :center="defaultCenter"
    :zoom="15"
    :style="{
      width: props.size === 'small' ? '355px' : '710px',
      height: props.size === 'small' ? '196px' : '392px',
    }"
    :options="{
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      disableDefaultUi: false,
    }"
  >
    <GMapMarker
      v-for="(marker, index) in markers"
      v-if="location.city"
      :key="index"
      ref="myMarkerRef"
      :position="marker.position"
      :draggable="props.editable"
      @dragend="updateCoordinates"
    />
  </GMapMap>
</template>

<script setup>
import { inject, ref, watch } from "vue";
import { onMounted } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

//Props editable
const props = defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: "small",
  },
});

const myMapRef = ref(null);
const myMarkerRef = ref(null);
let geocoder;

const { location } = inject("location", {});

const defaultCenter = ref({
  lat: 32.0853,
  lng: 34.7818,
});

const markers = ref([
  {
    position: defaultCenter,
  },
]);

const geocode = () => {
  if (!location) return;
  if (!location.value.street || !location.value.city) return;

  myMapRef.value.$mapPromise.then((map) => {
    geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: getLocation() }, (results) => {
      map.panTo(results[0].geometry.location);
      markers.value[0].position = results[0].geometry.location;
    });
  });
};

const reverseGeocode = async () => {
  await myMapRef.value.$mapPromise.then(() => {
    geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      { location: markers.value[0].position },
      async (results) => {
        const address = results[0].address_components;

        const cityName = await findCityName(address);
        const streetName = await findStreetName(address);
        const houseNumberName = await findHouseNumber(address);

        location.value.house_number = houseNumberName;
        await optionSetsStore
          .getOptionSetValueByName("service_city", cityName, null)
          .then((city) => {
            location.value.city = city;
          });

        await optionSetsStore
          .getOptionSetValueByName(
            "service_street",
            streetName,
            location.value.city.id
          )
          .then((street) => {
            location.value.street = street;
          });
      }
    );
  });
};

async function findCityName(address) {
  const cityComponent = address.find((x) => x.types.includes("locality"));
  return cityComponent ? cityComponent.long_name : null;
}

async function findStreetName(address) {
  const streetComponent = address.find((x) => x.types.includes("route"));
  return streetComponent ? streetComponent.long_name : null;
}

async function findHouseNumber(address) {
  const houseNumberComponent = address.find((x) =>
    x.types.includes("street_number")
  );
  return houseNumberComponent ? houseNumberComponent.long_name : null;
}

const updateCoordinates = (e) => {
  markers.value[0].position = e.latLng;
  reverseGeocode();
};

const getsize = () => {
  if (props.size === "small") {
    return "width: 355px; height: 196px";
  } else {
    return "width: 710px; height: 392px";
  }
};

onMounted(() => {
  geocode();
});

//watch cont location value
watch(
  () => location.value,
  () => {
    geocode();
  }
);

const getLocation = () => {
  if (!location.value.street || !location.value.city) return;
  return `${location.value.street.value_he} ${location.value.house_number} , ${location.value.city.value_he}`;
};
</script>
