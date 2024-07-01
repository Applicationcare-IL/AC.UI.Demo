<template>
  <Story title="WMInputSearch (Sizes)" :layout="{ type: 'grid', width: '100%' }">
    <Variant title="Input text (xs - 60px)">
      <WMInputSearch name="default" type="input-text" label="Label" size="xs" :options="options" />
    </Variant>
    <Variant title="Input text (sm - 152px)">
      <WMInputSearch name="default" type="input-text" label="Label" size="sm" :options="options" />
    </Variant>

    <Variant title="Input text (md - 336px)">
      <WMInputSearch name="default" type="input-text" label="Label" size="md" :options="options" />
    </Variant>

    <Variant title="Input text (lg - 520px)">
      <WMInputSearch name="default" type="input-text" label="Label" size="lg" :options="options" />
    </Variant>

    <Variant title="Input text (xl - 704px)">
      <WMInputSearch name="default" type="input-text" label="Label" size="xl" :options="options" />
    </Variant>

    <Variant title="Input text (full - 100%)">
      <WMInputSearch
        name="default"
        type="input-text"
        label="Label"
        size="full"
        :options="options"
      />
    </Variant>
  </Story>
</template>
<script setup>
import { ref } from "vue";

const options = ref([
  { name: "Option 1", value: "1" },
  { name: "Option 2", value: "2" },
  { name: "Option 3", value: "3" },
  { name: "Option 4", value: "4" },
  { name: "Option 5", value: "5" },
  { name: "Option 6", value: "6" },
  { name: "Option 7", value: "7" },
  { name: "Option 8", value: "8" },
  { name: "Option 9", value: "9" },
  { name: "Option 10", value: "10" },
]);
</script>
