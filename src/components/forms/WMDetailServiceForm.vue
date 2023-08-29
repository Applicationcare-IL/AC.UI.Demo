<template>
  <div v-if="service" class="wm-detail-form-container flex flex-auto flex-column overflow-auto">
    <div class="service-data flex flex-auto flex-column gap-5 mb-5">
      <h1 class="h1 mb-0">{{ $t('service.service') }} {{ service.service_number }}</h1>
      <div class=" flex flex-row gap-5 flex-wrap">
        <div class="card-container top-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t('general-details') }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput name="contact" type="info-link" :highlighted="true" :label="$t('contact.contact') + ':'"
                           :value="service.contact" :to="'/contact/' + service.contact_id" />
                  <WMInput name="customer" type="info-link" :highlighted="true" :label="$t('customer.customer') + ':'"
                           :value="service.customer" :to="'/customer/' + service.customer_id" />
                  <WMInput name="owner" type="info" :highlighted="true" :label="$t('owner')" :value="service.owner" />
                  <WMInput name="team" type="info" :highlighted="true" :label="$t('team') + ':'" :value="service.team" />
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput name="due-date" type="info" :highlighted="true" :label="$t('service.due-date')"
                             :value="service.due_date" />
                    <WMInput name="sla" type="info" :highlighted="true" :label="$t('service.sla')" :value="service.SLA"
                             :class="slaClass(service)" class="sla" />
                    <WMInput name="priority" type="info" :highlighted="true" :label="$t('service.priority')"
                             :value="service.priority" :class="priorityClass(service)" class="numeric" />
                  </div>
                </div>
                <div class="wm-form-row gap-5">
                  <div class="wm-form-row gap-4">
                    <WMInput name="open-date" type="info" :highlighted="true" :label="$t('service.open-date')"
                             :value="service.open_date" />
                    <WMInput name="urgency" type="info" :highlighted="true" :label="$t('service.urgency')"
                             :value="service.urgency" />
                    <WMInput name="recurring" type="info" :highlighted="true" :label="$t('service.recurring')"
                             :value="service.recurring" />
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
                {{ $t('address.address') }}
                <WMButton name="location" icon="location" @click="">{{ $t('location') }}</WMButton>
              </div>
            </template>
            <template #content>

              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput name="city" type="info" :highlighted="true" :label="$t('address.city') + ':'"
                           :value="service.location.city" />
                  <WMInput name="street" type="info" :highlighted="true" :label="$t('address.street') + ':'"
                           :value="service.location.street" />

                </div>
                <div class="wm-form-row gap-5">
                  <WMInput name="house-number" type="info" :label="$t('address.house-number') + ':'" width="48"
                           :value="service.location.house_number"></WMInput>
                  <WMInput name="apartment" type="info" :label="$t('address.apartment') + ':'" width="48"
                           :value="service.location.apartment" />
                  <WMInput name="entrance" type="info" :highlighted="true" :label="$t('address.entrance') + ':'"
                           :value="service.location.entrance" />
                  <WMInput name="zip" type="info" :label="$t('address.zip') + ':'" width="80"
                           :value="service.location.zip" />
                </div>

              </div>
            </template>
          </Card>
        </div>
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title>
              {{ $t('site.details') }}
            </template>
            <template #content>

              <div class="flex flex-auto flex-row gap-6">
                <div class="wm-form-column gap-5">
                  <WMInput name="site-name" type="info" :highlighted="true" :label="$t('site.name') + ':'"
                           :value="service.site.name" />
                  <WMInput name="site-contact" type="info-link" :highlighted="true" :label="$t('site.contact') + ':'"
                           :value="service.site.contact" :to="'/contact/' + service.site.contact_id" />
                  <WMInput name="site-phone" type="info" :highlighted="true" :label="$t('site.phone') + ':'"
                           :value="service.site.phone" />

                </div>
                <div class="wm-form-column gap-5">
                  <WMInput name="site-type" type="info" :label="$t('site.type') + ':'" :value="service.site.type">
                  </WMInput>
                  <WMInput name="site-contact-role" type="info" :label="$t('site.contact_role') + ':'"
                           :value="service.site.contact_role" />
                  <WMInput name="site-email" type="info" :highlighted="true" :label="$t('site.email') + ':'"
                           :value="service.site.email" />
                </div>

              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class=" flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title> {{ $t('service.description') }} </template>
            <template #content>
              <div class="contact-notes flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <Textarea v-model="value" autoResize rows="5" />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container middle-info-card flex-1">
          <Card>
            <template #title>
              {{ $t('service.classification') }}
            </template>
            <template #content>

              <div class="flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <WMInput name="service-area" type="info" :highlighted="true" :label="$t('classification-1') + ':'"
                           :value="service.classification_1" />
                  <WMInput name="service-type" type="info" :highlighted="true" :label="$t('classification-2') + ':'"
                           :value="service.classification_2" />
                  <WMInput name="service-request1" type="info" :highlighted="true" :label="$t('classification-3') + ':'"
                           :value="service.classification_3" />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInputSearch name="service-request2" type="info" :highlighted="true"
                                 :label="$t('classification-4') + ':'" :value="service.classification_4"
                                 :options="classification4Options" />
                  <WMInputSearch name="service-request3" type="info" :highlighted="true"
                                 :label="$t('classification-5') + ':'" :value="service.classification_5"
                                 :options="classification5Options" />
                </div>

              </div>
            </template>
          </Card>
        </div>

      </div>

      <div class="mt-5">
        <Stepper :steps="items" :currentStep="2" aria-label="Form Steps" />
      </div>

      <div>
        <WMTasksTable :tasks="tasks" :columns="taskColumns" :rows="5" multiselect>
        </WMTasksTable>
      </div>

      <div class=" flex flex-row gap-5 flex-wrap mt-5">
        <div class="flex-1 card-container">
          <Card>
            <template #title>
             Files
            </template>
            <template #content>
              <div class="files-dataview">
                <WMFilesDataView></WMFilesDataView>
              </div>

            </template>
          </Card>
        </div>
        <div class="flex-1 card-container">
          <Card>
            <template #title>
             Journal
            </template>
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
                  <WMInput name="created_by" type="info" :highlighted="true" :label="$t('created_by') + ':'"
                           value="Israel Israeli" inline />
                  <WMInput name="modified_by" type="info" :highlighted="true" :label="$t('modified_by') + ':'"
                           value="שרוליק כהן" inline />
                </div>
                <div class="flex flex-auto gap-5 flex-row">
                  <WMInput name="created_at" type="info" :highlighted="true" :label="$t('created_at') + ':'"
                           value="12:38  11/11/22" inline />
                  <WMInput name="modified_at" type="info" :highlighted="true" :label="$t('modified_at') + ':'"
                           value="12:38  11/11/22" inline />
                </div>
              </div>
            </TabPanel>
            <TabPanel header="טאב 1">
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem
                aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo.
                Nemo enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
                qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
              </p>
            </TabPanel>
            <TabPanel header="טאב 2">
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
                atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
                sunt in culpa qui
                officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
                expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                minus.
              </p>
            </TabPanel>
          </TabView>
        </div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import WMInputSearch from '@/components/forms/WMInputSearch.vue';
