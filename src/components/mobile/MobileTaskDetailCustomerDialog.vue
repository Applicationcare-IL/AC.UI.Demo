<template>
  <div class="flex flex-column">
    <WMInput
      name="customer_id"
      type="info"
      :highlighted="true"
      :label="$t('ID')"
      :value="customer.id"
      class="mb-3 w-full"
    />
    <WMInput
      name="type"
      type="info"
      :highlighted="true"
      :label="$t('type')"
      :value="customer.type[optionLabelWithLang]"
      class="mb-3 w-full"
    />
    <WMInput
      name="customer_name"
      type="info"
      :highlighted="true"
      :label="$t('name')"
      :value="customer.name"
      class="mb-3 w-full"
    />
    <WMInput
      name="customer_main_contact"
      type="info"
      :highlighted="true"
      :label="$t('name')"
      :value="customer.main_contact?.name"
      class="mb-3 w-full"
    />
    <WMInput
      name="customer_main_contact_phone"
      type="info"
      :highlighted="true"
      :label="$t('phone')"
      :value="customer.main_contact?.phone"
      class="mb-3 w-full"
    />
    <WMInput
      name="service_areas"
      type="info"
      :highlighted="true"
      :label="$t('service_areas')"
      :value="serviceAreas"
      class="mb-3 w-full"
    />

    <WMInput
      name="rating"
      type="info"
      :highlighted="true"
      :label="$t('rating')"
      :value="customer.rating[optionLabelWithLang]"
      class="mb-3 w-full"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
const { optionLabelWithLang } = useLanguages();

const props = defineProps({
  customer: Object,
});

const serviceAreas = computed(() => {
  return props.customer.service_areas
    .map((area) => {
      return area[optionLabelWithLang.value];
    })
    .join(", ");
});
</script>

<style scoped lang="scss"></style>
