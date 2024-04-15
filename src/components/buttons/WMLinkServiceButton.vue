<template>
  <WMTempButton
    :text="$t('buttons.link-services')"
    type="type-4"
    :is-disabled="selectedElements.length < 1"
    @click="toggle"
  >
    <template #customIcon>
      <div class="d-flex" v-html="TreeIcon" />
    </template>
  </WMTempButton>

  <OverlayPanel ref="op">
    <div class="flex flex-column w-15rem">
      <span class="h6 mb-1">{{ $t("service.relation-type") }}</span>
      <Dropdown
        v-model="selectedRelationType"
        :options="relationTypes"
        option-label="name"
        class="w-full md:w-10rem mb-5"
      />
      <WMTempButton class="ml-auto" :text="$t('service.link-service')" type="type-4" />
    </div>
  </OverlayPanel>
</template>

<script setup>
import { ref } from "vue";

import TreeIcon from "/icons/account_tree.svg?raw";

defineProps({
  selectedElements: Array,
});

const selectedRelationType = ref();
const relationTypes = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);

const op = ref();

const toggle = (event) => {
  op.value.toggle(event);
};
</script>

<style scoped></style>
