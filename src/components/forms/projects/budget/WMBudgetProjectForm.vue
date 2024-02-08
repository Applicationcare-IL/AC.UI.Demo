<template>
  <div
    class="wm-detail-form-container flex flex-column overflow-auto gap-5"
    v-if="budget"
  >
    <div class="flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">{{ $t("budget.budget") }}: BUDGET</h1>

          <!-- <div
            :class="statusClass(project.state.value)"
            class="status-label white-space-nowrap"
          >
            <WMOptionSetValue :option-set="project.state" />
          </div> -->
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
              <div class="flex flex-row gap-5 align-items-center">
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="blue-100"
                  :label="$t('budget.planned-non-contract') + ':'"
                />
              </div>
              <div class="flex flex-row gap-5">
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="blue-100"
                  :label="$t('budget.planned-contract') + ':'"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="blue-100"
                  :label="$t('budget.management-fee') + ':'"
                />
                <PlusIcon />
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="blue-100"
                  :label="$t('budget.unexpected') + ':'"
                />
                <EqualIcon />
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="blue-200"
                  :label="$t('budget.total') + ':'"
                />
              </div>
              <Divider></Divider>
              <div class="flex flex-row gap-5">
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="green-200"
                  label="Not editable"
                />
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="blue-200"
                  :editable="true"
                  label="Editable"
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
              <div class="flex flex-row gap-5">
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="green-200"
                  label="Not editable"
                />
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="blue-200"
                  :editable="true"
                  label="Editable"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div class="flex-1">
        <Card>
          <template #title> {{ $t("budget.budget-details") }} </template>
          <template #content>
            <div class="flex flex-column gap-5">
              <div class="flex flex-row gap-5">
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="green-200"
                  label="Not editable"
                />
                <WMHighlightedBlock
                  v-model="modelValue"
                  background-color="blue-200"
                  :editable="true"
                  label="Editable"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Accordion>
      <AccordionTab :header="$t('budget.budget-items')">
        <pre>{{ budgetItems }}</pre>
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
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const modelValue = ref(1000);

const { getProjectBudget, getBudgetItems, getProjectPayments } = useProjects();

const budget = ref(null);
const budgetItems = ref();
const payments = ref();

const projectId = computed(() => {
  return route.params.id;
});

getProjectBudget(route.params.id).then((response) => {
  budget.value = response;
});

getBudgetItems(route.params.id).then((response) => {
  budgetItems.value = response;
});

getProjectPayments(route.params.id).then((response) => {
  payments.value = response;
});
</script>

<style scoped lang="scss"></style>
