<template>
  <!-- <pre>{{ milestone }}</pre> -->
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
              <div class="wm-form-row gap-5 align-items-start">
                <WMInput
                  name="system_id"
                  type="info"
                  :highlighted="true"
                  :label="$t('milestone.system-id') + ':'"
                  :value="milestone.id"
                />

                <div class="wm-input flex flex-column">
                  <label class="wm-form-label highlighted">
                    {{ $t("milestone.status") + ":" }}
                  </label>
                  <span class="" style="width: 120px">
                    <WMOptionSetValue
                      :option-set="milestone.milestone_status"
                    />
                  </span>
                </div>
              </div>

              <div class="wm-form-row align-items-start gap-5">
                <WMInput
                  name="project"
                  type="info-link"
                  :highlighted="true"
                  :label="$t('project.project') + ':'"
                  :value="milestone.project_id?.name"
                  :to="'/project/' + milestone.project_id?.id"
                />
              </div>

              <div class="wm-form-row align-items-start gap-5">
                <WMInput
                  id="milestone-name"
                  type="input-text"
                  :label="$t('milestone.milestone-name') + ':'"
                  name="milestone-name"
                  :value="milestone.name"
                />

                <WMInput
                  name="type"
                  type="info"
                  :highlighted="true"
                  :label="$t('milestone.milestone-type') + ':'"
                  :value="selectedMilestoneType"
                  option-set
                />
              </div>
              <div class="wm-form-row align-items-start gap-5">
                <WMInput
                  name="plannedDate"
                  type="date"
                  :label="$t('milestone.planned-date') + ':'"
                  :value="
                    formatDate(new Date(milestone.planned_date), 'DD/MM/YYYY')
                  "
                />

                <WMInput
                  name="baseDate"
                  type="date"
                  :label="$t('milestone.base-date') + ':'"
                  :value="
                    formatDate(new Date(milestone.base_date), 'DD/MM/YYYY')
                  "
                />

                <WMInput
                  name="actualDate"
                  type="date"
                  :label="$t('milestone.actual-date') + ':'"
                  :value="
                    formatDate(new Date(milestone.actual_date), 'DD/MM/YYYY')
                  "
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
                  :value="milestone.description"
                  width="full"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
    <div class="flex flex-row gap-5 flex-wrap">
      <Accordion>
        <AccordionTab :header="$t('budget.payments')">
          <WMPaymentsTable
            ref="paymentsTableRef"
            :project-id="route.params.id"
            :milestone-id="route.params.milestoneId"
          />
        </AccordionTab>
      </Accordion>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { formatDate } from "@vueuse/core";
import { useForm } from "vee-validate";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const { getProjectMilestone, updateProjectMilestone, parseMilestone } =
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
const milestoneTypes = ref([]);
const selectedMilestoneType = ref(null);
const refreshInput = ref(0);

// COMPUTED

// COMPONENT METHODS
const { handleSubmit, meta, resetForm } = useForm();

const fetchData = async () => {
  const response = await getProjectMilestone(
    route.params.id,
    route.params.milestoneId
  );

  console.log("response", response);

  milestone.value = response;
  utilsStore.selectedElements["milestone"] = [response];
};

const onSave = handleSubmit((values) => {
  updateProjectMilestone(
    route.params.id,
    route.params.milestoneId,
    parseMilestone(values)
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
onMounted(async () => {
  await fetchData();

  milestoneTypes.value = await optionSetsStore.getOptionSetValuesFromApi(
    "milestone_type"
  );

  if (milestone.value.milestone_type) {
    selectedMilestoneType.value = milestoneTypes.value.find(
      (type) => type.id === milestone.value.milestone_type.id
    );
  }
});
</script>

<style scoped lang="scss"></style>
