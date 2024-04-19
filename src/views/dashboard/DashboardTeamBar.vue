<template>
  <div class="wm-subheader shadow-1 flex-none">
    <div class="flex flex-column gap-2">
      <div class="flex flex-row gap-3 align-items-center">
        <!-- <pre>{{ selectedTeams }}</pre> -->
        <label class="font-bold">{{ $t("dashboard.teams") }}:</label>
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
        <WMTempButton :text="$t('buttons.select-all')" type="type-4" size="small" />
        <!-- <WMButton class="m-1 col-6 small" name="basic-secondary">
          {{ $t("buttons.clear-all") }}
        </WMButton> -->
      </div>
      <div>
        <Chip v-for="(item, index) in selectedTeams" :key="index" :label="item.name">
          <span>{{ item.name }}</span>
          <i class="pi pi-times cursor-pointer" @click="onRemove(item)"></i>
        </Chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { OwnersService } from "@/service/OwnersService";

const teams = ref();
const selectedTeams = ref([]);

const onSelectedTeams = (value) => {
  selectedTeams.value = value;
};

onMounted(async () => {
  let teamsResponse = await OwnersService.getOwnersFromApi({}, "team");
  teams.value = teamsResponse.data;
});
</script>

<style scoped lang="scss"></style>
