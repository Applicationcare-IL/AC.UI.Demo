<template>
  <div
    v-if="budgetItem"
    class="wm-detail-form-container flex flex-column overflow-auto gap-5"
  >
    <pre style="min-height: 50vh">{{ budgetItem }}</pre>
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">{{ $t("budget.budget") }}: BUDGET ITEM</h1>
        </div>
      </div>
    </div>
    <!-- <pre>
  {{ budget }}
  </pre
    > -->
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
              <WMHighlightedBlock
                id="planned_non_contract"
                v-model="budgetItem.estimate"
                name="planned_non_contract"
                background-color="blue-100"
                :label="$t('budget.planned-non-contract') + ':'"
                editable
              />

              <!-- <div class="flex flex-row gap-5">
                <WMHighlightedBlock
                  v-model="budget.planned_contract"
                  background-color="blue-100"
                  :label="$t('budget.planned-contract') + ':'"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budget.management_fee"
                  background-color="blue-100"
                  :label="$t('budget.management-fee') + ':'"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budget.unexpected"
                  background-color="blue-100"
                  :label="$t('budget.unexpected') + ':'"
                />
                <EqualIcon />
                <WMHighlightedBlock
                  v-model="budget.total_planned"
                  background-color="blue-200"
                  :label="$t('budget.total') + ':'"
                />
              </div> -->
              <Divider></Divider>
            </div>
          </template>
        </Card>
      </div>
    </div>
    <pre style="min-height: 50vh">{{ values }}</pre>
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";

const formUtilsStore = useFormUtilsStore();

const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const route = useRoute();

const { getBudgetItem, updateBudgetItem, parseUpdateBudgetItem } =
  useProjects();

const budgetItem = ref(null);

const { handleSubmit, values, meta, resetForm } = useForm();

// const projectId = computed(() => {
//   return route.params.id;
// });

getBudgetItem(route.params.id, route.params.budgetId).then((response) => {
  budgetItem.value = response;
});

formUtilsStore.formEntity = "budget-item";

const toast = useToast();

const onSave = handleSubmit((values) => {
  updateBudgetItem(
    route.params.id,
    route.params.budgetId,
    parseUpdateBudgetItem(values)
  )
    .then(() => {
      toast.successAction("budget item", "updated");
      resetForm({ values: values });
    })
    .catch((error) => {
      console.error(error);
      toast.error("budget item", "not-updated");
    });
});

// EXPOSE
defineExpose({
  onSave,
});

watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  }
);
</script>

<style scoped lang="scss"></style>
