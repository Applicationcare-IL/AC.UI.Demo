<template>
  <div v-if="process" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container">
          <Card>
            <template #title> {{ $t("general-details") }}</template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="process.id"
                  />
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('process.name') + ':'"
                    :value="process.name"
                    size="md"
                    required
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMDuration :duration="process.duration" />
                  <WMInputSearch
                    v-if="teams"
                    name="default-team"
                    highlighted
                    :label="$t('process.default-team') + ':'"
                    :placeholder="$t('process.select-team')"
                    :options="teams.data"
                    size="md"
                    required
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container">
          <Card>
            <template #title> {{ $t("logs") }}</template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="date_created"
                    type="info"
                    :highlighted="true"
                    :label="$t('message.date_created') + ':'"
                    :value="process.last_activity?.creator.at"
                  />
                  <WMInput
                    name="last_changed"
                    type="info"
                    :highlighted="true"
                    :label="$t('message.last_changed') + ':'"
                    :value="process.last_activity?.updater.at"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="created_by"
                    type="info"
                    :highlighted="true"
                    :label="$t('message.created_by') + ':'"
                    :value="process.last_activity?.creator.name"
                  />
                  <WMInput
                    name="last_changed_by"
                    type="info"
                    :highlighted="true"
                    :label="$t('message.last_changed_by') + ':'"
                    :value="process.last_activity?.updater.name"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const route = useRoute();

const formUtilsStore = useFormUtilsStore();
const toast = useToast();
const { t } = useI18n();
const optionSetsStore = useOptionSetsStore();

const updateProcess = useAdminProcess();
const { getTeams } = useAdminTeams();

// INJECT

// PROPS, EMITS
const props = defineProps({
  process: {
    type: Object,
    required: true,
  },
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["processUpdated"]);

// REFS
const teams = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  //   validationSchema: formUtilsStore.,
});

const onSave = handleSubmit((values) => {
  updateProcess(route.params.id, values)
    .then(() => {
      toast.success({ process: "Process updated successfully" });
      resetForm({ values: values });
      emit("processUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating process");
    });
});

const loadLazyData = async () => {
  let activeStateId = await optionSetsStore.getId("state", "active");

  let params = {
    per_page: 999999999,
    state: activeStateId,
  };

  teams.value = await getTeams(params);
};
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
  },
  { deep: true }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  await loadLazyData();
  formUtilsStore.formEntity = "process";
});
</script>
