"use client";

import { FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import { updateDueDate } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";

interface DueDateProps {
  id: number;
  dueDate?: string;
}

export default function DueDateInput({ id, dueDate }: DueDateProps) {

  const today = new Date();
  const { token } = useAuth();

  // Parse YYYY-MM-DD string from DB and normalize to local midnight
  const parseDateFromDB = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const [value, setValue] = useState<Date>(
    dueDate ? parseDateFromDB(dueDate) : (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })()
  );
  const [localValue, setLocalValue] = useState<Date | null >(null);

  const [showCalendar, setShowCalendar] = useState(false);

  const displayDate = localValue ?? (dueDate ? parseDateFromDB(dueDate) : null);


  const handleChange = async (date: Date | Date[] | null) => {
    if (!date || Array.isArray(date)) return;

    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setValue(normalized);
    setShowCalendar(false);
    setLocalValue(normalized);

    const dateStr = normalized.toISOString().split("T")[0];

    try {
      await updateDueDate(token!, id, dateStr);
    } catch (err) {
      console.error("Failed to update due date:", err);
    }
  };

  useEffect(() => {
    if (dueDate) {
      const newDate = parseDateFromDB(dueDate);
      setValue(newDate);
    }
  }, [dueDate]);

  return (
    <>
      <div className="flex flex-row space-x-3 items-center justify-start mb-3">
        {displayDate ? 
          <p className={`text-left ${value < today ? "text-red-600" : "text-white"}`}>
            Due: {value.toLocaleDateString()}
          </p>
          : 
          <p className="text-zinc-500">
            Add Due Date
          </p>
        }
        <button onClick={() => setShowCalendar(prev => !prev)} className="hover:cursor-pointer">
          <FaCalendarAlt size={18}/>
        </button>
      </div> 

      {showCalendar && (
        <div className="w-[250px] absolute z-10 bg-dark-gray p-2 rounded-lg border-[1px] border-zinc-700 shadow-2xl">
          <Calendar
            value={value}
            onChange={handleChange} // error due to missing "_event" property
            minDate={today}
            tileClassName={({ date, view }) =>
              view === "month" && date.getTime() === value.getTime()
                ? "bg-primary text-black rounded"
                : ""
            }
          />
        </div>
      )}
    </>
  );
}
