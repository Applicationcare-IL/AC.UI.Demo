<template>
  <Story title="WMInput (Sizes)" :layout="{ type: 'grid', width: '100%' }">
    <Variant title="Input text (xs - 60px)">
      <WMInput name="default" type="input-text" label="Label" size="xs" />
    </Variant>
    <Variant title="Input text (sm - 152px)">
      <WMInput name="default" type="input-text" label="Label" size="sm" />
    </Variant>

    <Variant title="Input text (md - 336px)">
      <WMInput name="default" type="input-text" label="Label" size="md" />
    </Variant>

    <Variant title="Input text (lg - 520px)">
      <WMInput name="default" type="input-text" label="Label" size="lg" />
    </Variant>

    <Variant title="Input text (xl - 704px)">
      <WMInput name="default" type="input-text" label="Label" size="xl" />
    </Variant>

    <Variant title="Input text (full - 100%)">
      <WMInput name="default" type="input-text" label="Label" size="full" />
    </Variant>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

const state = reactive({
  modelValue: 0,
  name: "input",
});
</script>
