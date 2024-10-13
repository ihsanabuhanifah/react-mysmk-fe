import React, { useState } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import moment from 'moment';

const yearOptions = Array.from({ length: 10 }, (_, i) => {
  const year = moment().year() + i;
  return { key: year, text: year, value: year };
});

const monthOptions = moment.months().map((month, index) => ({
  key: index + 1,
  text: month,
  value: index + 1,
}));

const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  key: i + 1,
  text: i + 1,
  value: i + 1,
}));

export default function BatasWaktuPicker({ value, onChange }) {
  const [selectedYear, setSelectedYear] = useState(moment(value).year());
  const [selectedMonth, setSelectedMonth] = useState(moment(value).month() + 1);
  const [selectedDay, setSelectedDay] = useState(moment(value).date());

  const handleYearChange = (e, { value }) => {
    setSelectedYear(value);
    onChange(formatDate(value, selectedMonth, selectedDay));
  };

  const handleMonthChange = (e, { value }) => {
    setSelectedMonth(value);
    onChange(formatDate(selectedYear, value, selectedDay));
  };

  const handleDayChange = (e, { value }) => {
    setSelectedDay(value);
    onChange(formatDate(selectedYear, selectedMonth, value));
  };

  const formatDate = (year, month, day) => {
    return moment(`${year}-${month}-${day}`).format('YYYY-MM-DD');
  };

  return (
    <Form.Group widths="equal">
      <Form.Field>
        <label>Tahun</label>
        <Dropdown
          fluid
          selection
          options={yearOptions}
          value={selectedYear}
          onChange={handleYearChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Bulan</label>
        <Dropdown
          fluid
          selection
          options={monthOptions}
          value={selectedMonth}
          onChange={handleMonthChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Tanggal</label>
        <Dropdown
          fluid
          selection
          options={dayOptions}
          value={selectedDay}
          onChange={handleDayChange}
        />
      </Form.Field>
    </Form.Group>
  );
}
