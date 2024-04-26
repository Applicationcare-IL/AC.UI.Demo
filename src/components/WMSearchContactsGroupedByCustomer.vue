<template>
  <MultiSelect
    v-model="selectedCities"
    :options="groupedCities"
    option-label="label"
    option-group-label="label"
    option-group-children="items"
    display="chip"
    :placeholder="$t('contact.search-contacts')"
    filter
    :show-toggle-all="false"
  >
    <template #optiongroup="slotProps">
      <div class="flex align-items-center">
        <img
          :alt="slotProps.option.label"
          src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`"
          style="width: 18px"
        />
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
  </MultiSelect>
</template>

<script setup>
import { ref } from "vue";

const selectedCities = ref();
const groupedCities = ref([
  {
    label: "Germany",
    code: "DE",
    items: [
      { label: "Berlin", value: "Berlin" },
      { label: "Frankfurt", value: "Frankfurt" },
      { label: "Hamburg", value: "Hamburg" },
      { label: "Munich", value: "Munich" },
    ],
  },
  {
    label: "USA",
    code: "US",
    items: [
      { label: "Chicago", value: "Chicago" },
      { label: "Los Angeles", value: "Los Angeles" },
      { label: "New York", value: "New York" },
      { label: "San Francisco", value: "San Francisco" },
    ],
  },
  {
    label: "Japan",
    code: "JP",
    items: [
      { label: "Kyoto", value: "Kyoto" },
      { label: "Osaka", value: "Osaka" },
      { label: "Tokyo", value: "Tokyo" },
      { label: "Yokohama", value: "Yokohama" },
    ],
  },
]);
</script>
