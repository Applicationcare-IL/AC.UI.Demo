<template>
  <div v-if="budgetItem" class="wm-detail-form-container flex flex-column overflow-auto gap-5">
    <div class="flex flex-row gap-5 flex-wrap">
      <div class="flex-1 card-container top-info-card">
        <Card>
          <template #title> {{ $t("general-details") }} </template>
          <template #content>
            <div class="flex flex-auto flex-column gap-5">
              <div class="wm-form-row align-items-start flex-column gap-5">
                <WMInput
                  name="budget"
                  type="info-link"
                  :highlighted="true"
                  :label="$t('budget.budget') + ':'"
                  :value="budgetItem.budget?.id"
                  :to="'/project/' + budgetItem.project?.id + '/budget'"
                />

                <WMInput
                  id="budget-item-name"
                  type="input-text"
                  :label="$t('budget.budget-item-name') + ':'"
                  name="budget-item-name"
                  :value="budgetItem.name"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div class="flex-1 card-container">
        <Card>
          <template #title> {{ $t("description") }} </template>
          <template #content>
            <div class="flex flex-auto flex-column gap-5">
              <div class="wm-form-row align-items-start gap-5 w-full">
                <WMInput
                  id="description"
                  type="text-area"
                  name="description"
                  :value="budgetItem.description"
                  size="full"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
    <div class="flex flex-row gap-5 flex-wrap mb-6">
      <div class="flex-1 w-full">
        <Card>
          <template #title>
            {{ $t("budget.budget-items-components") }}
          </template>
          <template #content>
            <div class="flex flex-column gap-5">
              <div class="flex flex-row justify-content-between gap-3">
                <WMHighlightedBlock
                  v-model="budgetItem.estimate"
                  name="estimate"
                  background-color="purple-100"
                  :label="$t('budget.estimate') + ':'"
                />

                <Divider layout="vertical" />
                <WMHighlightedBlock
                  v-model="budgetItem.planned_contract"
                  name="planned_contract"
                  background-color="blue-100"
                  :label="$t('budget.planned-contract') + ':'"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budgetItem.unexpected"
                  name="unexpected"
                  background-color="blue-100"
                  :label="$t('budget.unexpected') + ':'"
                  editable
                  @change="recalculateBudgetItem"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budgetItem.management_fee"
                  background-color="blue-100"
                  :label="$t('budget.management-fee') + ':'"
                  editable
                  name="management_fee"
                  @change="recalculateBudgetItem"
                />
                <EqualIcon />
                <WMHighlightedBlock
                  v-model="budgetItem.total"
                  background-color="blue-200"
                  name="total"
                  :label="$t('budget.total') + ':'"
                />
              </div>

              <Divider />

              <div class="flex flex-row justify-content-start gap-2">
                <WMHighlightedBlock
                  v-model="budgetItem.approved_council"
                  background-color="green-100"
                  :label="$t('budget.approved-council') + ':'"
                  editable
                  name="approved_council"
                  @change="recalculateBudgetItem"
                />

                <ArrowIcon :class="layoutConfig.isRTL.value ? '' : 'rotate-180'" />

                <WMHighlightedBlock
                  v-model="budgetItem.approved_ministry"
                  background-color="green-100"
                  :label="$t('budget.approved-ministry') + ':'"
                  editable
                  name="approved_ministry"
                  @change="recalculateBudgetItem"
                />

                <Divider layout="vertical" />

                <WMHighlightedBlock
                  v-model="budgetItem.executed_payments"
                  background-color="white"
                  name="executed_payments"
                  :label="$t('budget.executed-payments') + ':'"
                />

                <WMHighlightedBalanceBlock
                  :quantity="budgetItem.balance"
                  :label="$t('budget.balance') + ':'"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useDebounceFn } from "@vueuse/core";
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useLayout } from "@/layout/composables/layout";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

const { layoutConfig } = useLayout();

// DEPENDENCIES
const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();
const { getBudgetItem, updateBudgetItem, parseUpdateBudgetItem, calculateBudgetItem } =
  useProjects();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();

// INJECT

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

// REFS
const budgetItem = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm();

const fetchData = () => {
  getBudgetItem(route.params.budgetItemId).then((response) => {
    budgetItem.value = response;
    utilsStore.selectedElements["budget-item"] = [budgetItem.value];
  });
};

fetchData();

const onSave = handleSubmit((values) => {
  updateBudgetItem(route.params.budgetItemId, parseUpdateBudgetItem(values))
    .then(() => {
      toast.success({ message: t("toast.budget-item-updated") });
      resetForm({ values: values });
      fetchData();
    })
    .catch((error) => {
      console.error(error);
      toast.error(t("toast.error"));
    });
});

const recalculateBudgetItem = useDebounceFn(() => {
  calculateBudgetItem(route.params.budgetItemId, parseUpdateBudgetItem(values))
    .then((response) => {
      budgetItem.value = {
        ...budgetItem.value,
        balance: response.balance,
        total: response.total_approved,
      };
    })
    .catch((error) => {
      console.error(error);
    });
}, 200);

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "budget-item";
utilsStore.entity = "budget-item";

// PROVIDE, EXPOSE
defineExpose({
  onSave,
  fetchData,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    if (value.touched || value.dirty) {
      formUtilsStore.formMeta = value;
      formUtilsStore.setFormMetas(value, props.formKey);
    }
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
