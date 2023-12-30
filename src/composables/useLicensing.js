import { useLicensingStore } from "@/stores/licensingStore";
import { storeToRefs } from "pinia";

export function useLicensing() {
  const licensingStore = useLicensingStore();
  const { licensing } = storeToRefs(licensingStore);

  const getLicensing = () => {
    if (checkIfLicensingLocalStorageExistAndItsNotEmpty()) {
      licensing.value = JSON.parse(localStorage.getItem("licensing"));
    } else {
      fetchLicensing();
    }
  };

  const checkIfLicensingLocalStorageExistAndItsNotEmpty = () => {
    return (
      localStorage.getItem("licensing") &&
      localStorage.getItem("licensing") !== "[]"
    );
  };

  const fetchLicensing = async () => {
    console.log("fetching licensing");
    await licensingStore.fetchLicensing();
    localStorage.setItem("licensing", JSON.stringify(licensing.value));
  };

  const checkIfEntityIsActive = (entityName) => {
    const entity = licensing.value.entities.find(
      (entity) => entity.name === entityName
    );
    return entity.active === 1;
  };

  return {
    licensing,
    // ACTIONS
    getLicensing,
    fetchLicensing,
    // METHODS
    checkIfEntityIsActive,
  };
}
