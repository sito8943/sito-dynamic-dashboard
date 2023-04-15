import React from "react";
import Calendar from "react-calendar";

// contexts
import { useCalendar } from "./CalendarProvider";

// styles
import "react-calendar/dist/Calendar.css";
import "./styles.css";

export default function MyCalendar({ className }) {
  const { calendarState, setCalendarState } = useCalendar();

  const handleCalendarDate = (value, e) => {
    setCalendarState({
      type: "set-range",
      payload: value,
    });
  };

  const handleStartTime = (e) => {
    setCalendarState({
      type: "set-start-time",
      payload: e.target.value,
    });
  };

  const handleEndTime = (e) => {
    setCalendarState({
      type: "set-end-time",
      payload: e.target.value,
    });
  };

  return calendarState.date ? (
    <section className={className}>
      <div className="calendar-container">
        <Calendar
          onChange={handleCalendarDate}
          defaultValue={calendarState.date}
          selectRange={true}
        />
      </div>
      <section className="event-time">
        <div className="event-time--start">
          <span>Hora Inicial:</span>
          <input
            className="event-time__input"
            type="time"
            value={calendarState.startTime}
            onChange={handleStartTime}
          />
        </div>
        <div className="event-time--end">
          <span>Hora Final:</span>
          <input
            className="event-time__input"
            type="time"
            value={calendarState.endTime}
            onChange={handleEndTime}
          />
        </div>
      </section>
    </section>
  ) : null;
}
