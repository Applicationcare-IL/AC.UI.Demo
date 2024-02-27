<template>
  <Dialog
    v-model:visible="modelValue"
    modal
    header="Incoming call"
    :style="{ width: '40vw' }"
  >
    <!-- <div class="flex align-items-center gap-3 mb-5">
      <pre>{{ callData }}</pre>
    </div> -->
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
        :call-id="callData.call_id"
      />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="visible = false"
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
