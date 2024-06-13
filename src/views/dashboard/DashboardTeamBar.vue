<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-2">
      <div class="flex flex-row gap-3 align-items-center">
        <h5 class="font-bold mb-0">{{ $t("dashboard.teams") }}:</h5>
        <WMInputSearch
          name="teams"
          :multiple="true"
          width="248"
          :options="teams"
          :highlighted="true"
          :model-value="selectedTeams"
          type="no-tags"
          @update:model-value="onSelectedTeams"
        />
        <WMButton
          :text="$t('buttons.select-all')"
          type="type-4"
          size="small"
          @click="handleSelectAllTeams"
        />
        <WMButton
          :text="$t('buttons.clear')"
          type="clear mx-0 px-0"
          size="small"
          @click="clearSelectedTeams"
        />
      </div>
      <div>
        <Chip v-for="(item, index) in selectedTeams" :key="index" :label="item.name">
          <span>{{ item.name }}</span>
          <i class="pi pi-times cursor-pointer" @click="handleRemoveTeam(item)"></i>
        </Chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import { OwnersService } from "@/service/OwnersService";

const emit = defineEmits(["update:selectedTeams"]);

const teams = ref();
const selectedTeams = ref([]);

const onSelectedTeams = (value) => {
  selectedTeams.value = value;
};

const handleSelectAllTeams = () => {
  selectedTeams.value = teams.value;
};

const handleRemoveTeam = (team) => {
  selectedTeams.value = selectedTeams.value.filter((selectedTeam) => selectedTeam.id !== team.id);
};

const clearSelectedTeams = () => {
  selectedTeams.value = [];
};

onMounted(async () => {
  let teamsResponse = await OwnersService.getOwnersFromApi({}, "team");
  teams.value = teamsResponse.data;
});

watch(selectedTeams, (value) => {
  emit("update:selectedTeams", value);
});
</script>

<style scoped lang="scss"></style>