import WMInput from '@/components/forms/WMInput.vue';
import { useForm } from 'vee-validate';
import { useFormUtilsStore } from '@/stores/formUtils';
import { useListUtilsStore } from '@/stores/listUtils';
import { useOptionSetsStore } from '@/stores/optionSets';
import { useRoute } from 'vue-router'
import { ServicesService } from '@/service/ServicesService';
import { TasksService } from '@/service/TasksService';
import WMTasksTable from '@/components/tables/WMTasksTable.vue';
import Stepper from '@/components/WMStepper.vue';
import WMFilesDataView from '@/components/WMFilesDataView.vue';
import WMJournalDataView from '@/components/WMJournalDataView.vue';

const items = ref([
  {
    label: 'שם של שלב',
    date: '11/11/22',
  },
  {
    label: 'שם של שלב',
    date: '11/11/22',
  },
  {
    label: 'שם של שלב',
    date: '11/11/22',
  },
  {
    label: 'שם של שלב',
    date: '11/11/22',
  },
  {
    label: 'שם של שלב',
    date: '11/11/22',
  },
]);

const tasks = ref();

const formUtilsStore = useFormUtilsStore();
const OptionSetsStore = useOptionSetsStore();
const listUtilsStore = useListUtilsStore();
const service = ref();
const route = useRoute();

const classification4Options = OptionSetsStore.getOptionSetValues("classification4");
const classification5Options = OptionSetsStore.getOptionSetValues("classification5");

const contactColumns = ref(listUtilsStore.getContactColumns);
const serviceColumns = ref(listUtilsStore.getServiceColumns);
const taskColumns = ref(listUtilsStore.getTaskColumns);

onMounted(() => {
  setTimeout(function () {
    ServicesService.getService(route.params.id).then((data) => (service.value = data));
  }, 1000);
  setTimeout(function () {
    TasksService.getTasksMini().then((data) => (tasks.value = data));
  }, 2000);
});

const { errors, handleSubmit, setFieldError } = useForm({
  validationSchema: formUtilsStore.getContactDetailFormValidationSchema,
});

const onSubmit = handleSubmit((values) => {
  setFieldError('mobile-phone', 'Customer already exists');
  console.log(values);
});

const slaClass = (data) => {
  return listUtilsStore.getSlaConditionalStyle(data);
}

const priorityClass = (data) => {
  return listUtilsStore.getPriorityConditionalStyle(data);
};

formUtilsStore.submit = onSubmit;
formUtilsStore.formErrors = errors;

</script>

<style scoped lang="scss"></style>
