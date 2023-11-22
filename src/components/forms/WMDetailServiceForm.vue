<template>
  <div
    v-if="service"
    class="wm-detail-form-container flex flex-auto flex-column overflow-auto"
  >
    <div class="service-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">
            {{ $t("service.service") }} {{ service.service_number }}
          </h1>
          <div :class="statusClass(service.state)" class="status-label">
            {{ $t("statuses." + service.state) }}
          </div>
        </div>
        <div>
          <WMAnnouncementsButton
            entity="service"
            :id="route.params.id"
          ></WMAnnouncementsButton>
        </div>
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container top-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="owner"
                    type="info"
                    :highlighted="true"
                    :label="$t('owner')"
                    :value="service.owner.name"
                  />
                  <WMInput
                    name="team"
                    type="info"
                    :highlighted="true"
                    :label="$t('team') + ':'"
                    :value="service.team"
                  />
                  <WMInput
                    name="priority"
                    type="info"
                    :highlighted="true"
                    :label="$t('service.priority')"
                    :value="service.priority"
                    :class="priorityClass(service)"
                    class="numeric"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput
                      name="contact"
                      type="info-link"
                      :highlighted="true"
                      :label="$t('contact.contact') + ':'"
                      :value="service.contact"
                      :to="'/contact/' + service.contact_id"
                    />
                    <WMInput
                      name="customer"
                      type="info-link"
                      :highlighted="true"
                      :label="$t('customer.customer') + ':'"
                      :value="service.customer"
                      :to="'/customer/' + service.customer_id"
                    />
                  </div>
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput
                      name="due-date"
                      type="info"
                      :highlighted="true"
                      :label="$t('service.due-date')"
                      :value="
                        useDateFormat(service.due_date, utilsStore.dateFormat)
                      "
                    />
                    <WMInput
                      name="open-date"
                      type="info"
                      :highlighted="true"
                      :label="$t('service.open-date')"
                      :value="
                        useDateFormat(service.open_date, utilsStore.dateFormat)
                      "
                    />
                    <div class="wm-input flex flex-column">
                      <label class="wm-form-label highlighted"> SLA </label>
                      <WMSLATag :sla="service.sla">
                        {{ service.days_for_closing }} ימים
                      </WMSLATag>
                    </div>
                  </div>
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput
                      name="urgency"
                      type="info"
                      :highlighted="true"
                      :label="$t('service.urgency')"
                      :value="
                        $t('option-set.service_urgent.' + service.urgency)
                      "
                    />
                    <WMInput
                      name="recurring"
                      type="info"
                      :highlighted="true"
                      :label="$t('service.recurring')"
                      :value="$t(service.recurring)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title>
              <div class="flex flex-row justify-content-between">
                {{ $t("address.address") }}
                <WMButton name="location" icon="location" @click="">{{
                  $t("location")
                }}</WMButton>
              </div>
            </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="city"
                    type="info"
                    :highlighted="true"
                    :label="$t('address.city') + ':'"
                    :value="service.location.city"
                  />
                  <WMInput
                    name="street"
                    type="info"
                    :highlighted="true"
                    :label="$t('address.street') + ':'"
                    :value="service.location.street"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="house-number"
                    type="info"
                    :label="$t('address.house-number') + ':'"
                    width="48"
                    :value="service.location.house_number"
                  ></WMInput>
                  <WMInput
                    name="apartment"
                    type="info"
                    :label="$t('address.apartment') + ':'"
                    width="48"
                    :value="service.location.apartment"
                  />
                  <WMInput
                    name="entrance"
                    type="info"
                    :highlighted="true"
                    :label="$t('address.entrance') + ':'"
                    :value="service.location.entrance"
                  />
                  <WMInput
                    name="zip"
                    type="info"
                    :label="$t('address.zip') + ':'"
                    width="80"
                    :value="service.location.zip"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title>
              {{ $t("site.details") }}
            </template>
            <template #content>
              <div class="flex flex-auto flex-row gap-6">
                <div class="wm-form-column gap-5">
                  <WMInput
                    name="site-name"
                    type="info"
                    :highlighted="true"
                    :label="$t('site.name') + ':'"
                    :value="service.site.name"
                  />
                  <WMInput
                    name="site-contact"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('site.contact') + ':'"
                    :value="service.site.contact"
                    :to="'/contact/' + service.site.contact_id"
                  />
                  <WMInput
                    name="site-phone"
                    type="info"
                    :highlighted="true"
                    :label="$t('site.phone') + ':'"
                    :value="service.site.phone"
                  />
                </div>
                <div class="wm-form-column gap-5">
                  <WMInput
                    name="site-type"
                    type="info"
                    :label="$t('site.type') + ':'"
                    :value="service.site.type"
                  >
                  </WMInput>
                  <WMInput
                    name="site-contact-role"
                    type="info"
                    :label="$t('site.contact_role') + ':'"
                    :value="service.site.contact_role"
                  />
                  <WMInput
                    name="site-email"
                    type="info"
                    :highlighted="true"
                    :label="$t('site.email') + ':'"
                    :value="service.site.email"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title> {{ $t("service.description") }} </template>
            <template #content>
              <div class="contact-notes flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    type="text-area"
                    id="description"
                    name="description"
                    :value="service.description"
                    disabled
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title>
              {{ $t("service.classification") }}
            </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="area"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-1') + ':'"
                    :value="service.area?.value"
                  />
                  <WMInput
                    name="type"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-2') + ':'"
                    :value="service.type?.value"
                  />
                  <WMInput
                    name="request1"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-3') + ':'"
                    :value="service.request1?.value"
                  />
                </div>
                <div class="wm-form-row gap-5" v-if="service.is_active">
                  <WMInputSearch
                    name="request2"
                    :highlighted="true"
                    :label="$t('classification-4') + ':'"
                    :value="service.request2?.value"
                    :options="requests2"
                    @change="
                      updateDropdown(
                        'service_request_3',
                        $event.value.id,
                        'requests3'
                      )
                    "
                  />
                  <WMInputSearch
                    name="request3"
                    :highlighted="true"
                    :label="$t('classification-5') + ':'"
                    :value="service.request3?.value"
                    :options="requests3"
                  />
                </div>
                <div class="wm-form-row gap-5" v-if="!service.is_active">
                  <WMInput
                    name="request2"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-4') + ':'"
                    :value="service.request2?.value"
                  />
                  <WMInput
                    name="request3"
                    type="info"
                    :highlighted="true"
                    :label="$t('classification-5') + ':'"
                    :value="service.request3?.value"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div class="mt-5">
        <WMStepper
          :steps="stages"
          :currentStep="currentStage"
          aria-label="Form Steps"
        />
      </div>

      <div>
        <WMTasksTable :tasks="tasks" :columns="taskColumns" multiselect>
        </WMTasksTable>
      </div>

      <div class="flex flex-row gap-5 flex-wrap mt-5">
        <div class="flex-1 card-container">
          <Card>
            <template #title> Files </template>
            <template #content>
              <div class="files-dataview">
                <WMFilesDataView></WMFilesDataView>
              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container">
          <Card>
            <template #title> Journal </template>
            <template #content>
              <div class="journal-dataview">
                <WMJournalDataView></WMJournalDataView>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div class="flex-1 tabs-container mt-5">
        <TabView>
          <TabPanel header="נתונים נוספים">
            <div class="flex flex-column gap-5 m-5">
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput
                  name="created_by"
                  type="info"
                  :highlighted="true"
                  :label="$t('created_by') + ':'"
                  value="Israel Israeli"
                  inline
                />
                <WMInput
                  name="modified_by"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_by') + ':'"
                  value="שרוליק כהן"
                  inline
                />
              </div>
              <div class="flex flex-auto gap-5 flex-row">
                <WMInput
                  name="created_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('created_at') + ':'"
                  value="12:38  11/11/22"
                  inline
                />
                <WMInput
                  name="modified_at"
                  type="info"
                  :highlighted="true"
                  :label="$t('modified_at') + ':'"
                  value="12:38  11/11/22"
                  inline
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel header="טאב 1">
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
              velit, sed quia non numquam eius modi.
            </p>
          </TabPanel>
          <TabPanel header="טאב 2">
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga. Et harum quidem rerum
              facilis est et expedita distinctio. Nam libero tempore, cum soluta
              nobis est eligendi optio cumque nihil impedit quo minus.
            </p>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, watch, defineExpose } from "vue";

