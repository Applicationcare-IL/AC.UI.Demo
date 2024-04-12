<template>
  <Story :layout="{ type: 'grid', width: '50%' }">
    <Variant title="Default">
      <WMTempButton
        :text="state.content"
        :is-active="state.active"
        type="type-1"
      />
    </Variant>

    <Variant title="Default (with custom icon)">
      <WMTempButton
        :text="state.content"
        :is-active="state.active"
        type="type-1"
      >
        <template #customIcon>
          <div class="d-flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="Filter blue">
      <WMTempButton
        :text="state.content"
        type="type-5"
        :is-active="state.active"
      >
      </WMTempButton>
    </Variant>

    <Variant title="Filter blue (with custom icon)">
      <WMTempButton
        :text="state.content"
        type="type-5"
        :is-active="state.active"
      >
        <template #customIcon>
          <div class="d-flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

import FilterIcon from "/icons/filter.svg?raw";

const state = reactive({
  content: "Button",
  active: false,
});
</script>
