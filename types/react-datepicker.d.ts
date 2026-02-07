declare module 'react-datepicker' {
  import { Component, ReactNode } from 'react';

  export interface ReactDatePickerProps {
    selected?: Date | null;
    onChange: (date: Date | null, event?: React.SyntheticEvent<any>) => void;
    minDate?: Date;
    maxDate?: Date;
    dateFormat?: string;
    className?: string;
    placeholderText?: string;
    disabled?: boolean;
    showTimeSelect?: boolean;
    timeFormat?: string;
    timeIntervals?: number;
    inline?: boolean;
    [key: string]: any;
  }

  export default class ReactDatePicker extends Component<ReactDatePickerProps> {}
}

declare module 'react-datepicker/dist/react-datepicker.css';
