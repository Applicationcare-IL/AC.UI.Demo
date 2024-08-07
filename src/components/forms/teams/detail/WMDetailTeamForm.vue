<template>
  <div v-if="team" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("team.general-info") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    label-size="large"
                    required
                    :value="team.id"
                  />

                  <WMInput
                    name="name"
                    :required="true"
                    type="input-text"
                    :label="$t('team-name') + ':'"
                    :value="team.name"
                    size="md"
                  />

                  <WMInputDropdownManager :selected-manager="team.manager" size="md" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-content-end gap-5">
      <WMLinkedAdminUserTable
        :columns="columns"
        related-entity="team"
        :related-entity-id="team.id"
        selectable
        preview
      />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import WMInput from "@/components/forms/WMInput.vue";
import useAdminTeams from "@/composables/useAdminTeams";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { getTeam, updateTeam, parseTeam } = useAdminTeams();

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

const emit = defineEmits(["teamUpdated"]);

// REFS
const team = ref(null);

const columns = [
  {
    name: "id",
    type: "link",
    field: "link_detail",
    header: "id",
    routeName: "adminUserDetail",
  },
  {
    name: "username",
    type: "text",
    field: "username",
    header: "employee.username",
  },
  {
    name: "email",
    type: "text",
    field: "email",
    header: "email",
  },
];

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getTeamUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateTeam(route.params.id, parseTeam(values))
    .then(() => {
      toast.success({ message: "User updated successfully" });
      resetForm({ values: values });
      emit("teamUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating team");
    });
});
const loadLazyData = async () => {
  team.value = await getTeam(route.params.id);
  utilsStore.selectedElements["team"] = [team.value];
};

loadLazyData();

formUtilsStore.formEntity = "team";
utilsStore.entity = "team";

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

<style scoped></style>
