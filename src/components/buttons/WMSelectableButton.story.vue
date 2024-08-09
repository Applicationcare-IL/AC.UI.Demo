<template>
  <Story :layout="{ type: 'grid', width: '50%' }">
    <Variant title="With check symbol">
      <WMSelectableButton v-model="state.disabled" label="Selectable Button" />
    </Variant>

    <Variant title="No check symbol">
      <WMSelectableButton v-model="state.disabled" label="Selectable Button" no-icon />
    </Variant>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

const state = reactive({
  content: "Selectable Button",
  disabled: false,
});
</script>
