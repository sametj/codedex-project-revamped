import { useEffect, useState } from "react";

import { todoArray } from "@/types";

export default function PomoDoroStatus({
  todoList,
  completedTodos,
  completedPercentage,
}: {
  todoList: todoArray;
  completedTodos: todoArray;
  completedPercentage: number;
}) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Intl.DateTimeFormat("default", {
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      }).format(new Date());
      setDate(new Date());
      setTime(newDate);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="row-span-1 bg-[#f3f3f3]/80  p-22 flex justify-between items-center justify-center rounded-3xl backdrop-blur-md">
      <div className="flex flex-col h-full justify-between ">
        <span className="text-lg font-bold ">Daily Progress</span>
        <div className="flex gap-12 w-full h-1/4 justify-start items-center">
          <span
            className="rounded-3xl text-white h-3/4 flex items-center  px-18"
            style={{
              backgroundColor: `${completedTodos.length < 1 ? "grey" : "skyblue"}`,
            }}>
            {completedTodos.length < 1 ? "0" : completedTodos.length + "/" + todoList.length}
          </span>
          <span className=" flex items-center text-center ">Tasks was done</span>
        </div>

        <span className="text-zinc-700 font-bold">
          {date.toDateString()} {time}
        </span>
      </div>
      {completedPercentage > 0 && (
        <div className="bg-white w-100 h-100 rounded-full p-8 border-8 border-solid ">
          <span className="rounded-full h-full w-full bg-white flex items-center justify-center font-bold text-24">
            {completedPercentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}
