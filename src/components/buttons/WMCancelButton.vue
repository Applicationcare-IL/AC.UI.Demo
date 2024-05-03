<template>
  <WMTempButton :text="text" type="cancel" size="small" :is-disabled="isDisabled">
    <template #customIcon>
      <div class="d-flex" v-html="CancelIcon" />
    </template>
  </WMTempButton>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import CancelIcon from "/icons/cancel_default.svg?raw";

const { t } = useI18n();

const text = ref(t("buttons.cancel"));

defineProps({
  isDisabled: Boolean,
});
</script>
