<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">
        {{ $t("new", ["budget.budget-item"]) }}
      </h1>
      <h2 class="h2 my-0">{{ $t("general-details") }}</h2>
      <div class="wm-form-row gap-5">
        <div class="wm-form-row flex-column align-items-start gap-5">
          <WMInput
            name="budget"
            type="info-link"
            :highlighted="true"
            :label="$t('budget.budget') + ':'"
            :value="relatedBudget.id"
            :to="'/project/' + relatedBudget.project?.id + '/budget'"
          />

          <WMInput
            id="budget-item-name"
            type="input-text"
            :label="$t('budget.budget-item-name') + ':'"
            name="budget-item-name"
            required
          />

          <WMInput
            id="description"
            :label="$t('description') + ':'"
            type="text-area"
            name="description"
            width="full"
          />
        </div>
      </div>
      <Divider />
      <h2 class="h2 my-0">
        {{ $t("budget.budget-items-components-details") }}
      </h2>
      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <div class="flex flex-column gap-5">
            <div class="flex align-items-center justify-content-between gap-2">
              <WMHighlightedBlock
                id="estimate"
                name="estimate"
                background-color="purple-100"
                :label="$t('budget.estimate') + ':'"
                editable
                size="small"
                @change="recalculateBudgetItem"
              />
              <Divider layout="vertical" />
              <WMHighlightedBlock
                id="planned_contract"
                name="planned_contract"
                background-color="blue-100"
                :label="$t('budget.planned-contract') + ':'"
                editable
                size="small"
                @change="recalculateBudgetItem"
              />
              <PlusIcon />
              <WMHighlightedBlock
                id="unexpected"
                name="unexpected"
                background-color="blue-100"
                :label="$t('budget.unexpected') + ':'"
                editable
                size="small"
                @change="recalculateBudgetItem"
              />
              <PlusIcon />
              <WMHighlightedBlock
                id="management_fee"
                name="management_fee"
                background-color="blue-100"
                :label="$t('budget.management-fee') + ':'"
                editable
                size="small"
                @change="recalculateBudgetItem"
              />
              <EqualIcon />
              <WMHighlightedBlock
                id="total"
                v-model="total"
                name="total"
                background-color="blue-200"
                :label="$t('budget.total') + ':'"
                size="small"
              />
            </div>

            <Divider />

            <div class="flex align-items-center gap-4">
              <WMHighlightedBlock
                id="approved_council"
                name="approved_council"
                background-color="green-100"
                :label="$t('budget.approved-council') + ':'"
                editable
                size="small"
                @change="recalculateBudgetItem"
              />

              <ArrowIcon :class="layoutConfig.isRTL.value ? '' : 'rotate-180'" />

              <WMHighlightedBlock
                id="approved_ministry"
                name="approved_ministry"
                background-color="green-100"
                :label="$t('budget.approved-ministry') + ':'"
                editable
                size="small"
                @change="recalculateBudgetItem"
              />

              <Divider layout="vertical" />

              <WMHighlightedBlock
                id="executed_payments"
                name="executed_payments"
                background-color="white"
                :label="$t('budget.executed-payments') + ':'"
                size="small"
              />

              <WMHighlightedBalanceBlock
                id="balance"
                v-model="balance"
                name="balance"
                :quantity="1"
                :label="$t('budget.balance') + ':'"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="my-4"></div>
    <WMFormButtons v-if="isSidebar" @save-form="onSave()" @cancel-form="onCancel()" />
  </div>
</template>

<script setup>
// IMPORTS
import { useDebounceFn } from "@vueuse/core";
import { useForm } from "vee-validate";
import { inject, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useLayout } from "@/layout/composables/layout";
import { useFormUtilsStore } from "@/stores/formUtils";

// DEPENDENCIES
const toast = useToast();
const route = useRoute();
const { createBudgetItem, parseUpdateBudgetItem, calculateNewBudgetItem } = useProjects();
const formUtilsStore = useFormUtilsStore();
const { layoutConfig } = useLayout();

// INJECT
const isFormDirty = inject("isFormDirty");
const closeSidebar = inject("closeSidebar");

// PROPS, EMITS
defineProps({
  relatedBudget: {
    type: Object,
    required: true,
  },
  isSidebar: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["newBudgetItemCreated"]);

// REFS
const total = ref(0);
const balance = ref(0);

// COMPUTED

// COMPONENT METHODS
const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formUtilsStore.getNewBudgetItemFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  createBudgetItem(route.params.id, parseUpdateBudgetItem(values))
    .then(() => {
      toast.successAction("budget item", "updated");

      emit("newBudgetItemCreated");
      resetForm({ values: values });

      isFormDirty.value = false;

      closeSidebar();
    })
    .catch((error) => {
      console.error(error);
      toast.error("budget item", "not-updated");
    });
});

const recalculateBudgetItem = useDebounceFn(() => {
  calculateNewBudgetItem(parseUpdateBudgetItem(values))
    .then((response) => {
      total.value = response.total_approved;
      balance.value = response.balance;
    })
    .catch((error) => {
      console.error(error);
    });
}, 200);

const onCancel = () => {
  closeSidebar();
};

// PROVIDE, EXPOSE
defineExpose({
  onSave,
  onCancel,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    isFormDirty.value = value.dirty;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped lang="scss"></style>
