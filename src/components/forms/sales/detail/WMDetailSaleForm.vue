<template>
  <div v-if="sale" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex flex-1 flex-column card-container gap-5">
          <Card class="p-card--first-top-card">
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <WMDetailSaleFormGeneralDetails :sale="sale" />
            </template>
          </Card>
          <Card>
            <template #title>
              <div class="w-full flex align-items-center justify-content-between">
                <span>
                  {{ $t("sale.factors-in-the-organization") }}
                </span>
                <WMEditButtonIconOnly v-if="!editFormFactors" @click="editFormFactors = true" />
                <WMSaveButtonIconOnly
                  v-else
                  @click="
                    onSave();
                    editFormFactors = false;
                  "
                />
              </div>
            </template>
            <template #content>
              <WMDetailSaleFormFactors :sale="sale" :edit-mode="editFormFactors" />
            </template>
          </Card>
          <Card>
            <template #title>
              <div class="w-full flex align-items-center justify-content-between">
                <span>
                  {{ $t("sale.customer-details") }}
                </span>
                <WMEditButtonIconOnly
                  v-if="!editFormCustomerDetails"
                  @click="editFormCustomerDetails = true"
                />
                <WMSaveButtonIconOnly
                  v-else
                  @click="
                    onSave();
                    editFormCustomerDetails = false;
                  "
                />
              </div>
            </template>
            <template #content>
              <WMDetailSaleFormCustomerDetails :sale="sale" :edit-mode="editFormCustomerDetails" />
            </template>
          </Card>
          <Card>
            <template #title>
              {{ $t("sale.remarks") }}
            </template>
            <template #content>
              <WMInput :value="sale.remarks" type="text-area" name="remarks" size="full" />
            </template>
          </Card>
        </div>
        <div class="flex flex-1 flex-column gap-5">
          <Card class="w-full h-auto bg-gray-25">
            <template #title>
              <div class="w-full flex align-items-center justify-content-between">
                <span>
                  {{ $t("sale.sale-summary") }}
                </span>
                <WMEditButtonIconOnly />
              </div>
            </template>
            <template #content>
              <pre>{{ sale.mandatory_requirements }}</pre>
              <!-- <pre>{{ values }}</pre> -->
            </template>
          </Card>
          <Card class="w-full">
            <template #title>
              <div class="w-full flex align-items-center justify-content-between">
                <span>
                  {{ $t("sale.mandatory-requirements") }}
                </span>
                <WMEditButtonIconOnly />
              </div>
            </template>
            <template #content> CONTENT </template>
          </Card>
        </div>
      </div>
    </div>

    <div class="my-5">
      <WMStepper :steps="stages" :current-step="currentStage" aria-label="Form Steps" />
    </div>

    <div class="flex flex-column gap-5 mb-6">
      <Accordion v-if="can('tasks.read')">
        <AccordionTab :header="$t('task.tasks')">
          <WMTasksTable
            related-entity="sale"
            :related-entity-id="sale.id"
            :columns="taskColumns"
            multiselect
            :hide-title="true"
          />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('journal')">
          <WMJournalDataView entity-type="sale" :entity-id="sale.id" />
        </AccordionTab>
      </Accordion>

      <Accordion>
        <AccordionTab :header="$t('documents.documents')">
          <WMDocumentsTable
            :columns="documentsColumns"
            :related-entity-id="route.params.id"
            related-entity="sale"
            :hide-title="true"
          />
        </AccordionTab>
      </Accordion>
    </div>
    <div class="flex-1 tabs-container mt-5 pt-5">
      <TabView>
        <TabPanel :header="$t('additional-information')">
          <div class="flex flex-column gap-5 m-2">
            <h4 class="h4 mb-0">
              {{ $t("logs") }}
            </h4>
            <div class="flex flex-auto gap-5 flex-row">
              <WMInput
                name="created_by"
                type="info"
                :highlighted="true"
                :label="$t('created_by') + ':'"
                :value="sale.last_activity.creator.name"
                width="150"
              />
              <WMInput
                name="modified_by"
                type="info"
                :highlighted="true"
                :label="$t('modified_by') + ':'"
                :value="sale.last_activity.updater.name"
                width="150"
              />
            </div>
            <div class="flex flex-auto gap-5 flex-row">
              <WMInput
                name="created_at"
                type="info"
                :highlighted="true"
                :label="$t('created_at') + ':'"
                :value="sale.last_activity.creator.at"
                width="150"
              />
              <WMInput
                name="modified_at"
                type="info"
                :highlighted="true"
                :label="$t('modified_at') + ':'"
                :value="sale.last_activity.updater.at"
                width="150"
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useDateFormat } from "@vueuse/core";
import { useField, useForm } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const toast = useToast();
const route = useRoute();
const formUtilsStore = useFormUtilsStore();

const { can } = usePermissions();
const { updateSale, parseSale } = useSales();
const { getTaskColumns, getServiceDocumentsColumns } = useListUtils();

// INJECT

// PROPS, EMITS
const props = defineProps({
  sale: {
    type: Object,
    required: true,
  },
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["saleUpdated"]);

// REFS
const taskColumns = ref(getTaskColumns());
const documentsColumns = ref(getServiceDocumentsColumns());

const editFormFactors = ref(false);
const editFormCustomerDetails = ref(false);

// COMPUTED

const stages = computed(() => {
  if (!props.sale.process.stages) return [];

  return props.sale.process.stages.map((stage) => ({
    label: stage.name,
    date: stage.sla.due_date ? useDateFormat(stage.sla.due_date, "DD/MM/YY") : null,
  }));
});

const currentStage = computed(() => {
  return props.sale.process.current_stage ? props.sale.process.current_stage.index : 0;
});

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  // validationSchema: formUtilsStore.getNewProductFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  const TEMPDATA = {
    ...props.sale,
    ...values,
  };

  updateSale(route.params.id, parseSale(TEMPDATA))
    .then(() => {
      toast.success({ message: "Sale updated successfully" });
      resetForm({ values: values });
      emit("saleUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating sale");
    });
});

// PROVIDE, EXPOSE
defineExpose({
  onSave,
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
  formUtilsStore.formEntity = "sale";
});
</script>
<style lang="scss" scoped>
.bundle-discount-accordion {
  display: flex;

  &__switcher {
    position: absolute !important;
    left: 1em;
    top: 28px;
    transform: translateY(-50%);
    z-index: 2;
  }
}
</style>
