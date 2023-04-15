/*
Calendar state:
{
    date : can be date or an array of 2 dates
    startTime: string ("08:00")
    endTime: string ("16:00")
}
*/

import { createContext, useContext, useReducer } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const CalendarContext = createContext();

const calendarReducer = (calendarState, action) => {
  switch (action.type) {
    case "init": {
      const { initial } = action;
      try {
        if (initial) {
          return {
            date: [
              new Date(
                initial.date[0].year,
                initial.date[0].month - 1,
                initial.date[0].day
              ),
              new Date(
                initial.date[1].year,
                initial.date[1].month - 1,
                initial.date[1].day
              ),
            ],
            startTime: initial.startTime,
            endTime: initial.endTime,
          };
        }
      } catch (err) {}
      return {
        date: [new Date(), new Date()],
        startTime: "08:00",
        endTime: "16:00",
      };
    }
    case "reset": {
      return {
        date: [new Date(), new Date()],
        startTime: "08:00",
        endTime: "16:00",
      };
    }
    case "set-range": {
      return {
        ...calendarState,
        date: action.payload,
      };
    }
    case "set-start-time": {
      const { payload } = action;
      if (payload > calendarState.endTime) {
        return {
          ...calendarState,
          endTime: payload,
          startTime: calendarState.endTime,
        };
      }
      return {
        ...calendarState,
        startTime: action.payload,
      };
    }
    case "set-end-time": {
      const { payload } = action;
      if (payload < calendarState.startTime) {
        return {
          ...calendarState,
          endTime: calendarState.startTime,
          startTime: payload,
        };
      }
      return {
        ...calendarState,
        endTime: action.payload,
      };
    }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const CalendarProvider = ({ children }) => {
  const [calendarState, setCalendarState] = useReducer(calendarReducer, {});

  const value = { calendarState, setCalendarState };
  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

CalendarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined)
    throw new Error("calendarContext must be used within a Provider");
  return context;
};

export { CalendarProvider, useCalendar };
