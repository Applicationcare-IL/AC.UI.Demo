<template>
  <div class="flex flex-column">
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('ID')"
      :value="service.id"
      class="mb-3 w-full"
    />
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('service_area')"
      :value="service.area[optionLabelWithLang]"
      class="mb-3 w-full"
    />
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('service_sub_area')"
      :value="service.type[optionLabelWithLang]"
      class="mb-3 w-full"
    />
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('request_1')"
      :value="service.request1[optionLabelWithLang]"
      class="mb-3 w-full"
    />
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('opening_date')"
      :value="service.open_date"
      class="mb-3 w-full"
    />
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('due_date')"
      :value="service.due_date"
      class="mb-3 w-full"
    />
    <WMInput
      v-if="service.stages.name"
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('stage')"
      :value="service.stages?.name"
      class="mb-3"
    />
  </div>
</template>

<script setup>
const { optionLabelWithLang } = useLanguages();

defineProps({
  service: Object,
});
</script>

<style scoped lang="scss"></style>
