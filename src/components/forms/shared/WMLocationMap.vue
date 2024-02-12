<template>
  <GMapMap
    :center="defaultCenter"
    :zoom="15"
    style="width: 355px; height: 196px"
    :disableDefaultUI="false"
    ref="myMapRef"
  >
    <GMapMarker
      v-for="(marker, index) in markers"
      :key="index"
      ref="myMarkerRef"
      :position="marker.position"
      :draggable="true"
      @dragend="updateCoordinates"
    />
  </GMapMap>
  <!-- <pre>
    {{ markers[0].position }}
    {{ location }}
  </pre> -->
</template>

<script setup>
import { inject, ref } from "vue";
import { onMounted } from "vue";

import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

const myMapRef = ref(null);
const myMarkerRef = ref(null);
let geocoder;

// const emit = defineEmits(["locationUpdated"]);

const { location } = inject("location");

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
  if (!location.value.street || !location.value.city) return;
  console.log("geocode 2");
  console.log(location.street);
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
        //update the location object
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

onMounted(() => {
  geocode();
});

const getLocation = () => {
  if (!location.value.street || !location.value.city) return;
  return `${location.value.street.value_he} ${location.value.house_number} , ${location.value.city.value_he}`;
};
</script>
