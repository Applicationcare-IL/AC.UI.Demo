<template>
  <div
    v-if="task"
    class="wm-detail-form-container flex flex-auto flex-column overflow-auto"
  >
    <div class="task-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row align-items-center gap-4">
        <h1 class="h1 mb-0">
          <h1 class="h1 mb-0">{{ $t("task.task") }} {{ task.task_number }}</h1>
        </h1>
        <div :class="statusClass(task.state)" class="status-label">
          {{ $t("statuses." + task.state) }}
        </div>
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container top-info-card flex-1">
          <Card>
            <template #title> {{ $t("general-details") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="owner"
                    type="info"
                    :highlighted="true"
                    :label="$t('owner') + ':'"
                    :value="task.owner"
                  />
                  <WMInput
                    name="team"
                    type="info"
                    :highlighted="true"
                    :label="$t('team') + ':'"
                    :value="task.team"
                  />
                  <WMInput
                    name="status"
                    :highlighted="true"
                    type="input-select"
                    :label="$t('status') + ':'"
                    :options="statuses"
                    :value="
                      statuses.find((status) => status.value === task.status)
                    "
                  />
                </div>

                <div class="wm-form-row gap-5">
                  <WMInput
                    name="due-date"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.due_date')"
                    :value="task.due_date"
                  />
                  <WMInput
                    name="due-date"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.due_date')"
                    :value="task.due_date"
                  />
                  <WMInput
                    name="sla"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.sla')"
                    class="sla"
                  >
                    <WMSLATag
                      v-if="task.sla"
                      :sla="task.sla"
                      :daysForClosing="task.days_for_closing"
                      :state="task.state"
                    >
                    </WMSLATag>
                  </WMInput>
                </div>

                <div class="wm-form-row gap-5">
                  <WMInput
                    name="family"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.family')"
                    :value="task.task_family"
                  />
                  <WMInput
                    name="type"
                    type="info"
                    :highlighted="true"
                    :label="$t('task.type')"
                    :value="task.task_type"
                  />
                </div>

                <div class="wm-form-row gap-5">
                  <WMInput
                    name="contact"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('contact.contact') + ':'"
                    :value="task.contact"
                    :to="'/contact/' + task.contact_id"
                  />
                  <WMInput
                    name="customer"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('customer.customer') + ':'"
                    :value="task.customer"
                    :to="'/customer/' + task.customer_id"
                  />
                </div>

                <div class="wm-form-row gap-5">
                  <WMInput
                    name="service_number"
                    type="info-link"
                    :highlighted="true"
                    :label="$t('task.service_number')"
                    :value="task.service_number"
                    :to="'/service/' + task.service_number"
                  />

                  <WMInput
                    name="recurring-task"
                    type="info"
                    :highlighted="true"
                    label="Recurring task"
                    value="No"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <!-- RELATED ENTITY -->
        <WMDetailTaskRelatedService
          :service="service"
          v-if="task.related_entity?.type == 'service'"
        />
        <WMDetailTaskRelatedProject
          :project="service"
          v-if="task.related_entity?.type == 'project'"
        />
        <div
          v-if="task.related_entity == null"
          class="card-container top-info-card flex-1"
        >
          <Card class="flex align-items-center justify-content-center">
            <template #content>
              <h3>Task isn’t related to an entity</h3>
            </template>
          </Card>
        </div>
      </div>

      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title> {{ $t("task.description") }} </template>
            <template #content>
              <div class="task-description flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <Textarea
                    v-model="task.description"
                    autoResize
                    rows="5"
                    disabled
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title> {{ $t("task.notes") }} </template>
            <template #content>
              <div class="task-notes flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput
                    :value="task.notes"
                    type="text-area"
                    id="notes"
                    name="notes"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div
        class="flex flex-row gap-5 flex-wrap mt-5"
        v-if="task?.related_entity?.type == 'service' && service"
      >
        <WMDetailFormLocation :location="service.location" />

        <WMDetailFormSite :site="service.site" />
      </div>

      <div class="flex flex-row gap-5 flex-wrap mt-5">
        <Accordion class="p-accordion--blue">
          <AccordionTab header="מסמכים">
            <!-- <WMFilesDataView></WMFilesDataView> -->
          </AccordionTab>
        </Accordion>
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
import { useFormUtilsStore } from "@/stores/formUtils";

import { useUtilsStore } from "@/stores/utils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useRoute } from "vue-router";

const toast = useToast();
const { updateTask, parseUpdateTask } = useTasks();

const tasks = ref([]);

const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const utilsStore = useUtilsStore();
const task = ref();
const service = ref();
const route = useRoute();

const statuses = optionSetsStore.optionSets["task_status"];

const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const { getTaskFromApi } = useTasks();
const { getServiceFromApi } = useServices();

onMounted(() => {
  getTaskFromApi(route.params.id).then((data) => {
    task.value = data;
    getServiceFromApi(task.value.related_entity.id).then((data) => {
      service.value = data;
    });
    utilsStore.selectedElements["task"] = [task.value];
  });
});

const { handleSubmit, meta, resetForm } = useForm({
  // validationSchema: formUtilsStore.getContactDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  updateTask(route.params.id, parseUpdateTask(values))
    .then(() => {
      toast.successAction("task", "updated");
      resetForm({ values: values });
    })
    .catch((error) => {
      console.log(error);
      toast.error("service", "not-updated");
    });
});

const { getStatusConditionalStyle } = useListUtils();

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};

watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  }
);

formUtilsStore.formEntity = "task";
utilsStore.entity = "task";

defineExpose({
  onSave,
});
</script>

<style scoped lang="scss"></style>