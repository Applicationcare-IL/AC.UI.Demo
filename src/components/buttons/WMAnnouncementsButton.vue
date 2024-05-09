<template>
  <Dialog
    v-model:visible="visible"
    modal
    :style="{ width: '50rem' }"
    header="הודעות והנחיות"
    :class="layoutConfig.isRTL.value ? 'layout-rtl' : ''"
  >
    <div
      v-for="announcement in announcements"
      :key="announcement.id"
      class="p-2"
    >
      {{ announcement.message }}
      <Divider />
    </div>
  </Dialog>

  <Button
    label="הודעות והנחיות"
    :badge="announcements?.length ? announcements.length : '0'"
    badge-class="p-badge-warning"
    class="flex flex-row gap-3 p-2"
    :disabled="announcements.length === 0"
    @click="visible = true"
  >
  </Button>
</template>

<script setup>
import { onMounted, ref } from "vue";

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
