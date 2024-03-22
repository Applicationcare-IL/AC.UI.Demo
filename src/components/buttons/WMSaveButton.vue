<template>
  <WMTempButton :text="text" :type="type" :is-disabled="isDisabled">
    <template #customIcon>
      <div v-if="!isSaved" class="d-flex" v-html="SaveIcon" />
      <div v-else class="d-flex" v-html="DoneIcon" />
    </template>
  </WMTempButton>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import DoneIcon from "/icons/done.svg?raw";
import SaveIcon from "/icons/save_default.svg?raw";

const { t } = useI18n();

const props = defineProps({
  isDisabled: Boolean,
  isSaved: Boolean,
});

const text = computed(() => {
  return props.isSaved ? t("buttons.saved") : t("buttons.save");
});

const type = computed(() => {
  return props.isSaved ? "saved" : "save";
});
</script>
