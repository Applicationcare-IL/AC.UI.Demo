<template>
  <div v-if="loaded" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container">
          <Card class="p-card--first-top-card">
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('asset.system-id') + ':'"
                    :value="asset.id"
                  />
                  <WMInput
                    name="number"
                    type="info"
                    :highlighted="true"
                    :label="$t('asset.number') + ':'"
                    :value="asset.number"
                  />
                  <WMInput
                    name="asset_type"
                    type="info"
                    :highlighted="true"
                    :label="$t('asset.type') + ':'"
                    :value="asset.asset_type"
                    option-set
                  />
                </div>
                <Divider />

                <div class="wm-form-row gap-5">
                  <WMInput
                    name="owner"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('asset.owner') + ':'"
                    :value="asset.owner.name + asset.owner.surname"
                    :to="'/customer/' + asset.owner.id"
                  />
                  <WMInput
                    name="payer"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('asset.payer') + ':'"
                    :value="asset.payer.name + asset.payer.surname"
                    :to="'/customer/' + asset.payer.id"
                  />
                  <WMInput
                    name="consumer"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('asset.consumer') + ':'"
                    :value="asset.consumer.name + asset.consumer.surname"
                    :to="'/customer/' + asset.consumer.id"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput
                      name="usage-start-date"
                      type="info"
                      :highlighted="true"
                      :label="$t('asset.usage-start-date')"
                      :value="asset.usage_start_date"
                    />
                    <WMInput
                      name="usage-end-date"
                      type="info"
                      :highlighted="true"
                      :label="$t('asset.usage-end-date')"
                      :value="asset.usage_end_date"
                    />
                    <WMInput
                      name="usage-start-date"
                      type="info"
                      :highlighted="true"
                      :label="$t('asset.last-inspection-date')"
                      :value="asset.last_inspection_date"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container">
          <Card>
            <template #title> {{ $t("service_information") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="service-emergency-area"
                    type="info"
                    :highlighted="true"
                    :label="$t('asset.service-emergency-area') + ':'"
                    :value="asset.service_emergency_area"
                  />
                  <WMInput
                    name="service-area"
                    type="info"
                    :highlighted="true"
                    :label="$t('asset.service-area') + ':'"
                    :value="asset.service_area"
                  />
                </div>

                <div class="wm-form-row gap-5">
                  <WMInput
                    name="collection-area"
                    type="info"
                    :highlighted="true"
                    :label="$t('asset.collection-area') + ':'"
                    :value="asset.service_collection_area"
                  />
                  <WMInput
                    name="tax-area"
                    type="info"
                    :highlighted="true"
                    :label="$t('asset.tax-area') + ':'"
                    :value="asset.service_tax_area"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <WMDetailAssetFormLocation :location="asset.location" />
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <WMDetailAssetWaterMeter :asset="asset" />
      </div>
      <div>
        <Accordion :active-index="0">
          <AccordionTab :header="$t('asset.services')">
            <WMServicesTableSection
              v-if="checkIfEntityIsActive('services') && can('services.read')"
              related-entity="asset"
              :related-entity-id="asset.id"
              :columns="serviceColumns"
              multiselect
            />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <Accordion :active-index="0">
          <AccordionTab :header="$t('asset.organizations')">
            <WMCustomersTableSection
              v-if="can('customers.read')"
              :related-entity-id="asset.id"
              :columns="customerColumns"
              related-entity="asset"
            />
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getTasksFromApi } = useTasks();
const { checkIfEntityIsActive } = useLicensing();
const { can } = usePermissions();

const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();
const utilsStore = useUtilsStore();
const route = useRoute();
const toast = useToast();

const { getCustomerColumnsForAssets, getServiceColumns } = useListUtils();

const { getAssetFromApi, updateAsset, parseAsset, setSelectedAssets } = useAssets();

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

// REFS
const asset = ref();
const tasks = ref();

const genders = ref();
const genderSelected = ref();
const loaded = ref(false);

const customerColumns = ref(getCustomerColumnsForAssets());
const serviceColumns = ref(getServiceColumns());

// COMPUTED

// COMPONENT METHODS AND LOGIC
const fetchData = async () => {
  getAssetFromApi(route.params.id).then((data) => {
    asset.value = data;
    utilsStore.selectedElements["asset"] = [asset.value];
    setSelectedAssets(asset.value);
    loaded.value = true;
  });
  const tasksData = await getTasksFromApi({
    customer_id: route.params.id,
  });
  tasks.value = tasksData?.data;
};

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getAssetDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateAsset(route.params.id, parseAsset(values))
    .then(() => {
      toast.successAction("asset", "updated");
      resetForm({ values: values });
      fetchData();
    })
    .catch((error) => {
      console.error(error);
      toast.error("customer", "not-updated");
    });
});

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "asset";
utilsStore.entity = "asset";

// PROVIDE, EXPOSE
provide("preselectedAsset", asset);

defineExpose({
  onSave,
  fetchData,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    if (value.touched) {
      formUtilsStore.formMeta = value;
      formUtilsStore.setFormMetas(value, props.formKey);
    }
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await fetchData();

  setSelectedAssets(asset.value);

  genders.value = await optionSetsStore.getOptionSetValues("gender");

  genderSelected.value = genders.value.find((gender) => gender.id === asset.value.gender?.id);
});
</script>

<style scoped lang="scss"></style>
