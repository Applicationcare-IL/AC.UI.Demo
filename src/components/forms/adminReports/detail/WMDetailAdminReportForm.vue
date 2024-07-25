<template>
  <!-- <pre>{{ report }}</pre> -->
  <div v-if="report" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #content>
              <pre>{{ report }}</pre>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <!-- <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="report.id"
                  /> -->
                </div>
                <div class="wm-form-row gap-5">
                  <!-- <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('first-name') + ':'"
                    :value="report.name"
                    required
                  />
                  <WMInput
                    name="surname"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('last-name') + ':'"
                    :value="report.surname"
                    required
                  /> -->
                </div>
                <div class="wm-form-row gap-5">
                  <!-- <WMInput
                    name="phone"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('mobilephone') + ':'"
                    :value="report.phone"
                    required
                  />
                  <WMInput
                    name="email"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('email') + ':'"
                    :value="report.email"
                    size="md"
                    required
                  /> -->
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
  <!-- 
  report DETAIL:
  <pre>{{ report }}</pre> -->
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { getReport } = useAdminReports();

const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["reportUpdated"]);

// REFS
const report = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getreportUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updatereport(route.params.id, parseUpdatereport(values))
    .then(() => {
      toast.success({ message: "report updated successfully" });
      resetForm({ values: values });
      emit("reportUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating report");
    });
});

const loadLazyData = async () => {
  let response = await getReport(route.params.id);
  report.value = response;
  utilsStore.selectedElements["admin-report"] = [report.value];
};

loadLazyData();

formUtilsStore.formEntity = "admin-report";
utilsStore.entity = "admin-report";

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
</script>
