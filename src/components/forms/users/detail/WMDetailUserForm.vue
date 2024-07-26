<template>
  <!-- <pre>{{ user }}</pre> -->
  <div v-if="user" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("employee.general-info") }} </template>
            <template #content>
              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="user.id"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('first-name') + ':'"
                    :value="user.name"
                    required
                  />
                  <WMInput
                    name="surname"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('last-name') + ':'"
                    :value="user.surname"
                    required
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="phone"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('mobilephone') + ':'"
                    :value="user.phone"
                    required
                  />
                  <WMInput
                    name="email"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('email') + ':'"
                    :value="user.email"
                    size="md"
                    required
                  />
                </div>
                <WMInputDropdownManager :selected-manager="user.manager" />
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container top-info-card" style="flex: 2">
          <Card >
            <template #title> {{ $t("employee.teams-and-roles") }} </template>
            <template #content>
              <WMInputSearch
                  v-if="teams"
                  name="teams"
                  :placeholder="$t('select-team')"
                  :required="true"
                  :multiple="true"
                  size="full"
                  :options="teams.data"
                  :highlighted="true"
              />

              <pre>{{ updateTeams }}</pre>
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
import {computed,ref, watch} from "vue";
import {useRoute} from "vue-router";

import useAdminTeams from "@/composables/useAdminTeams";
import {useFormUtilsStore} from "@/stores/formUtils";
import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const { getUser, updateUser, parseUpdateUser } = useAdminUsers();
const { getTeams } = useAdminTeams();

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

const emit = defineEmits(["userUpdated"]);

// REFS
const user = ref(null);
const teams = ref();

// COMPUTED
const updateTeams = computed(() => {
  return values.teams?.map((team) => team.id);
});

// COMPONENT METHODS AND LOGIC
const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formUtilsStore.getUserUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  values.teams?.map((team) => team.id);

  updateUser(route.params.id, parseUpdateUser(values))
    .then(() => {
      toast.success({ message: "User updated successfully" });
      resetForm({ values: values });
      emit("userUpdated");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error updating user");
    });

});

const loadLazyData = async () => {
  user.value = await getUser(route.params.id);
  utilsStore.selectedElements["employee"] = [user.value];

  teams.value = await getTeams();
};

loadLazyData();

formUtilsStore.formEntity = "employee";
utilsStore.entity = "employee";

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
