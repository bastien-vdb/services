export type periodType = {
  id?: string;
  date: Date;
  start: Date;
  end: Date;
};

export type periodStateType = {
  periods: periodType[];
};

export type periodActionType =
  | {
      type: "ADD_PERIOD";
      payload: periodType;
    }
  | {
      type: "DELETE_PERIOD";
      payload: { id: string };
    }
  | {
      type: "SET_PERIODS";
      payload: periodType[];
    };

export const periodReducer = (state: periodStateType, action: periodActionType) => {
  switch (action.type) {
    case "SET_PERIODS":
      if (!action.payload) throw new Error("payload mandatory for this action");
      return {
        ...state,
        periods: action.payload,
      };
    case "ADD_PERIOD":
      return { ...state, periods: [...state.periods, action.payload] };
    case "DELETE_PERIOD":
      return { ...state, periods: state.periods.filter((period) => period.id !== action.payload.id) };
    default:
      return state;
  }
};
