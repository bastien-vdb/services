import { serviceActionType } from "@/src/reducers/serviceReducer";
import { servicesType } from "@/src/types/service.type";

export const deleteService = (service: servicesType, serviceDispatch: React.Dispatch<serviceActionType>) => {
  //Optimistic update
  serviceDispatch({
    type: "DELETE_SERVICE",
    payload: { serviceSelected: service.name },
  });

  try {
    fetch("/api/services/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: service.id,
        stripeId: service.stripeId,
      }),
    })
      .then(async (newListOfServicesJson) => await newListOfServicesJson.json())
      .then((newListOfServices) => {
        {
          serviceDispatch({
            type: "SET_SERVICES",
            payload: { services: newListOfServices },
          });
        }
      });
  } catch (error) {
    throw new Error("Cannot be deleted from the DB");
  }
};
