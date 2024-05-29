<template>
  <Story title="WMInputCurrency" :layout="{ type: 'grid', width: '50%' }">
    <Variant title="Default (read only)">
      <WMInputCurrency v-model="state.modelValue" :read-only="true" :name="state.name" />
    </Variant>

    <Variant title="Small (read only)">
      <WMInputCurrency
        v-model="state.modelValue"
        :read-only="true"
        :name="state.name"
        :small="true"
      />
    </Variant>

    <Variant title="Default (editable)">
      <WMInputCurrency v-model="state.modelValue" :name="state.name" />
    </Variant>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

const state = reactive({
  modelValue: 0,
  name: "input-currency",
});
</script>
