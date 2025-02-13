'use client';

import { forwardRef } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { Calendar } from 'lucide-react';
import fr from 'date-fns/locale/fr';
import "react-datepicker/dist/react-datepicker.css";

// Enregistrer la locale française
registerLocale('fr', fr);

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <div className="datepicker-container">
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      readOnly
      className="datepicker-input"
      placeholder="Sélectionner une date"
    />
    <Calendar className="datepicker-icon w-5 h-5" />
  </div>
));

CustomInput.displayName = 'CustomInput';

export default function DatePicker({ selected, onChange, ...props }) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      locale="fr"
      dateFormat="dd/MM/yyyy"
      customInput={<CustomInput />}
      minDate={new Date()} // Pour ne permettre que les dates futures
      showPopperArrow={false}
      calendarClassName="shadow-lg"
      {...props}
    />
  );
} 