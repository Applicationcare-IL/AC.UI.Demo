<template>
  <pre>{{ milestone }}</pre>
  <div
    v-if="milestone"
    class="wm-detail-form-container flex flex-column overflow-auto gap-5"
  >
    <div class="flex flex-row gap-5 flex-wrap">
      <div class="flex-1 card-container top-info-card">
        <Card>
          <template #title> {{ $t("general-details") }} </template>
          <template #content>
            <div class="flex flex-auto flex-column gap-5">
              <div class="wm-form-row align-items-start flex-column gap-5">
                <!-- <WMInput
                  name="budget"
                  type="info-link"
                  :highlighted="true"
                  :label="$t('budget.budget') + ':'"
                  :value="budgetItem.budget?.id"
                  :to="'/project/' + budgetItem.project?.id + '/budget'"
                />

                <WMInput
                  id="milestone-name"
                  type="input-text"
                  :label="$t('budget.milestone-name') + ':'"
                  name="milestone-name"
                  :value="budgetItem.name"
                /> -->
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
                  :value="milestone.description"
                  width="full"
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
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();

const { getProjectMilestone, updateBudgetItem, parseUpdateBudgetItem } =
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
const milestone = ref(null);

// COMPUTED

// COMPONENT METHODS
const { handleSubmit, meta, resetForm } = useForm();

const fetchData = () => {
  getProjectMilestone(route.params.id, route.params.milestoneId).then(
    (response) => {
      milestone.value = response;
      utilsStore.selectedElements["milestone"] = [milestone.value];
    }
  );
};

fetchData();

const onSave = handleSubmit((values) => {
  updateBudgetItem(
    route.params.id,
    route.params.budgetId,
    parseUpdateBudgetItem(values)
  )
    .then(() => {
      toast.success(t("toast.milestone-updated"));
      resetForm({ values: values });
      fetchData();
    })
    .catch((error) => {
      console.error(error);
      toast.error(t("toast.error"));
    });
});

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "milestone";
utilsStore.entity = "milestone";

// PROVIDE, EXPOSE
defineExpose({
  onSave,
  fetchData,
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
