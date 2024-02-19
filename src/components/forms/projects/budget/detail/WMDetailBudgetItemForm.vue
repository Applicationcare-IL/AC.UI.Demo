<template>
  <div
    v-if="budgetItem"
    class="wm-detail-form-container flex flex-column overflow-auto gap-5"
  >
    <pre style="min-height: 50vh">{{ budgetItem }}</pre>
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
                  :value="'גן הפקאן - שלב ב’: הוספת קומה לבניין'"
                  :to="'/project/' + projectId + '/budget'"
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
              <div class="wm-form-row align-items-start gap-5">
                <WMInput
                  id="description"
                  type="text-area"
                  name="description"
                  :value="budgetItem.description"
                  width="full"
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
            {{ $t("budget.budget-items-components") }}
          </template>
          <template #content>
            <div class="flex flex-column gap-5">
              <div class="flex align-items-center justify-content-between gap-2">
                <WMHighlightedBlock
                  id="planned_non_contract"
                  v-model="budgetItem.planned_non_contract"
                  name="planned_non_contract"
                  background-color="blue-100"
                  :label="$t('budget.planned-non-contract') + ':'"
                  editable
                />
                <PlusIcon />
                <WMHighlightedBlock
                  id="planned_contract"
                  v-model="budgetItem.planned_contract"
                  name="planned_contract"
                  background-color="blue-100"
                  :label="$t('budget.planned-contract') + ':'"
                />
                <PlusIcon />

                <WMHighlightedBlock
                  id="unexpected"
                  v-model="budgetItem.unexpected"
                  name="unexpected"
                  background-color="blue-100"
                  :label="$t('budget.unexpected') + ':'"
                  editable
                />
                <PlusIcon />
                <WMHighlightedBlock
                  id="management_fee"
                  v-model="budgetItem.management_fee"
                  name="management_fee"
                  background-color="blue-100"
                  :label="$t('budget.management-fee') + ':'"
                  editable
                />

                <EqualIcon />
                <WMHighlightedBlock
                  id="total"
                  v-model="budgetItem.total_approved"
                  name="total"
                  background-color="blue-200"
                  :label="$t('budget.total') + ':'"
                />
              </div>

              <Divider />

              <div class="flex align-items-center gap-4">
                <WMHighlightedBlock
                  id="estimate"
                  v-model="budgetItem.estimate"
                  name="estimate"
                  background-color="purple-100"
                  :label="$t('budget.estimate') + ':'"
                  editable
                />

                <WMHighlightedBlock
                  id="approved_council"
                  v-model="budgetItem.approved_council"
                  name="approved_council"
                  background-color="white"
                  :label="$t('budget.approved-council') + ':'"
                  editable
                />

                <WMHighlightedBlock
                  id="approved_ministry"
                  v-model="budgetItem.approved_ministry"
                  name="approved_ministry"
                  background-color="white"
                  :label="$t('budget.approved-ministry') + ':'"
                  editable
                />
              </div>

              <Divider />

              <div class="flex align-items-center gap-4">
                <WMHighlightedBlock
                  id="executed-payments"
                  v-model="budgetItem.executed_payments"
                  name="executed-payments"
                  background-color="white"
                  :label="$t('budget.executed-payments') + ':'"
                />

                <WMHighlightedBalanceBlock
                  id="balance"
                  name="balance"
                  :quantity="budgetItem.balance_approved"
                  :label="$t('budget.balance') + ':'"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
    <pre style="min-height: 50vh">{{ values }}</pre>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();
const { getBudgetItem, updateBudgetItem, parseUpdateBudgetItem } = useProjects();
const route = useRoute();
const toast = useToast();

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

// COMPONENT METHODS
const { handleSubmit, values, meta, resetForm } = useForm();

const fetchData = () => {
  getBudgetItem(route.params.id, route.params.budgetId).then((response) => {
    budgetItem.value = response;
    utilsStore.selectedElements["budget-item"] = [budgetItem.value];
  });
};

fetchData();

const onSave = handleSubmit((values) => {
  updateBudgetItem(route.params.id, route.params.budgetId, parseUpdateBudgetItem(values))
    .then(() => {
      toast.successAction("budget item", "updated");
      resetForm({ values: values });
      fetchData();
    })
    .catch((error) => {
      console.error(error);
      toast.error("budget item", "not-updated");
    });
});

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "budget-item";
utilsStore.entity = "budget-item";

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
