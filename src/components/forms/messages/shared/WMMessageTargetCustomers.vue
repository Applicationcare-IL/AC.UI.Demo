<template>
  <div class="flex flex-column gap-3">

    <div class="wm-form-label highlighted">{{ $t('message.organization-type') }}:</div>
    <div class="flex gap-3">
      <WMSelectableButton
          v-model="isPrivate"
          :label="$t('private')"
      />

      <WMSelectableButton
          v-model="isBusiness"
          :label="$t('message.business')"
      />
    </div>

    <WMInputSearch
        name="customer_service_areas"
        :label="$t('message.service-area') + ':'"
        :placeholder="$t('message.select-service-area')"
        :multiple="true"
        size="md"
        :options="areas"
        :highlighted="true"
    />

    <div class="wm-form-label highlighted">{{ $t('rating') }}:</div>
    <div class="flex gap-3">
      <WMSelectableButton
          v-model="isNormal"
          :label="$t('message.normal')"
      />

      <WMSelectableButton
          v-model="isVip"
          :label="$t('message.vip')"
      />
    </div>

  </div>
</template>

<script setup>
// IMPORTS
import {onMounted, ref} from "vue";

import {useOptionSetsStore} from "@/stores/optionSets";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();

// INJECT

// PROPS, EMITS

// REFS
const isPrivate = ref(false);
const isBusiness = ref(false);

const areas = ref([])

const isNormal = ref(false);
const isVip = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  const serviceAreaOptions = optionSetsStore
      .getOptionSetValuesFromApiRaw("service_area")
      .then((data) => (areas.value = data));
});
</script>

<style scoped></style>
