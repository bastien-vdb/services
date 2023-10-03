export type bookingType = {
  id?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  serviceId: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type slotType = { from: Date; to: Date };

export type bookingStateType = {
  daySelected: Date | null;
  listOfSlot: slotType[];
  bookings: bookingType[];
};

export type bookingActionType =
  | {
      type: "SET_DAY";
      payload: Date;
    }
  | {
      type: "ADD_BOOKING";
      payload: bookingType;
    }
  | {
      type: "DELETE_BOOKING";
      payload: { id: string };
    }
  | {
      type: "SET_BOOKINGS";
      payload: bookingType[];
    };

export const bookingReducer = (state: bookingStateType, action: bookingActionType) => {
  switch (action.type) {
    case "SET_DAY":
      return { ...state, daySelected: action.payload };
    case "SET_BOOKINGS":
      if (!action.payload) throw new Error("payload mandatory for this action");
      return {
        ...state,
        bookings: action.payload,
      };
    case "ADD_BOOKING":
      return { ...state, bookings: [...state.bookings, action.payload] };
    case "DELETE_BOOKING":
      return { ...state, bookings: state.bookings.filter((booking) => booking.id !== action.payload.id) };
    default:
      return state;
  }
};
