<template>
  <div class="mb-5 p-3 py-3">
    <h2 class="h2">New service</h2>
    <WMInput
      name="owner"
      type="info"
      :highlighted="true"
      :label="$t('owner')"
      value="Me"
      class="mb-3"
    />

    <WMInput
      v-model="selectedUrgency"
      name="priority"
      type="input-select"
      :highlighted="true"
      :label="$t('priority') + ':'"
      :options="urgencies"
      width="130"
      option-set
    />

    <WMInputSearch
      class="mt-3"
      name="short-classification"
      :highlighted="true"
      :label="$t('short-classification') + ':'"
      :options="quickCodes"
      width="300"
      :placeholder="$t('select', ['short-classification'])"
      @change="handleQuickCodeChange"
    />

    <WMInput
      id="description"
      v-model="description"
      :label="$t('service.description')"
      type="text-area"
      name="description"
      width="300"
    />

    <h3 class="h3">Location data</h3>

    <WMInputSearch
      v-model="selectedSite"
      name="site-name"
      type="input-search"
      :label="$t('site.name') + ':'"
      width="152"
      :options="sites"
      :highlighted="true"
      option-set
    />

    <WMInputSearch
      v-if="selectedSite"
      name="site-type"
      placeholder="ציבורי"
      type="input-search"
      :label="$t('site.type') + ':'"
      width="152"
      :options="siteTypes"
      :highlighted="true"
      option-set
    />

    <WMInputSearch
      v-if="selectedSite"
      name="site-contact"
      type="input-search"
      :placeholder="$t('select', ['contact'])"
      :label="$t('site.contact') + ':'"
      width="152"
      :highlighted="true"
      :search-function="searchSiteContact"
    />

    <WMInputSearch
      v-if="selectedSite"
      name="site-contact-role"
      placeholder="בחירת תפקיד"
      type="input-search"
      :label="$t('site.contact-role') + ':'"
      width="152"
      :options="siteRoles"
      :highlighted="true"
      option-set
    />

    <Button
      label="Save"
      size="large"
      class="w-full p-4 mt-5"
      severity="success"
      @click="onSubmit"
    />
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import { computed, onMounted, ref } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();
const formUtilsStore = useFormUtilsStore();

const { createService, parseService, getQuickCodes } = useServices();

const toast = useToast();

const description = ref("");

const quickCodes = ref([]);
const urgencies = ref([]);
const selectedUrgency = ref(null);
const selectedSite = ref(null);

const directions = ref([]);
const selectedDirection = ref(null);
const channels = ref([]);
const selectedChannel = ref(null);

optionSetsStore.getOptionSetValuesFromApi("service_direction").then((data) => {
  directions.value = data;
  selectedDirection.value = data.find((d) => d.value === "inbound");
});

optionSetsStore.getOptionSetValuesFromApi("service_channel").then((data) => {
  channels.value = data;
  selectedChannel.value = data.find(
    (d) => d.value === "mobile" || d.value === "Mobile"
  );
});

const sites = ref(optionSetsStore.optionSets["service_site"]);
const siteTypes = ref(optionSetsStore.optionSets["service_site_type"]);
const siteRoles = ref(
  optionSetsStore.optionSets["service_site_contact_relationship_role"]
);

// QUICK CODE VALUES
const area = ref("");
const subarea = ref("");
const request1 = ref("");
const request2 = ref("");
const request3 = ref("");

const handleQuickCodeChange = (data) => {
  area.value = data.value.area.id;
  subarea.value = data.value.type?.id;
  request1.value = data.value.request_1?.id;
  request2.value = data.value.request_2?.id;
  request3.value = data.value.request_3?.id;
};

onMounted(() => {
  optionSetsStore.getOptionSetValuesFromApi("service_urgent").then((data) => {
    urgencies.value = data;
    selectedUrgency.value = data[0];
  });

  getQuickCodes().then((data) => {
    quickCodes.value = data.data;
  });
});

const { getContactsFromApi } = useContacts();

const searchSiteContact = (query) => {
  return getContactsFromApi({ search: query });
};

const { handleSubmit, values } = useForm({
  validationSchema: formUtilsStore.getMobileServiceFormValidationSchema,
});

const newService = computed(() => {
  return {
    contact_id: 1,
    customer_id: 1,
    direction: selectedDirection.value?.id,
    channel: selectedChannel.value?.id,
    priority: values.priority?.id,
    area: area.value,
    subarea: subarea.value,
    request1: request1.value,
    request2: request2.value,
    request3: request3.value,
    description: values.description,
    site: values["site-name"],
    location: {
      site_id: selectedSite.value?.id,
      site_type: values["site-type"]?.id,
      contact: values["site-contact"]?.id,
      contact_role: values["site-contact-role"]?.id,
    },
  };
});

const onSubmit = handleSubmit((values) => {
  createService(parseService(values))
    .then(() => {
      toast.success("Service created");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Service creation failed");
    });
});
</script>

<style scoped lang="scss"></style>
