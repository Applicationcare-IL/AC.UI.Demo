<template>
  <div class="flex justify-content-between">
    <h2 class="h2">שם של איש קשר</h2>
    <router-link
      :to="{
        name: 'contactDetail',
        params: { id: contact.id },
      }"
      class="p-2"
    >
      <Button> פתח איש קשר </Button>
    </router-link>
  </div>
  <Divider />
  <div class="flex gap-5">
    <WMInput
      name="owner"
      type="info"
      :highlighted="true"
      :label="$t('owner') + ':'"
      :value="contact.name"
      width="200"
    />

    <WMInput
      name="owner"
      type="info"
      :highlighted="true"
      :label="$t('telephone') + ':'"
      :value="contact.telephone"
      width="150"
    />

    <WMInput
      name="owner"
      type="info"
      :highlighted="true"
      :label="$t('email') + ':'"
      :value="contact.email"
    />
  </div>

  <WMCustomersTable
    :contactId="contact.id"
    :columns="customerPreviewTableColumns"
    :showControls="false"
    :multiselect="false"
    :rows="5"
    table-class="compact"
  />

  <WMServicesTable
    relatedEntity="contact"
    :relatedEntityId="contact.id"
    :columns="servicePreviewTableColumns"
    :multiselect="false"
    :showHeaderOptions="false"
    :rows="5"
    table-class="compact"
  />

  <WMTasksTable
    relatedEntity="contact"
    :relatedEntityId="contact.id"
    :columns="taskColumns"
    :multiselect="false"
    :showHeaderOptions="false"
    :rows="5"
    table-class="compact"
  />
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  contact: {
    type: Object,
    default: () => {},
  },
});

const {
  getCustomerPreviewColumns,
  getServicePreviewColumns,
  getTaskPreviewColumns,
} = useListUtils();

const customerPreviewTableColumns = ref(getCustomerPreviewColumns());
const servicePreviewTableColumns = ref(getServicePreviewColumns());
const taskPreviewTableColumns = ref(getTaskPreviewColumns());
</script>

<style scoped lang="scss"></style>
