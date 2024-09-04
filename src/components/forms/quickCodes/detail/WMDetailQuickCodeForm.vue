<template>
  <div v-if="quickCode" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">

      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container">

          <Card class="p-card--first-top-card">
            <template #title> {{ $t("general-details") }}</template>
            <template #content>

              <div class="flex flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                      name="id"
                      type="info"
                      :highlighted="true"
                      :label="$t('id') + ':'"
                      :value="quickCode.id"
                  />

                  <WMInput
                      name="name"
                      type="input-text"
                      :highlighted="true"
                      :label="$t('quick-code.name') + ':'"
                      :value="quickCode.name"
                      size="md"
                      required
                  />

                  <WMInputSearch
                      v-model="selectedTeam"
                      name="team"
                      :required="true"
                      type="input-select"
                      :label="$t('team-name') + ':'"
                      :options="teams.data"
                      size="md"
                  />

                </div>
              </div>

            </template>
          </Card>

        </div>
      </div>

      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container">

          <Card class="p-card--first-top-card">
            <template #title> {{ $t("classification") }}</template>
            <template #content>

              <div class="flex flex-column gap-5">

                <WMInputSearch
                    v-model="selectedArea"
                    name="service_area"
                    type="input-select"
                    :highlighted="true"
                    :placeholder="$t('message.select-service-area')"
                    :label="$t('message.service-area') + ':'"
                    :options="areas"
                    size="md"
                    :required="true"
                    @change="handleAreasChange"
                />

                <WMInputSearch
                    v-model="selectedType"
                    name="service_type"
                    type="input-select"
                    :highlighted="true"
                    :placeholder="$t('message.select-service-detail')"
                    :label="$t('message.service-detail') + ':'"
                    :options="types"
                    size="md"
                    :disabled="isTypeEmpty"
                    :required="true"
                    @change="handleTypesChange"
                />

                <WMInputSearch
                    v-model="selectedRequest1"
                    name="service_request_1"
                    type="input-select"
                    :highlighted="true"
                    :placeholder="$t('message.select-request') + ' 1'"
                    :label="$t('message.request') + ' 1:'"
                    :options="requests1"
                    size="md"
                    :disabled="isRequest1Empty"
                    :required="true"
                    @change="handleRequest1Change"
                />

                <WMInputSearch
                    v-model="selectedRequest2"
                    name="service_request_2"
                    type="input-select"
                    :highlighted="true"
                    :placeholder="$t('message.select-request') + ' 2'"
                    :label="$t('message.request') + ' 2:'"
                    :options="requests2"
                    size="md"
                    :disabled="isRequest2Empty"
                    @change="handleRequest2Change"
                />

                <WMInputSearch
                    v-model="selectedRequest3"
                    name="service_request_3"
                    type="input-select"
                    :highlighted="true"
                    :placeholder="$t('message.select-request') + ' 3'"
                    :label="$t('message.request') + ' 3:'"
                    :options="requests3"
                    :disabled="isRequest3Empty"
                    size="md"
                />

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
                      :value="quickCode.last_activity?.creator.at"
                  />
                  <WMInput
                      name="last_changed"
                      type="info"
                      :highlighted="true"
                      :label="$t('message.last_changed') + ':'"
                      :value="quickCode.last_activity?.updater.at"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                      name="created_by"
                      type="info"
                      :highlighted="true"
                      :label="$t('message.created_by') + ':'"
                      :value="quickCode.last_activity?.creator.name"
                  />
                  <WMInput
                      name="last_changed_by"
                      type="info"
                      :highlighted="true"
                      :label="$t('message.last_changed_by') + ':'"
                      :value="quickCode.last_activity?.updater.name"
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
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";

import useAdminQuickCodes from "@/composables/useAdminQuickCodes";
import useAdminTeams from "@/composables/useAdminTeams";
import {useFormUtilsStore} from "@/stores/formUtils";
import {useOptionSetsStore} from "@/stores/optionSets";
import {useUtilsStore} from "@/stores/utils";

// DEPENDENCIES
const optionSetsStore = useOptionSetsStore();
const route = useRoute();

const {updateQuickCode} = useAdminQuickCodes();
const {getTeams} = useAdminTeams();

const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const toast = useToast();

// INJECT

