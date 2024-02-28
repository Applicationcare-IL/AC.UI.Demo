<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    :header="`Incoming call: ${callData?.call_id}`"
    :style="{ width: '50vw' }"
  >
    <div class="flex align-items-center flex-column gap-3 mb-5">
      <WMContactsTable
        v-if="can('contacts.read')"
        :columns="contactIncomingCallsColumns"
        :show-header-options="false"
        :show-only-search="true"
        :multiselect="false"
        :show-title="false"
        :rows="5"
        table-class="compact"
        :search-value="callData.value"
        :task-call="callData.id"
        @close-dialog="modelValue = false"
      />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="modelValue = false"
      ></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";

const modelValue = defineModel();

const { can } = usePermissions();

const { getContactIncomingCallsColumns } = useListUtils();

const contactIncomingCallsColumns = ref(getContactIncomingCallsColumns());

defineProps({
  callData: {
    type: Object,
    default: null,
  },
});
</script>
