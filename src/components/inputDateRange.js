import { addDays } from 'date-fns';
import { useState } from 'react';

import { DateRangePicker } from 'react-date-range';

export default function InputRangeDate(){
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);
  return (
    <DateRangePicker
    editableDateInputs={true}
    onChange={item => {
      console.log(item.selection);
      setState([item.selection])
    }}
    moveRangeOnFirstSelection={false}
    ranges={state}
 
/>
  )
}

