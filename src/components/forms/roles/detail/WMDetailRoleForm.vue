<template>
  <div v-if="role" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("role.general-info") }} </template>
            <template #content>
              <div class="flex flex-row gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                      name="id"
                      type="info"
                      :highlighted="true"
                      :label="$t('id') + ':'"
                      :value="role.id"
                  />
                  <WMInput
                      name="name"
                      type="input-text"
                      :highlighted="true"
                      :label="$t('role.role-name') + ':'"
                      :value="role.name"
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
import {useForm} from "vee-validate";
import {ref, watch} from "vue";
import {useRoute} from "vue-router";

import useAdminRoles from "@/composables/useAdminRoles";
import {useFormUtilsStore} from "@/stores/formUtils";
import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { getRole, updateRole, parseRole } = useAdminRoles();

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

const emit = defineEmits(["roleUpdated"]);


// REFS
const role = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getRoleUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateRole(route.params.id, parseRole(values))
      .then(() => {
        toast.success({ message: "Role updated successfully" });
        resetForm({ values: values });
        emit("roleUpdated");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error updating role");
      });
});

const loadLazyData = async () => {
  role.value = await getRole(route.params.id);
  utilsStore.selectedElements["role"] = [role.value];
};

loadLazyData();

formUtilsStore.formEntity = "role";
utilsStore.entity = "role";

// PROVIDE, EXPOSE
defineExpose({
  onSave,
  loadLazyData,
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

<style scoped></style>
