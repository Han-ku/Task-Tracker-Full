import React, {useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DatePickerComponent({ selectedDate, setSelectedDate }) {

  const [previousDate, setPreviousDate] = useState(null)

  const handleDateChange = (date) => {
    date.setHours(23, 59, 59);
    setSelectedDate(date); 
  }

  useEffect(() => {
    if (selectedDate && selectedDate.getTime() !== previousDate?.getTime()) {
      setPreviousDate(selectedDate);
    }
  }, [selectedDate, previousDate])

  return (
    <DatePicker 
      selected={selectedDate} 
      onChange={handleDateChange}
      minDate={new Date()}
      inline
    />
  )
}