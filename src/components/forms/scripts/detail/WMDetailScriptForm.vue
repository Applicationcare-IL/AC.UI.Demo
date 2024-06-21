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
                    :label="$t('scripts.name') + ':'"
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
            <template #title>{{ $t("related-entity") }} </template>
            <template #content>
              <div class="flex flex-column gap-3">
                <template v-if="script && script.related_entity === null">
                  <span class="h5"> This script is not related to any entity </span>

                  <Dropdown
                    v-model="selectedEntity"
                    :options="entities"
                    optionLabel="name"
                    placeholder="Select an entity"
                    class="w-full md:w-14rem"
                    @change="onEntityChange($event.value)"
                  />
                </template>
                <template v-if="script && script.related_entity">
                  <!-- <pre>{{ script.related_entity }}</pre> -->
                  <div class="flex flex-auto flex-column gap-5">
                    <div class="flex flex-column gap-5">
                      <WMInput
                        name="name"
                        type="info"
                        :highlighted="true"
                        :label="$t('related-entity') + ':'"
                        :value="script.related_entity.easymaze_entity"
                        width="300"
                      />
                      <WMInput
                        name="send_email"
                        type="input-select-button"
                        :highlighted="true"
                        :label="$t('scripts.send-email') + ':'"
                        :options="yesNoOptions"
                        :value="sendEmail"
                        width="80"
                        @update:selected-item="onSendEmailChange"
                      />

                      <template v-if="sendEmail && sendEmail.value">
                        <div style="width: 280px" class="flex flex-column gap-3">
                          <WMInput
                            name="emailSubject"
                            type="input-text"
                            :highlighted="true"
                            :label="$t('email-subject') + ':'"
                          />
                          <WMInput
                            name="emailBody"
                            type="input-text"
                            :highlighted="true"
                            :label="$t('email-body') + ':'"
                          />
                        </div>
                      </template>

                      <!-- <WMSaveButton /> -->
                    </div>
                  </div>
                </template>
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
import { ref } from "vue";
import { useRoute } from "vue-router";

import { useOptionSetsStore } from "@/stores/optionSets";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const route = useRoute();
const formUtilsStore = useFormUtilsStore();
const utilsStore = useUtilsStore();
const optionSetsStore = useOptionSetsStore();

const { getScript, relateScriptWithEntity } = useAdminFlowmaze();
const { getEasymazeEntitiesList } = useAdminSystem();

// INJECT

// PROPS, EMITS

// REFS
const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo");

const script = ref(null);
const entities = ref([]);

const selectedEntity = ref();
const sendEmail = ref(yesNoOptions[1]); // default value is 'No'

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
    entities.value = result.data;
  });
};

fetchScript();
fetchEntities();

formUtilsStore.formEntity = "script";
utilsStore.entity = "script";

const onEntityChange = (entity) => {
  relateScriptWithEntity(script.value.id, entity.id);
  fetchScript();
};

const onSendEmailChange = (value) => {
  sendEmail.value = value;
};

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>

<style scoped></style>
