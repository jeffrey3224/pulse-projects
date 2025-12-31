"use client"

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
  
  const [value, setValue] = useState<Date>(dueDate ? new Date(dueDate) : new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (dueDate) setValue(new Date(dueDate));
  }, [dueDate]);

  const handleUpdate: CalendarProps['onChange'] = async (selected) => {
    if (!selected || Array.isArray(selected)) return; // ignore null or range selections
    setValue(selected);
    setShowCalendar(false);

    try {
      await updateDueDate(token!, id, selected);
    } catch (err) {
      console.error("Failed to update due date:", err);
    }
  };

  return (
    <>
      <div className="flex flex-row space-x-3 items-center justify-start mb-3">
        <p className={`text-left ${value < today ? "text-red-600" : "text-white"}`}>
          Due: {value.toLocaleDateString()}
        </p>
        <button onClick={() => setShowCalendar(prev => !prev)}>
          <FaCalendarAlt />
        </button>
      </div>

      {showCalendar && (
        <div className="w-[250px] absolute z-10 bg-zinc-800 p-2">
          <Calendar
            value={value}
            onChange={handleUpdate}
            minDate={today}
          />
        </div>
      )}
    </>
  );
}