import { useForm } from "vee-validate";
import { useUtilsStore } from "@/stores/utils";
import { useFormUtilsStore } from "@/stores/formUtils";
import { useListUtilsStore } from "@/stores/listUtils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useRoute } from "vue-router";
import { useDateFormat } from "@vueuse/core";
import { useToast } from "@/stores/toast";

const { getTasksFromApi } = useTasks();
const { updateService, parseUpdateService, getServiceFromApi, cancelService } =
  useServices();

const toast = useToast();
const stages = ref([]);
const currentStage = ref();

const tasks = ref();

const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const utilsStore = useUtilsStore();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();
const listUtilsStore = useListUtilsStore();
const service = ref();
const route = useRoute();

const contactColumns = ref(listUtilsStore.getContactColumns);
const serviceColumns = ref(listUtilsStore.getServiceColumns);
const taskColumns = ref(listUtilsStore.getTaskColumns);

const requests2 = ref([]);
const requests3 = ref([]);
const optionRefs = {
  requests2: requests2,
  requests3: requests3,
};

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  const data = await getServiceFromApi(route.params.id);
  service.value = data;
  console.log(data.stages);
  stages.value = data.stages.map((stage) => ({
    label: stage.name,
    date: useDateFormat(stage.sla.due_date, "DD/MM/YY"),
  }));
  updateDropdown("service_request_2", data.request1?.id, "requests2");

  currentStage.value = data.current_stage?.order - 1;
  utilsStore.selectedElements["service"] = [service.value];

  const tasksData = await getTasksFromApi({
    entity_type: "service",
    entity_id: route.params.id,
  });
  tasks.value = tasksData.tasks;
};

const updateDropdown = (optionSet, selectedValue, dropdownOptions) => {
  console.log(selectedValue);
  optionSetsStore
    .getOptionSetValuesFromApiRaw(optionSet, selectedValue)
    .then((data) => {
      optionRefs[dropdownOptions].value = data;
    });
};

const { errors, handleSubmit, setFieldError, meta } = useForm({
  validationSchema: formUtilsStore.getServiceDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateService(route.params.id, parseUpdateService(values))
    .then((data) => {
      toast.successAction("service", "updated");
      resetForm({ values: values });
    })
    .catch((error) => {
      console.log(error);
      toast.error("service", "not-updated");
    });
});

const priorityClass = (data) => {
  return listUtilsStore.getPriorityConditionalStyle(data);
};

// formUtilsStore.submit = onSubmit;
formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "service";
utilsStore.entity = "service";

const handleCancelService = (id) => {
  cancelService(id, formUtilsStore.cancelServiceReasons)
    .then((data) => {
      toast.successAction("service", "canceled");
    })
    .catch((error) => {
      console.log(error);
      toast.error("service", "not-canceled");
    });
};

formUtilsStore.cancelService = handleCancelService;

const statusClass = (data) => {
  return listUtilsStore.getStatusConditionalStyle(data);
};

defineExpose({
  onSave,
});

watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  }
);
</script>

<style scoped lang="scss"></style>
