<template>
  <div
    v-if="budget"
    class="wm-detail-form-container flex flex-column overflow-auto gap-5"
  >
    <div class="flex flex-row gap-5 flex-wrap">
      <div class="flex-1 card-container top-info-card">
        <Card>
          <template #title> {{ $t("general-details") }} </template>
          <template #content>
            <div class="flex flex-auto flex-column gap-5">
              <div class="wm-form-row align-items-start gap-5">
                <WMInput
                  name="id"
                  type="info"
                  :highlighted="true"
                  :label="$t('id') + ':'"
                  :value="budget.id"
                />

                <WMInput
                  name="owner"
                  type="info"
                  :highlighted="true"
                  :label="$t('owner.owner') + ':'"
                  :value="budget.owner?.name"
                />
                <WMInput
                  name="project"
                  type="info-link"
                  :highlighted="true"
                  :label="$t('project.project') + ':'"
                  :value="projectId"
                  :to="'/project/' + projectId"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
    <div class="flex flex-row gap-5 flex-wrap">
      <div class="flex-1 w-full">
        <Card>
          <template #title> {{ $t("budget.budget-details") }} </template>
          <template #content>
            <div class="flex flex-column gap-5">
              <div class="flex flex-row justify-content-between gap-3">
                <WMHighlightedBlock
                  v-model="budget.estimate"
                  background-color="purple-100"
                  :label="$t('budget.estimate') + ':'"
                />

                <Divider layout="vertical" />
                <WMHighlightedBlock
                  v-model="budget.planned_contract"
                  background-color="blue-100"
                  :label="$t('budget.planned-contract') + ':'"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budget.unexpected"
                  background-color="blue-100"
                  :label="$t('budget.unexpected') + ':'"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budget.management_fee"
                  background-color="blue-100"
                  :label="$t('budget.management-fee') + ':'"
                />
                <EqualIcon />
                <WMHighlightedBlock
                  v-model="budget.total_approved"
                  background-color="blue-200"
                  :label="$t('budget.total') + ':'"
                />
              </div>
              <Divider></Divider>
              <div class="flex flex-row justify-content-between gap-2">
                <WMHighlightedBlock
                  v-model="budget.approved_council"
                  background-color="green-100"
                  :label="$t('budget.approved-council') + ':'"
                />

                <ArrowIcon
                  :class="layoutConfig.isRTL.value ? '' : 'rotate-180'"
                />

                <WMHighlightedBlock
                  v-model="budget.approved_ministry"
                  background-color="green-100"
                  :label="$t('budget.approved-ministry') + ':'"
                />

                <Divider layout="vertical" />

                <WMHighlightedBlock
                  v-model="budget.executed_payments"
                  background-color="white"
                  :label="$t('budget.executed-payments') + ':'"
                />

                <WMHighlightedBalanceBlock
                  :quantity="budget.balance"
                  :label="$t('budget.balance') + ':'"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
    <div class="flex flex-row gap-5 flex-wrap">
      <div class="flex-1">
        <Card>
          <template #title>
            <div class="flex align-items-center gap-3">
              {{ $t("budget.tbr-details") }}
              <WMInput
                id="tbr_number"
                v-model="budget.tbr_number"
                name="tbr_number"
                type="input-text"
                :value="budget.tbr_number"
              />
            </div>
          </template>
          <template #content>
            <!-- <pre style="min-height: 50vh">
  {{ values }}
  {{ budget.tbr_accepted }}
  </pre
            > -->
            <div class="flex flex-column gap-2">
              <div
                class="flex flex-row align-items-center justify-content-start gap-2"
              >
                <WMHighlightedBlock
                  v-model="budget.tbr_accepted"
                  name="tbr_accepted"
                  background-color="gray-100"
                  :label="$t('budget.tbr-accepted') + ':'"
                  size="small"
                  editable
                  @change="recalculateBudget"
                />
                <PlusIcon />

                <WMHighlightedBlock
                  v-model="budget.tbr_expected"
                  name="tbr_expected"
                  background-color="gray-100"
                  :label="$t('budget.tbr-expected') + ':'"
                  size="small"
                  editable
                  @change="recalculateBudget"
                />
                <EqualIcon />
                <WMHighlightedBlock
                  v-model="budget.tbr_funding"
                  name="tbr_funding"
                  background-color="gray-300"
                  :label="$t('budget.tbr-funding') + ':'"
                  size="small"
                />
              </div>
              <Divider />
              <div
                class="flex flex-row align-items-center gap-5 justify-content-start"
              >
                <WMHighlightedBlock
                  v-model="budget.tbr_reported"
                  name="tbr_reported"
                  background-color="white"
                  :label="$t('budget.tbr-reported') + ':'"
                  size="small"
                  editable
                  @change="recalculateBudget"
                />

                <WMHighlightedBlock
                  v-model="budget.tbr_municipality_expenses"
                  name="tbr_municipality_expenses"
                  background-color="white"
                  :label="$t('budget.tbr-municipality-expenses') + ':'"
                  size="small"
                  editable
                  class="mr-2"
                  @change="recalculateBudget"
                />

                <WMHighlightedBalanceBlock
                  name="tbr_balance"
                  :quantity="budget.tbr_balance"
                  :label="$t('budget.tbr-balance') + ':'"
                  size="small"
                  class="mr-2"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div class="flex-1">
        <Card class="h-full">
          <template #title>
            {{ $t("budget.non-tbr-funding-details") }}
          </template>
          <template #content>
            <div class="flex flex-column gap-2">
              <div
                class="flex flex-row align-items-center justify-content-between gap-2"
              >
                <WMHighlightedBlock
                  v-model="budget.funds_accepted_non_tbr"
                  name="funds_accepted_non_tbr"
                  background-color="gray-100"
                  :label="$t('budget.non-tbr-funds-accepted') + ':'"
                  size="small"
                  editable
                  @change="recalculateBudget"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budget.expected_non_tbr"
                  name="expected_non_tbr"
                  background-color="gray-100"
                  :label="$t('budget.non-tbr-expected') + ':'"
                  size="small"
                  editable
                  @change="recalculateBudget"
                />
                <EqualIcon />
                <WMHighlightedBlock
                  v-model="budget.funding_non_tbr"
                  background-color="gray-300"
                  :label="$t('budget.non-tbr-funding') + ':'"
                  size="small"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Accordion>
      <AccordionTab :header="$t('budget.budget-items')">
        <WMBudgetItemsTable :project-id="projectId" :related-budget="budget" />
      </AccordionTab>
    </Accordion>

    <!-- <Accordion>
      <AccordionTab :header="$t('budget.funding')"> </AccordionTab>
    </Accordion> -->

    <Accordion>
      <AccordionTab :header="$t('budget.payments')">
        <WMPaymentsTable :project-id="projectId"></WMPaymentsTable>
      </AccordionTab>
    </Accordion>

    <!-- <div class="flex-1 tabs-container mt-5">
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
                :value="project.last_activity.creator.name"
                width="150"
              />
              <WMInput
                name="modified_by"
                type="info"
                :highlighted="true"
                :label="$t('modified_by') + ':'"
                :value="project.last_activity.updater.name"
                width="150"
              />
            </div>
            <div class="flex flex-auto gap-5 flex-row">
              <WMInput
                name="created_at"
                type="info"
                :highlighted="true"
                :label="$t('created_at') + ':'"
                :value="project.last_activity.creator.at"
                width="150"
              />
              <WMInput
                name="modified_at"
                type="info"
                :highlighted="true"
                :label="$t('modified_at') + ':'"
                :value="project.last_activity.updater.at"
                width="150"
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div> -->
  </div>
