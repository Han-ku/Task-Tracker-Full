import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DatePickerComponent({ selectedDate, setSelectedDate }) {
  return (
    <DatePicker 
      selected={selectedDate} 
      onChange={(date) => {
        setSelectedDate(date)
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      }}
      minDate={new Date()}
      inline
    />
  )
}