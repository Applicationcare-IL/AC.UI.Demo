<template>
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
                      name="first_name"
                      type="input-text"
                      :highlighted="true"
                      :label="$t('first-name') + ':'"
                      :value="user.first_name"
                  />
                  <WMInput
                      name="last_name"
                      type="input-text"
                      :highlighted="true"
                      :label="$t('last-name') + ':'"
                      :value="user.last_name"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                      name="phone"
                      type="input-text"
                      :highlighted="true"
                      :label="$t('mobilephone') + ':'"
                      :value="user.phone"
                  />
                  <WMInput
                      name="email"
                      type="input-text"
                      :highlighted="true"
                      :label="$t('email') + ':'"
                      :value="user.email"
                      size="md"
                  />
                </div>
<!--                <div class="wm-form-row gap-5">-->
<!--                  <WMInput-->
<!--                      name="manager"-->
<!--                      type="input-select"-->
<!--                      :highlighted="true"-->
<!--                      :label="$t('manager') + ':'"-->
<!--                      :value="user.manager"-->
<!--                      size="md"-->
<!--                  />-->
<!--                </div>-->
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>

  USER DETAIL:
  <pre>{{ user }}</pre>
</template>

<script setup>
// IMPORTS
import { ref } from "vue";
import { useRoute } from "vue-router";
import WMInput from "@/components/forms/WMInput.vue";

// DEPENDENCIES
const route = useRoute();
const { getUser } = useAdminUsers();

// INJECT

// PROPS, EMITS

// REFS
const user = ref(null);

// COMPUTED

// COMPONENT METHODS AND LOGIC
const loadLazyData = async () => {
  let response = await getUser(route.params.id);
  user.value = response;
};

loadLazyData();

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)
</script>
