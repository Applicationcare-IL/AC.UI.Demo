<template>
  <Dialog
    v-model:visible="visible"
    modal
    :style="{ width: '50rem' }"
    header="הודעות והנחיות"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div v-for="announcement in announcements" :key="announcement.id" class="p-2">
      {{ announcement.message }}
      <Divider />
    </div>
  </Dialog>

  <WMTempButton
    :text="$t('buttons.announcements')"
    type="primary"
    :badge="announcements?.length ? announcements.length : false"
    :is-disabled="announcements.length === 0"
    :disabled="announcements.length === 0"
    @click="visible = true"
  >
    <template #customIcon>
      <div class="flex" v-html="PinIcon" />
    </template>
  </WMTempButton>
</template>

<script setup>
import { onMounted, ref } from "vue";

import PinIcon from "/icons/push_pin.svg?raw";
import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();
const { getAnnouncements } = useAnnouncements();

const announcements = ref([]);

const props = defineProps({
  entity: String,
  id: String,
});

const visible = ref(false);

onMounted(() => {
  getAnnouncements({
    entity_type: props.entity,
    entity_id: props.id,
  }).then((result) => {
    announcements.value = result.data;
  });
});
</script>
