<template>
  <div class="card-container flex-1">
    <WMServicePreviewSidebar v-model:visible="isServicePreviewVisible" :service="service" />
    <Card v-if="service" class="p-card--first-top-card">
      <template #title>
        <div class="flex flex-row justify-content-between">
          שירות: {{ service.service_number }}
          <Button @click="isServicePreviewVisible = true">הצג שירות</Button>
        </div>
      </template>
      <template #content>
        <div v-if="service" class="flex flex-auto flex-column gap-5">
          <div class="wm-form-row gap-5">
            <WMInput
              name="service-owner"
              type="info"
              :highlighted="true"
              :label="$t('owner')"
              :value="service.owner.name"
            />
            <WMInput
              name="contact"
              type="info-link"
              :highlighted="true"
              :label="$t('contact.contact') + ':'"
              :value="service.contact"
              :to="'/contact/' + service.contact_id"
            />
            <WMInput
              name="customer"
              type="info-link"
              :highlighted="true"
              :label="$t('customer.customer') + ':'"
              :value="service.customer"
              :to="'/customer/' + service.customer_id"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              name="area"
              type="info"
              :highlighted="true"
              :label="$t('classification-1') + ':'"
              :value="service.area ? service.area[optionLabelWithLang] : ''"
            />
            <WMInput
              name="type"
              type="info"
              :highlighted="true"
              :label="$t('classification-2') + ':'"
              :value="service.type ? service.type[optionLabelWithLang] : ''"
            />
            <WMInput
              name="request1"
              type="info"
              :highlighted="true"
              :label="$t('classification-3') + ':'"
              :value="service.request1 ? service.request1[optionLabelWithLang] : ''"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              name="request2"
              type="info"
              :highlighted="true"
              :label="$t('classification-4') + ':'"
              :value="service.request2 ? service.request2[optionLabelWithLang] : ''"
            />
            <WMInput
              name="request3"
              type="info"
              :highlighted="true"
              :label="$t('classification-5') + ':'"
              :value="service.request3 ? service.request3[optionLabelWithLang] : ''"
            />
          </div>
          <div class="wm-form-row gap-5">
            <WMInput
              id="description"
              type="text-area"
              name="description"
              :label="$t('service.description') + ':'"
              :value="service.description"
              disabled
              size="full"
            />
          </div>
        </div>
      </template>
    </Card>
    <Card v-else>
      <div>Loading Service</div>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { optionLabelWithLang } = useLanguages();

const { service } = defineProps({
  service: {
    type: Object,
    required: true,
  },
});

const isServicePreviewVisible = ref(false);
</script>
