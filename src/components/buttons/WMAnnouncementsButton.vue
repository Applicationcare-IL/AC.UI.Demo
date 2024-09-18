<template>
  <Dialog
    v-model:visible="visible"
    modal
    :style="{ width: '50rem' }"
    header="הודעות והנחיות"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div v-for="announcement in announcements" :key="announcement.id" class="p-0">
      <div :class="announcement.important ? 'p-2 bg-orange-100' : 'p-2'">
        <WMImportantState
          v-if="announcement.important"
          class="mb-3"
          :important="announcement.important"
        />
        {{ announcement.message }}
      </div>
      <Divider class="m-0" />
    </div>
  </Dialog>

  <WMButton
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
  </WMButton>
</template>

<script setup>
import { onMounted, ref } from "vue";

import PinIcon from "/icons/push_pin.svg?raw";
import WMImportantState from "@/components/tables/WMImportantState.vue";
import { useLayout } from "@/layout/composables/layout";

const { layoutConfig } = useLayout();
const { getMessages } = useMessages();

const announcements = ref([]);

const props = defineProps({
  entity: String,
  id: String,
});

const visible = ref(false);

onMounted(() => {
  getMessages({
    entity_type: props.entity,
    entity_id: props.id,
  }).then((result) => {
    announcements.value = result.data;
  });
});
</script>
