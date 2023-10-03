import type { servicesType } from "@/src/types/service.type";

/*** state */

export type serviceStateType = {
  serviceList: servicesType[];
  serviceSelected: string;
};

export type serviceActionType =
  | {
      type: "SELECT_SERVICE" | "RESET" | "DELETE_SERVICE";
      payload?: { serviceSelected: string };
    }
  | {
      type: "ADD_SERVICE";
      payload?: { newService: Omit<servicesType, "id"> };
    }
  | {
      type: "SET_SERVICES";
      payload?: { services: any };
    };

export const serviceReducer = (state: serviceStateType, action: serviceActionType) => {
  switch (action.type) {
    case "SET_SERVICES":
      if (!action.payload) throw new Error("payload mandatory for this action");
      return {
        ...state,
        serviceList: action.payload.services,
      };
    case "SELECT_SERVICE":
      if (!action.payload) throw new Error("payload mandatory for this action");
      return {
        ...state,
        serviceSelected: action.payload.serviceSelected,
      };
    case "RESET":
      return {
        ...state,
        serviceSelected: "",
      };
    case "DELETE_SERVICE":
      if (!action.payload) throw new Error("payload mandatory for this action");
      return {
        ...state,
        serviceList: state.serviceList.filter((service) => service.name !== action.payload?.serviceSelected),
      };
    case "ADD_SERVICE":
      if (!action.payload) throw new Error("payload mandatory for this action");
      return {
        ...state,
        serviceList: [
          ...state.serviceList,
          {
            name: action.payload.newService.name,
            price: action.payload.newService.price,
          },
        ],
      };
  }
};