// PROPS, EMITS
const props = defineProps({
  quickCode: {
    type: Object,
    required: true,
  },
  formKey: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["quickCodeUpdated"]);

// REFS
const teams = ref([]);

const selectedTeam = ref(null);

const areas = ref([]);
const types = ref([]);
const requests1 = ref([]);
const requests2 = ref([]);
const requests3 = ref([]);

const selectedArea = ref(null);
const selectedType = ref(null);
const selectedRequest1 = ref(null);
const selectedRequest2 = ref(null);
const selectedRequest3 = ref(null);

const isTypeEmpty = ref(true);
const isRequest1Empty = ref(true);
const isRequest2Empty = ref(true);
const isRequest3Empty = ref(true);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  let activeStateId = await optionSetsStore.getId("state", "active");

  let filters = {
    per_page: 99999,
    state: activeStateId,
  };

  teams.value = await getTeams(filters);

  selectedTeam.value = props.quickCode.team;

  await optionSetsStore
      .getOptionSetValuesFromApiRaw("service_area")
      .then((data) => (areas.value = data));
};

const filterTypes = async (value) => {
  await optionSetsStore
      .getOptionSetValuesFromApiRaw("service_type", value)
      .then((data) => (types.value = data));
  isTypeEmpty.value = false;
};

const filterRequests1 = async (value) => {
  await optionSetsStore
      .getOptionSetValuesFromApiRaw("service_request_1", value)
      .then((data) => (requests1.value = data));
  isRequest1Empty.value = false;
};

const filterRequests2 = async (value) => {
  await optionSetsStore
      .getOptionSetValuesFromApiRaw("service_request_2", value)
      .then((data) => (requests2.value = data));
  isRequest2Empty.value = false;
};

const filterRequests3 = async (value) => {
  await optionSetsStore
      .getOptionSetValuesFromApiRaw("service_request_3", value)
      .then((data) => (requests3.value = data));
  isRequest3Empty.value = false;
};

const clearTypes = () => {
  types.value = [];
  selectedType.value = null;
  isTypeEmpty.value = true;
};

const clearRequest1 = () => {
  requests1.value = [];
  selectedRequest1.value = null;
  isRequest1Empty.value = true;
};

const clearRequest2 = () => {
  requests2.value = [];
  selectedRequest2.value = null;
  isRequest2Empty.value = true;
};

const clearRequest3 = () => {
  requests3.value = [];
  selectedRequest3.value = null;
  isRequest3Empty.value = true;
};

const handleAreasChange = async (option) => {
  if (!option) {
    clearTypes();
    clearRequest1();
    clearRequest2();
    clearRequest3();
    return;
  }

  await filterTypes(option.value.id);
};

const handleTypesChange = async (option) => {
  if (!option) {
    clearRequest1();
    clearRequest2();
    clearRequest3();
    return;
  }
  await filterRequests1(option.value.id);
};

const handleRequest1Change = async (option) => {
  if (!option) {
    clearRequest2();
    clearRequest3();
    return;
  }
  await filterRequests2(option.value.id);
};

const handleRequest2Change = async (option) => {
  if (!option) {
    clearRequest3();
    return;
  }
  await filterRequests3(option.value.id);
};

const {handleSubmit, meta, resetForm} = useForm({
  validationSchema: formUtilsStore.getQuickCodeUpdateFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateQuickCode(route.params.id, values)
      .then(() => {
        toast.success({message: "Quick code updated successfully"});
        resetForm({values: values});
        emit("quickCodeUpdated");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error updating quick code");
      });
});

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
onMounted(async () => {
  await loadLazyData();

  formUtilsStore.formEntity = "quick-code";
  utilsStore.entity = "quick-code";
  
  if (props.quickCode) {
    selectedArea.value = areas.value.find(
        (area) => area.id === props.quickCode.area?.id
    );
    await handleAreasChange(selectedArea.value);
    selectedType.value = types.value.find(
        (type) => type.id === props.quickCode.type?.id
    );
    await handleTypesChange(selectedType.value);
    selectedRequest1.value = requests1.value.find(
        (request) => request.id === props.quickCode.request_1?.id
    );
    await handleRequest1Change(selectedRequest1.value);
    selectedRequest2.value = requests2.value.find(
        (request) => request.id === props.quickCode.request_2?.id
    );
    await handleRequest2Change(selectedRequest2.value);
    selectedRequest3.value = requests3.value.find(
        (request) => request.id === props.quickCode.request_3?.id
    );
  }
})
</script>

<style scoped></style>
