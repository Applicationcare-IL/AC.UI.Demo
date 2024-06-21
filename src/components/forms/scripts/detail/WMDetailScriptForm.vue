<template>
  <div v-if="script" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="asset-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="script.id"
                  />

                  <WMInput
                    name="name"
                    type="info"
                    :highlighted="true"
                    :label="$t('name') + ':'"
                    :value="script.name"
                    width="300"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="'Flowmaze ID' + ':'"
                    :value="script.flowmaze_id"
                  />
                  <WMInput
                    name="id"
                    type="info"
                    :highlighted="true"
                    :label="'Hash' + ':'"
                    :value="script.hash"
                    width="300"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> Related entity </template>
            <template #content>
              <span class="h5" v-if="script && script.related_entity === null">
                This script is not related to any entity
              </span>
              <!-- <pre>{{ entities }}</pre> -->
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRoute } from "vue-router";

import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getScript } = useAdminFlowmaze();
const route = useRoute();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();

const { getEasymazeEntitiesList } = useAdminSystem();

// INJECT

// PROPS, EMITS

// REFS
const script = ref(null);
const entities = ref([]);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const fetchScript = () => {
  getScript(route.params.id).then((result) => {
    script.value = result;
    utilsStore.selectedElements["script"] = [script.value];
  });
};

const fetchEntities = () => {
  getEasymazeEntitiesList().then((result) => {
    entities.value = result;
  });
};

fetchScript();
fetchEntities();

formUtilsStore.formEntity = "script";
utilsStore.entity = "script";

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
