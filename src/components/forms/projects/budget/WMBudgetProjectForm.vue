<template>
  <div
    v-if="budget"
    class="wm-detail-form-container flex flex-column overflow-auto gap-5"
  >
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">{{ $t("budget.budget") }}: BUDGET</h1>
        </div>
      </div>
    </div>
    <pre>
  {{ budget }}
  </pre
    >
    <div class="flex flex-row gap-5 flex-wrap">
      <div class="flex-1 card-container top-info-card">
        <Card>
          <template #title> {{ $t("general-details") }} </template>
          <template #content>
            <div class="flex flex-auto flex-column gap-5">
              <div class="wm-form-row align-items-start gap-5">
                <WMInput
                  name="id"
                  type="info"
                  :highlighted="true"
                  :label="$t('id') + ':'"
                  :value="budget.id"
                />
                <WMInput
                  name="owner"
                  type="info"
                  :highlighted="true"
                  :label="$t('owner') + ':'"
                  :value="null"
                />
                <WMInput
                  name="project"
                  type="info-link"
                  :highlighted="true"
                  :label="$t('project.project') + ':'"
                  :value="projectId"
                  :to="'/project/' + projectId"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
    <div class="flex flex-row gap-5 flex-wrap">
      <div class="flex-1">
        <Card>
          <template #title> {{ $t("budget.budget-details") }} </template>
          <template #content>
            <div class="flex flex-column gap-5">
              <div
                class="flex flex-row gap-5 align-items-center justify-content-between"
              >
                <WMHighlightedBlock
                  v-model="budget.planned_non_contract"
                  background-color="blue-100"
                  :label="$t('budget.planned-non-contract') + ':'"
                />
              </div>
              <div class="flex flex-row gap-5">
                <WMHighlightedBlock
                  v-model="budget.planned_contract"
                  background-color="blue-100"
                  :label="$t('budget.planned-contract') + ':'"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budget.management_fee"
                  background-color="blue-100"
                  :label="$t('budget.management-fee') + ':'"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budget.unexpected"
                  background-color="blue-100"
                  :label="$t('budget.unexpected') + ':'"
                />
                <EqualIcon />
                <WMHighlightedBlock
                  v-model="budget.total_planned"
                  background-color="blue-200"
                  :label="$t('budget.total') + ':'"
                />
              </div>
              <Divider></Divider>
              <div class="flex flex-row justify-content-between gap-3">
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="white"
                  :label="$t('budget.approved-council') + ':'"
                />

                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="white"
                  :label="$t('budget.approved-ministry') + ':'"
                />

                <WMHighlightedBlock
                  v-model="budget.management_fee"
                  background-color="white"
                  :label="$t('budget.management-fee') + ':'"
                />

                <WMHighlightedBlock
                  v-model="budget.unexpected"
                  background-color="white"
                  :label="$t('budget.unexpected') + ':'"
                />

                <WMHighlightedBalanceBlock
                  :quantity="budget.total_approved"
                  :label="$t('budget.total') + ':'"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <div class="flex flex-row gap-5 flex-wrap">
      <div class="flex-1">
        <Card>
          <template #title>
            <div class="flex align-items-center gap-3">
              {{ $t("budget.tbr-details") }}
              <WMInput
                v-model="budget.tbr"
                name="first-name"
                type="input-text"
              />
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-2">
              <div
                class="flex flex-row align-items-center justify-content-between gap-2"
              >
                <WMHighlightedBlock
                  v-model="budget.tbr_accepted"
                  background-color="gray-100"
                  :label="$t('budget.tbr-accepted') + ':'"
                  size="small"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="budget.tbr_expected"
                  background-color="gray-100"
                  :label="$t('budget.tbr-expected') + ':'"
                  size="small"
                />
                <EqualIcon />
                <WMHighlightedBlock
                  v-model="budget.tbr_funding"
                  background-color="gray-300"
                  :label="$t('budget.tbr-funding') + ':'"
                  size="small"
                />
              </div>
              <Divider />
              <div
                class="flex flex-row align-items-center gap-4 justify-content-between"
              >
                <WMHighlightedBlock
                  v-model="budget.tbr_reported"
                  background-color="white"
                  :label="$t('budget.tbr-reported') + ':'"
                  size="small"
                />

                <WMHighlightedBlock
                  v-model="budget.tbr_municipality_expenses"
                  background-color="white"
                  :label="$t('budget.tbr-municipality-expenses') + ':'"
                  size="small"
                />

                <WMHighlightedBalanceBlock
                  :quantity="budget.tbr_balance"
                  :label="$t('budget.tbr-balance') + ':'"
                  size="small"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div class="flex-1">
        <Card class="h-full">
          <template #title>
            {{ $t("budget.non-tbr-funding-details") }}
          </template>
          <template #content>
            <div class="flex flex-column gap-2">
              <div
                class="flex flex-row align-items-center justify-content-between gap-2"
              >
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="gray-100"
                  :label="$t('budget.non-tbr-funds-accepted') + ':'"
                  size="small"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="gray-100"
                  :label="$t('budget.non-tbr-expected') + ':'"
                  size="small"
                />
                <EqualIcon />
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="gray-300"
                  :label="$t('budget.non-tbr-funding') + ':'"
                  size="small"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Accordion>
      <AccordionTab :header="$t('budget.budget-items')">
        <WMBudgetItemsTable :project-id="projectId" />
      </AccordionTab>
    </Accordion>

    <!-- <Accordion>
      <AccordionTab :header="$t('budget.funding')"> </AccordionTab>
    </Accordion> -->

    <Accordion>
      <AccordionTab :header="$t('budget.payments')">
        <pre>{{ payments }}</pre>
      </AccordionTab>
    </Accordion>

    <!-- <div class="flex-1 tabs-container mt-5">
      <TabView>
        <TabPanel :header="$t('additional-information')">
          <div class="flex flex-column gap-5 m-2">
            <h4 class="h4 mb-0">
              {{ $t("logs") }}
            </h4>
            <div class="flex flex-auto gap-5 flex-row">
              <WMInput
                name="created_by"
                type="info"
                :highlighted="true"
                :label="$t('created_by') + ':'"
                :value="project.last_activity.creator.name"
                width="150"
              />
              <WMInput
                name="modified_by"
                type="info"
                :highlighted="true"
                :label="$t('modified_by') + ':'"
                :value="project.last_activity.updater.name"
                width="150"
              />
            </div>
            <div class="flex flex-auto gap-5 flex-row">
              <WMInput
                name="created_at"
                type="info"
                :highlighted="true"
                :label="$t('created_at') + ':'"
                :value="project.last_activity.creator.at"
                width="150"
              />
              <WMInput
                name="modified_at"
                type="info"
                :highlighted="true"
                :label="$t('modified_at') + ':'"
                :value="project.last_activity.updater.at"
                width="150"
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div> -->
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

useHead({
  title: "Project Budget",
});

const route = useRoute();

const modelValue = ref(1000);

const { getProjectBudget, getProjectPayments } = useProjects();

const budget = ref(null);
const payments = ref();

const projectId = computed(() => {
  return route.params.id;
});

getProjectBudget(route.params.id).then((response) => {
  budget.value = response;
});

getProjectPayments(route.params.id).then((response) => {
  payments.value = response;
});
</script>

<style scoped lang="scss"></style>
