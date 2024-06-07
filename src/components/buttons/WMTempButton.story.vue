<template>
  <Story :layout="{ type: 'grid', width: '200px' }">
    <Variant title="Default">
      <WMTempButton :text="state.content" :is-active="state.active" type="type-1" />
    </Variant>

    <Variant title="Default (with custom icon)">
      <WMTempButton :text="state.content" :is-active="state.active" type="type-1">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="Type 3 (secondary)">
      <WMTempButton :text="state.content" type="secondary" :is-active="state.active" />
    </Variant>

    <Variant title="Type 3 (secondary) (small)">
      <WMTempButton
        :text="state.content"
        type="secondary"
        :is-active="state.active"
        size="small"
      >
      </WMTempButton>
    </Variant>

    <Variant title="Type-3 (secondary) (with custom icon)">
      <WMTempButton :text="state.content" type="secondary" :is-active="state.active">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="Type-3 (secondary) (small) (with custom icon)">
      <WMTempButton
        :text="state.content"
        type="secondary"
        :is-active="state.active"
        size="small"
      >
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="Type 4 (primary)">
      <WMTempButton :text="state.content" type="primary" :is-active="state.active" />
    </Variant>

    <Variant title="Type-4 (primary) (with custom icon)">
      <WMTempButton :text="state.content" type="primary" :is-active="state.active">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="Type-4 (primary) (with custom icon) (with badge)">
      <WMTempButton
        :text="state.content"
        type="primary"
        :is-active="state.active"
        badge="2"
        class="mt-2"
      >
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="Type 5">
      <WMTempButton :text="state.content" type="type-5" :is-active="state.active">
      </WMTempButton>
    </Variant>

    <Variant title="Type-5 (with custom icon)">
      <WMTempButton :text="state.content" type="type-5" :is-active="state.active">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="New">
      <WMTempButton :text="state.content" type="new" :is-active="state.active" />
    </Variant>

    <Variant title="New (with custom icon)">
      <WMTempButton :text="state.content" type="new" :is-active="state.active">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="Clear">
      <WMTempButton text="Clear" :is-active="state.active" type="clear" />
    </Variant>

    <Variant title="Cancel">
      <WMTempButton text="Cancel task" type="cancel" />
    </Variant>

    <Variant title="Cancel (small)">
      <WMTempButton text="Cancel task" type="cancel" size="small" />
    </Variant>

    <Variant title="Icon only">
      <WMTempButton :is-active="state.active" type="primary" :icon-only="true">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="Icon only (edit)">
      <WMTempButton :is-active="state.active" type="type-5" :icon-only="true">
        <template #customIcon>
          <div class="flex" v-html="EditIcon" />
        </template>
      </WMTempButton>
    </Variant>

    <Variant title="Icon only (save)">
      <WMTempButton :is-active="state.active" type="save" :icon-only="true">
        <template #customIcon>
          <div class="flex" v-html="SaveIcon" />
        </template>
      </WMTempButton>
    </Variant>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

import EditIcon from "/icons/edit_default.svg?raw";
import FilterIcon from "/icons/filter.svg?raw";
import SaveIcon from "/icons/save_default.svg?raw";

const state = reactive({
  content: "Button",
  active: false,
});
</script>
