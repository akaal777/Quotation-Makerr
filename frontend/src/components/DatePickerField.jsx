import React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const DatePickerField = ({ value, onChange, testId = "quotation-date" }) => {
  const parsed = value && isValid(parseISO(value)) ? parseISO(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-testid={`${testId}-trigger`}
          className="h-11 w-full justify-start bg-stone-50 border-stone-200 text-left font-body text-stone-800 hover:bg-stone-100"
        >
          <CalendarIcon className="w-4 h-4 mr-2 text-stone-500" />
          {parsed ? format(parsed, "dd MMM yyyy") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0 bg-white"
        data-testid={`${testId}-popover`}
      >
        <Calendar
          mode="single"
          selected={parsed}
          onSelect={(d) => {
            if (d) onChange(format(d, "yyyy-MM-dd"));
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerField;
