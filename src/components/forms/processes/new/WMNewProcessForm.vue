<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container">
          <Card>
            <template #title> {{ $t("general-details") }}</template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('process.name') + ':'"
                    size="md"
                    required
                  />
                </div>
                <div class="wm-form-row gap-5">
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
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { inject, onMounted, ref, watch } from "vue";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useOptionSetsStore } from "@/stores/optionSets";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const createProcess = useAdminProcess();
const dialog = useDialog();
const toast = useToast();
const optionSetsStore = useOptionSetsStore();
const { getTeams } = useAdminTeams();

// INJECT
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
const props = defineProps({
  isSidebar: Boolean,
});

const emit = defineEmits(["newProcessCreated"]);

// REFS
const teams = ref();
// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getRoleNewFormValidationSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    let data = await createProcess(values);

    emit("newProcessCreated");
    dialog.confirmNewAdminProcess({ id: data.data.id, emit });

    resetForm();

    toast.success({ title: "Process created", message: "Process created successfully" });
  } catch (error) {
    console.error(error);
  }
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
  onSubmit,
});

// WATCHERS
watch(
  () => meta.value,
  (value) => {
    if (!isFormDirty) return;

    isFormDirty.value = value.dirty;
  }
);

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(async () => {
  loadLazyData();
});
</script>

<style scoped></style>
