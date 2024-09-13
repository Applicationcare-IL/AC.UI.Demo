<template>
  <div class="wm-new-form-container flex flex-auto flex-column overflow-auto">
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <h1 v-if="!isSidebar" class="h1 mb-0">{{ $t("new", ["quick-code.quick-code"]) }}</h1>
      <h3 class="h3 my-0">{{ $t("general-details") }}</h3>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInput
              name="name"
              :required="true"
              type="input-text"
              :label="$t('quick-code.quick-code-name') + ':'"
              size="md"
          />
        </div>
      </div>

      <div class="wm-form-row align-items-end gap-5">
        <div class="wm-form-row gap-5">
          <WMInputSearch
              name="team"
              :required="true"
              type="input-select"
              :label="$t('team-name') + ':'"
              :options="teams.data"
              size="md"
          />
        </div>
      </div>

      <Divider class="my-5" layout="horizontal" style="height: 4px" />
      <h3 class="h3 my-0">{{ $t("classification.classification") }}</h3>
      <div class="flex flex-column gap-3">

        <div v-if="isClassificationErrorVisible" class="bg-red-100 text-red-600 p-2 secondary-typography text-sm">
          {{ $t('quick-code.classification-error') }}
        </div>

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

      <Divider class="my-5" layout="horizontal" style="height: 4px" />

      <WMFormButtons v-if="isSidebar" @save-form="onSubmit()" @cancel-form="onCancel()" />
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { useForm } from "vee-validate";
import {inject, onMounted, ref, watch} from "vue";

import WMInput from "@/components/forms/WMInput.vue";
import useAdminQuickCodes from "@/composables/useAdminQuickCodes";
import useAdminTeams from "@/composables/useAdminTeams";
import {useFormUtilsStore} from "@/stores/formUtils";
import {useOptionSetsStore} from "@/stores/optionSets";

// DEPENDENCIES
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const {getTeams} = useAdminTeams();
const {createQuickCode, existQuickCodeClassification} = useAdminQuickCodes();

const toast = useToast();
const dialog = useDialog();

// INJECT
const closeSidebar = inject("closeSidebar");
const isFormDirty = inject("isFormDirty");

// PROPS, EMITS
const props = defineProps({
  isSidebar: Boolean,
});

const emit = defineEmits(["newQuickCodeCreated"]);

// REFS
const teams = ref([]);

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

const isClassificationErrorVisible = ref(false);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  let activeStateId = await optionSetsStore.getId("state", "active");

  let filters = {
    per_page: 99999,
    state: activeStateId,
  };

  teams.value = await getTeams(filters);

  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_area")
      .then((data) => (areas.value = data));
}

const filterTypes = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_type", value)
      .then((data) => (types.value = data));
  isTypeEmpty.value = false;
};

const filterRequests1 = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_request_1", value)
      .then((data) => (requests1.value = data));
  isRequest1Empty.value = false;
};

const filterRequests2 = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_request_2", value)
      .then((data) => (requests2.value = data));
  isRequest2Empty.value = false;
};

const filterRequests3 = (value) => {
  optionSetsStore
      .getOptionSetValuesFromApiRaw("service_request_3", value)
      .then((data) => (requests3.value = data));
  isRequest3Empty.value = false;
};

const clearTypes = () => {
  types.value = [];
  selectedType.value = null;
  isTypeEmpty.value = true;
  isClassificationErrorVisible.value = false;
}

const clearRequest1 = () => {
  requests1.value = [];
  selectedRequest1.value = null;
  isRequest1Empty.value = true;
  isClassificationErrorVisible.value = false;
}

const clearRequest2 = () => {
  requests2.value = [];
  selectedRequest2.value = null;
  isRequest2Empty.value = true;
  isClassificationErrorVisible.value = false;
}

const clearRequest3 = () => {
  requests3.value = [];
  selectedRequest3.value = null;
  isRequest3Empty.value = true;
  isClassificationErrorVisible.value = false;
}

const handleAreasChange = (option) => {
  if (!option) {
    clearTypes();
    clearRequest1();
    clearRequest2();
    clearRequest3();
    return;
  }
  filterTypes(option.value.id);
};

const handleTypesChange = (option) => {
  if (!option) {
    clearRequest1();
    clearRequest2();
    clearRequest3();
    return;
  }
  filterRequests1(option.value.id);
};

const handleRequest1Change = (option) => {
  if (!option) {
    clearRequest2();
    clearRequest3();
    return;
  }
  filterRequests2(option.value.id);
};

const handleRequest2Change = (option) => {
  if (!option) {
    clearRequest3();
    return;
  }
  filterRequests3(option.value.id);
};

const existsClassification = async (classifications) => {
  isClassificationErrorVisible.value = await existQuickCodeClassification(classifications);
}

const {handleSubmit, values, meta, resetForm} = useForm({
  validationSchema: formUtilsStore.getQuickCodeNewFormValidationSchema,
});

const onSubmit = handleSubmit(async (values) => {
  const classificationResponse = await existQuickCodeClassification(values);

  if (classificationResponse) {
    isClassificationErrorVisible.value = true;
    return
  }
  createQuickCode(values)
      .then((data) => {
        emit("newQuickCodeCreated");
        dialog.confirmNewAdminQuickCode({id: data.data.id, emit});
        resetForm();

        if (props.isSidebar) {
          isFormDirty.value = false;
          closeSidebar();
        }

        toast.success({title: "Quick Code created", message: "Quick Code created successfully"});
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error");
      });
});

const onCancel = () => {
  closeSidebar();
};

// PROVIDE, EXPOSE
defineExpose({
  onSubmit,
  onCancel,
});

// WATCHERS
watch(
    () => meta.value,
    (value) => {
      if (!isFormDirty) return;

      isFormDirty.value = value.dirty;
    }
);

watch(
    () => [selectedRequest1.value, selectedRequest2.value, selectedRequest3.value],
    () => {
      existsClassification(values);
    }
)

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
onMounted(() => {
  loadLazyData();
});
</script>

<style scoped lang="scss"></style>
