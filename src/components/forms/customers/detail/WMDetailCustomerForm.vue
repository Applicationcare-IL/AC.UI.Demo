<template>
  <div
    v-if="loaded"
    class="wm-detail-form-container flex flex-auto flex-column overflow-auto"
  >
    <div class="customer-data flex flex-auto flex-column gap-5 mb-5">
      <div class="flex flex-row justify-content-between">
        <div class="flex flex-row align-items-center gap-4">
          <h1 class="h1 mb-0">
            {{ $t("customer.customer") }}: {{ customer.name }}
          </h1>
          <div :class="statusClass(customer.state)" class="status-label">
            {{ $t("statuses." + customer.state) }}
          </div>
        </div>
        <div>
          <WMAnnouncementsButton
            entity="customer"
            :id="route.params.id"
          ></WMAnnouncementsButton>
        </div>
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="flex-1 card-container top-info-card">
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
                    :value="customer.owner.name"
                  />
                  <WMInput
                    name="system_id"
                    type="info"
                    :highlighted="true"
                    :label="$t('customer.system-id') + ':'"
                    :value="customer.id"
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="name"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    :value="customer.name"
                    width="150"
                    required
                  />
                  <WMInput
                    name="number"
                    type="input-text"
                    :highlighted="true"
                    :label="$t('id') + ':'"
                    @input.stop="onCustomerNumberChanged"
                    :value="customer.number"
                    width="150"
                    required
                  />
                </div>
                <div class="wm-form-row gap-5">
                  <WMInput
                    name="type"
                    :highlighted="true"
                    type="input-select"
                    :label="$t('type') + ':'"
                    :options="types"
                    width="80"
                    :value="selectedType"
                  />
                  <WMInput
                    name="rating"
                    :highlighted="true"
                    type="input-select"
                    :label="$t('rating') + ':'"
                    :options="ratings"
                    :value="selectedRating"
                    width="80"
                  />
                  <WMInput
                    name="is_provider"
                    type="input-select-button"
                    :highlighted="true"
                    :label="$t('customer.is-provider') + ':'"
                    :options="yesNoOptions"
                    :value="isProvider"
                    width="80"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <WMDetailFormLocation :location="customer.location" editable />
        <div class="flex-1 card-container top-info-card">
          <Card>
            <template #title> {{ $t("customer.areas") }} </template>
            <template #content>
              <div class="flex flex-auto flex-column gap-5">
                <WMInputSearch
                  name="service_area"
                  :placeholder="$t('select', ['customer.area'])"
                  :required="true"
                  :multiple="true"
                  width="248"
                  :options="service_areas"
                  :highlighted="true"
                  :modelValue="selectedServiceAreas"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="flex flex-row gap-5 flex-wrap">
        <div class="card-container middle-info-card" style="flex: 2">
          <Card>
            <template #title> {{ $t("customer.notes") }} </template>
            <template #content>
              <div class="contact-notes flex flex-auto flex-column gap-5">
                <div class="wm-form-row gap-5">
                  <Textarea name="notes" v-model="value" autoResize rows="5" />
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container flex-1 middle-info-card">
          <Card>
            <template #title>
              {{ $t("service.open") }} : {{ customer.open_services }}
            </template>

            <template #content>
              <div class="flex flex-column gap-3">
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-teal-200 text-teal-900"
                >
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">{{
                    customer.open_services - customer.breached_services
                  }}</span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-gray-100 text-gray-900"
                >
                  <span class="font-size-20 font-weight-light">Breach</span>
                  <span class="font-size-24 font-weight-bold">{{
                    customer.breached_services
                  }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <div class="card-container flex-1 middle-info-card">
          <Card>
            <template #title>
              {{ $t("task.open") }} : {{ customer.open_tasks }}</template
            >
            <template #content>
              <div class="flex flex-column gap-3">
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-teal-200 text-teal-900"
                >
                  <span class="font-size-20 font-weight-light">No breach</span>
                  <span class="font-size-24 font-weight-bold">{{
                    customer.open_tasks - customer.breached_tasks
                  }}</span>
                </div>
                <div
                  class="contact-counter flex flex-row justify-content-between align-items-center border-round-sm bg-red-50 text-red-600"
                >
                  <span class="font-size-20 font-weight-light">Breach</span>
                  <span class="font-size-24 font-weight-bold">{{
                    customer.breached_tasks
                  }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div>
        <WMContactsTable
          :columns="contactColumns"
          :customerId="route.params.id"
        >
        </WMContactsTable>
      </div>
      <div>
        <WMServicesTable
          relatedEntity="customer"
          :relatedEntityId="customer.id"
          :columns="serviceColumns"
          multiselect
        >
        </WMServicesTable>
      </div>
      <div>
        <WMTasksTable
          relatedEntity="customer"
          :relatedEntityId="customer.id"
          :columns="taskColumns"
          multiselect
        >
        </WMTasksTable>
      </div>
      <div class="flex flex-row gap-5 flex-wrap mt-5">
        <div class="flex-1 card-container">
          <Card>
            <template #title>
              <div class="h1 mx-5 mt-5">קבצים מצורפים</div>
            </template>
            <template #content> </template>
          </Card>
        </div>
        <div class="flex-1 tabs-container">
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
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt. Consectetur, adipisci velit, sed quia non numquam eius
                modi.
              </p>
            </TabPanel>
            <TabPanel header="טאב 2">
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                rerum facilis est et expedita distinctio. Nam libero tempore,
                cum soluta nobis est eligendi optio cumque nihil impedit quo
                minus.
              </p>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { useForm } from "vee-validate";
import { useFormUtilsStore } from "@/stores/formUtils";

import { useUtilsStore } from "@/stores/utils";
import { useOptionSetsStore } from "@/stores/optionSets";
import { useRoute } from "vue-router";

import { i18n } from "@/i18n";

const props = defineProps({
  formKey: {
    type: String,
    required: true,
  },
});

const { getTasksFromApi } = useTasks();
const { getServicesFromApi } = useServices();

const services = ref();
const tasks = ref();

const route = useRoute();
const formUtilsStore = useFormUtilsStore();
const optionSetsStore = useOptionSetsStore();

const utilsStore = useUtilsStore();
const toast = useToast();

const loaded = ref(false);

const customer = ref();
const types = ref();
const ratings = ref();
const selectedType = ref("");
const selectedRating = ref();
const selectedStatus = ref();
const selectedEntrance = ref("");
const statusConditionalStyle = ref("");

const alphabet = formUtilsStore.getAlphabet;

const {
  getContactColumns,
  getServiceColumns,
  getTaskColumns,
  getStatusConditionalStyle,
} = useListUtils();

const contactColumns = ref(getContactColumns());
const serviceColumns = ref(getServiceColumns());
const taskColumns = ref(getTaskColumns());

const yesNoOptions = optionSetsStore.getOptionSetValues("yesNo");
const isProvider = ref("");

const service_areas = ref();
const selectedServiceAreas = ref("");

utilsStore.resetElements();

onMounted(async () => {
  await fetchData();

  setSelectedContacts(customer.value.main_contact);
});

const { setSelectedContacts } = useContacts();

const { getCustomerFromApi, updateCustomer, parseCustomer, existsCustomer } =
  useCustomers();

const fetchData = async () => {
  await optionSetsStore
    .getOptionSetValuesFromApi("service_area")
    .then((data) => (service_areas.value = data));

  await optionSetsStore
    .getOptionSetValuesFromApi("customer_type")
    .then((data) => (types.value = data));
  await optionSetsStore
    .getOptionSetValuesFromApi("customer_rating")
    .then((data) => (ratings.value = data));
  await getCustomerFromApi(route.params.id).then((data) => {
    customer.value = data;
    utilsStore.selectedElements["customer"] = [customer.value];

    selectedServiceAreas.value = service_areas.value.filter((item) =>
      customer.value.service_areas.find((x) => x.id == item.id)
    );
    selectedRating.value = ratings.value.find(
      (rating) => rating.id == customer.value.rating.id
    );

    selectedType.value = types.value.find(
      (type) => type.id == customer.value.type.id
    );
    selectedStatus.value = i18n.t(
      "option-set.customer_status." + customer.value.status.value
    );

    statusConditionalStyle.value = getStatusConditionalStyle(
      customer.value.status.value
    );
    isProvider.value = yesNoOptions.find(
      (option) => option.value == customer.value.is_provider
    );
  });

  loaded.value = true;

  const servicesData = await getServicesFromApi({
    customer_id: route.params.id,
  });
  services.value = servicesData.data;
  const tasksData = await getTasksFromApi({
    customer_id: route.params.id,
  });
  tasks.value = tasksData.data;
};

const { errors, handleSubmit, setFieldError, meta, resetForm } = useForm({
  validationSchema: formUtilsStore.getCustomerDetailFormValidationSchema,
});

const onSave = handleSubmit((values) => {
  if (customerNumberExists.value) {
    setFieldError("number", {
      key: "validation.exists",
      values: { label: "customer.customer" },
    });
    return;
  }
  updateCustomer(route.params.id, parseCustomer(values))
    .then((data) => {
      toast.successAction("customer", "updated");
      resetForm({ values: values });
    })
    .catch((error) => {
      console.log(error);
      toast.error("customer", "not-updated");
    });
});

const customerNumberExists = ref(false);
const onCustomerNumberChanged = (event) => {
  utilsStore.debounceAction(() => {
    existsCustomer("id", event.target.value).then(
      (exists) => (
        (customerNumberExists.value = exists),
        exists
          ? setFieldError("number", {
              key: "validation.exists",
              values: { label: "customer.customer" },
            })
          : setFieldError("number", undefined)
      )
    );
  });
};

formUtilsStore.$reset();
formUtilsStore.save = onSave;
formUtilsStore.formEntity = "customer";
utilsStore.entity = "customer";

watch(
  () => meta.value,
  (value) => {
    formUtilsStore.formMeta = value;
    formUtilsStore.setFormMetas(value, props.formKey);
  }
);

defineExpose({
  onSave,
});

const statusClass = (data) => {
  return getStatusConditionalStyle(data);
};
</script>

<style scoped lang="scss"></style>
