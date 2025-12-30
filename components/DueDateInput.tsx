"use client"

import { FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import { Project } from "@/lib/types/projects";

interface DueDateProps {
  id: number;
  dueDate?: string;
}

export default function DueDateInput({ id, dueDate }: DueDateProps) {
  const [updatedDueDate, setUpdatedDueDate] = useState(dueDate ?? "");
  const today = new Date();
  const [showCalendar, setShowCalendar] = useState(false);


  return (
    <>
      {dueDate && (
        <div className="flex flex-row space-x-3 items-center justify-start mb-3">
          <p className={`text-left ${new Date(dueDate) < today ? "text-red-600" : "text-white"}`}>
            Due: {new Date(dueDate).toLocaleDateString()}
          </p>
          <button onClick={() => setShowCalendar(prev => !prev)}>
            <FaCalendarAlt />
          </button>
        </div>
      )}

      {showCalendar && 
        <input
        type="date"
        value={updatedDueDate}
        onChange={(e) => setUpdatedDueDate(e.target.value)}
        className="bg-zinc-800 text-white border rounded px-2 py-1"
      />
      }
      
    </>
  );
}