</template>

<script setup>
// IMPORTS
import { useDebounceFn } from "@vueuse/core";
import { useForm } from "vee-validate";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useLayout } from "@/layout/composables/layout";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getProjectBudget, updateBudget, calculateBudget, parseBudget } =
  useProjects();
const route = useRoute();
const { layoutConfig } = useLayout();
const utilsStore = useUtilsStore();
const toast = useToast();
const formUtilsStore = useFormUtilsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

// REFS
const budget = ref({});

// COMPUTED
const projectId = computed(() => {
  return route.params.id;
});

// COMPONENT METHODS
useHead({
  title: "Project Budget",
});

const { handleSubmit, meta, resetForm, values } = useForm();

const recalculateBudget = useDebounceFn(() => {
  calculateBudget(route.params.id, parseBudget(values))
    .then((response) => {
      budget.value = {
        ...budget.value,
        ...response,
      };
    })
    .catch((error) => {
      console.error(error);
    });
}, 200);

const onSave = handleSubmit((values) => {
  updateBudget(route.params.id, parseBudget(values))
    .then(() => {
      toast.successAction("budget", "updated");
      resetForm({ values: values });
      fetchData();
    })
    .catch((error) => {
      console.error(error);
      toast.error("budget", "not-updated");
    });
});

const fetchData = () => {
  getProjectBudget(route.params.id).then((response) => {
    budget.value = response;
    utilsStore.selectedElements["project-budget"] = [budget.value];
  });
};

fetchData();

formUtilsStore.formEntity = "project-budget";
utilsStore.entity = "project-budget";

// PROVIDE, EXPOSE
defineExpose({
  onSave,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
