<template>
  <Story :layout="{ type: 'grid', width: '200px' }">
    <Variant title="Default">
      <WMButton :text="state.content" :is-active="state.active" type="type-1" />
    </Variant>

    <Variant title="Default (with custom icon)">
      <WMButton :text="state.content" :is-active="state.active" type="type-1">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Type 3 (secondary)">
      <WMButton :text="state.content" type="secondary" :is-active="state.active" />
    </Variant>

    <Variant title="Type 3 (secondary) (small)">
      <WMButton :text="state.content" type="secondary" :is-active="state.active" size="small">
      </WMButton>
    </Variant>

    <Variant title="Type-3 (secondary) (with custom icon)">
      <WMButton :text="state.content" type="secondary" :is-active="state.active">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Type-3 (secondary) (small) (with custom icon)">
      <WMButton :text="state.content" type="secondary" :is-active="state.active" size="small">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Type 4 (primary)">
      <WMButton :text="state.content" type="primary" :is-active="state.active" />
    </Variant>

    <Variant title="Type-4 (primary) (with custom icon)">
      <WMButton :text="state.content" type="primary" :is-active="state.active">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Type-4 (primary) (with custom icon) (with badge)">
      <WMButton
        :text="state.content"
        type="primary"
        :is-active="state.active"
        badge="2"
        class="mt-2"
      >
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Type 5">
      <WMButton :text="state.content" type="type-5" :is-active="state.active"> </WMButton>
    </Variant>

    <Variant title="Type-5 (with custom icon)">
      <WMButton :text="state.content" type="type-5" :is-active="state.active">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="New">
      <WMButton :text="state.content" type="new" :is-active="state.active" />
    </Variant>

    <Variant title="New (with custom icon)">
      <WMButton :text="state.content" type="new" :is-active="state.active">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Clear">
      <WMButton text="Clear" :is-active="state.active" type="clear" />
    </Variant>

    <Variant title="Cancel">
      <WMButton text="Cancel task" type="cancel" />
    </Variant>

    <Variant title="Cancel (small)">
      <WMButton text="Cancel task" type="cancel" size="small" />
    </Variant>

    <Variant title="Icon only">
      <WMButton :is-active="state.active" type="primary" :icon-only="true">
        <template #customIcon>
          <div class="flex" v-html="FilterIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="More button">
      <WMButton :is-active="state.active" type="more" :icon-only="true">
        <template #customIcon>
          <div class="flex" v-html="MoreIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Icon only (edit)">
      <WMButton :is-active="state.active" type="type-5" :icon-only="true">
        <template #customIcon>
          <div class="flex" v-html="EditIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Icon only (save)">
      <WMButton :is-active="state.active" type="save" :icon-only="true">
        <template #customIcon>
          <div class="flex" v-html="SaveIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Sign button">
      <WMButton :is-active="state.active" type="sign" text="Sign button">
        <template #customIcon>
          <div class="flex" v-html="EditIcon" />
        </template>
      </WMButton>
    </Variant>

    <Variant title="Sign button (small)">
      <WMButton :is-active="state.active" type="sign" text="Sign button" size="small">
        <template #customIcon>
          <div class="flex" v-html="EditIcon" />
        </template>
      </WMButton>
    </Variant>
  </Story>
</template>
<script setup>
import { reactive } from "vue";

import EditIcon from "/icons/edit_default.svg?raw";
import FilterIcon from "/icons/filter.svg?raw";
import MoreIcon from "/icons/more_vert.svg?raw";
import SaveIcon from "/icons/save_default.svg?raw";

const state = reactive({
  content: "Button",
  active: false,
});
</script>
