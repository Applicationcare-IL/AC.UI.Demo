import axiosConfig from "@/service/axiosConfig";

export const OwnersService = {
  //Type is to control if we return Employees or Teams
  getOwnersFromApi(params, type) {
    return axiosConfig
      .get("/owner", { params })
      .then((response) => {
        const data = response.data.data[`${type}s`].map((owner) => {
          return this.mapOwners(owner);
        });

        return { data };
      })
      .catch((error) => {
        console.error(error);
      });
  },

  assignTo(elements, entity, ownerId, type) {
    const params = {
      entity_ids: elements.map((element) => element.id),
      entity_name: entity,
      owner_id: ownerId,
      owner_type: type,
    };
    return axiosConfig.post("/owner/assign", params).then((response) => {
      return { response };
    });
  },

  mapOwners(owner) {
    return {
      id: owner.id,
      name: owner.name,
      type: owner.type,
    };
  },
};

const slas = ["10 ימים", "2 ימים", "3 ימים", "עמד ביעד", "הסתיים בחריגה"];
