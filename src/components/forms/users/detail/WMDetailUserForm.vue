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
      </div>
    </div>
  </div>
  <!-- 
  USER DETAIL:
  <pre>{{ user }}</pre> -->
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
const { getUser } = useAdminUsers();

const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS
const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

// REFS
const user = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const { meta } = useForm({
  // validationSchema: formUtilsStore.getContactDetailFormValidationSchema,
});

const loadLazyData = async () => {
  let response = await getUser(route.params.id);
  user.value = response;
  utilsStore.selectedElements["employee"] = [user.value];
};

loadLazyData();

formUtilsStore.formEntity = "employee";
utilsStore.entity = "employee";

// PROVIDE, EXPOSE

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
