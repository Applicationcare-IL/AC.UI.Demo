<template>
  <div class="flex flex-column">
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('ID')"
      :value="contact.id"
      class="mb-3 w-full"
    />
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('name')"
      :value="contact.name"
      class="mb-3 w-full"
    />
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('phone')"
      :value="contact.phone"
      class="mb-3 w-full"
    />
    <WMInput
      name="address"
      type="info"
      :highlighted="true"
      :label="$t('email')"
      :value="contact.email"
      class="mb-3 w-full"
    />
  </div>
</template>

<script setup>
defineProps({
  contact: Object,
});
</script>

<style scoped lang="scss"></style>
