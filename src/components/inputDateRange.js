import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const App = () => {
  // ✅ a change in default state: { from: ..., to: ... }
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null
  });
  function parseValue(ISODate) {
    if (!ISODate) {
      return null;
    }
    let originalDate = parseISO(ISODate);

    return {
      year: originalDate.getFullYear(),
      month: originalDate.getMonth() + 1,
      day: originalDate.getDate(),
    };
  }
  return (
    <Calendar
      value={selectedDayRange}
      onChange={setSelectedDayRange}
      shouldHighlightWeekends
    />
  );
};

export default App;