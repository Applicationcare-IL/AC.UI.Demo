<template>
  <WMDetailFormSubHeader
    entity="team"
    :form-key="formKey"
    :has-action-builder="false"
    :show-message-button="false"
    :show-email-button="false"
    @save-form="saveForm()"
  >
    <template #top-left>
      <WMButton v-if="isActive" :text="$t('buttons.activate')" type="secondary" @click="activateUserFunc()" />
      <WMButton v-if="isNotActive" :text="$t('buttons.deactivate')" type="secondary" @click="deactivateUserFunc()" />
    </template>
  </WMDetailFormSubHeader>
  <WMDetailTeamForm v-if="team" :team="team" ref="detailTeamForm" :form-key="formKey" />
</template>

<script setup>
// IMPORTS
import { ref} from "vue";
import { useRoute } from "vue-router";

import useAdminTeams from "@/composables/useAdminTeams";
import { useUtilsStore } from "@/stores/utils";

// DEPENDENCIES
const { getTeam, activateTeams, deactivateTeam } = useAdminTeams();
const route = useRoute();
const utilsStore = useUtilsStore();

// INJECT

// PROPS, EMITS

// REFS
const formKey = ref("adminTeamDetailForm");
const detailTeamForm = ref();
const team = ref(null);
const isActive = ref();
const isNotActive = ref();

// COMPUTED

// COMPONENT METHODS AND LOGIC
const saveForm = () => {
  detailTeamForm.value.onSave();
};

const loadLazyData = async () => {
  team.value = await getTeam(route.params.id);
  utilsStore.selectedElements["team"] = [team.value];
  if (team.value.state.value === 'active') isNotActive.value = true;
  if (team.value.state.value === 'not_active') isActive.value = true;
};

utilsStore.entity = "team";

loadLazyData();

const activateUserFunc = () => {
  activateTeams([team.value.id]).then(() => {
    isActive.value = !isActive.value;
    isNotActive.value = !isNotActive.value;
    loadLazyData();
  }).catch((error) => {
    console.error(error);
  })
}

const deactivateUserFunc = () => {
  deactivateTeam(team.value.id).then(() => {
    isActive.value = !isActive.value;
    isNotActive.value = !isNotActive.value;
    loadLazyData()
  }).catch((error) => {
    console.error(error);
  });
}

// const refreshTable = () => {
//   detailUserForm.value.fetchData();
// };

// PROVIDE, EXPOSE

// WATCHERS

// LIFECYCLE METHODS (https://vuejs.org/api/composition-api-lifecycle.html)

useHead({
  title: "Team Detail",
});
</script>







