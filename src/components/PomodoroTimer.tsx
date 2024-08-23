import { useEffect, useState } from "react";
import { todo, todoArray } from "@/types";
import pausePlay from "@/assets/play-pause.svg";
import reset from "@/assets/arrows-counter-clockwise.svg";
import stop from "@/assets/stop-fill.svg";
import timer from "@/assets/timer-fill.svg";
import coffe from "@/assets/coffee-fill.svg";
import play from "@/assets/play-fill.svg";
import folder from "@/assets/folder-open-fill.svg";

export default function PomodoroTimer({
  todoList,
  pomoDuration,
  breakDuration,
  activeTask,
  setPomoDuration,
  setTodoList,
}: {
  todoList: todoArray;
  activeTask: todo | null;
  pomoDuration: number;
  breakDuration: number;
  setPomoDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
  setTodoList: (todoList: todoArray) => void;
}) {
  const [pomoStage, setPomoStage] = useState<string>("ongoing");
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [pomoStatus, setPomoStatus] = useState<string>("stopped");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [minutes, setMinutes] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const seconds = minutes % 60;

  //Percentage for bar
  const pomodoroDuration =
    pomoStage === "ongoing" ? pomoDuration : breakDuration;
  const percentage = (elapsedTime / (pomodoroDuration * 60)) * 100;

  //active Task
  useEffect(() => {
    if (pomoStage === "ongoing") {
      setMinutes(pomoDuration * 60);
    } else {
      setMinutes(breakDuration * 60);
    }
  }, [pomoStage, pomoDuration, breakDuration]);

  useEffect(() => {
    if (pomoStatus === "stopped") {
      setMinutes(
        pomoStage === "ongoing" ? pomoDuration * 60 : breakDuration * 60,
      );
      setElapsedTime(0);
    }

    if (pomoStatus === "ongoing") {
      const interval = setInterval(() => {
        if (minutes !== 0) {
          setMinutes((time) => time - 1);
          setElapsedTime((time) => time + 1);
        } else {
          setPomoStatus("stopped");
          setPomoStage((stage) => (stage === "ongoing" ? "break" : "ongoing"));
          setCount((count) => count + 0.5);
          updateTask();
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    if (pomoStatus === "reset") {
      setMinutes(
        pomoStage === "ongoing" ? pomoDuration * 60 : breakDuration * 60,
      );
      setElapsedTime(0);
      setPomoStatus("stopped");
    }

    if (pomoStatus === "paused") {
      setElapsedTime(elapsedTime);
      setPomoStatus("paused");
    }

    function updateTask() {
      const todoListCopy = [...todoList];
      if (activeTask) {
        const updatedTask = activeTask;
        updatedTask.currentSession += 0.5;
        updatedTask.isCompleted =
          updatedTask.currentSession === updatedTask.totalSession;
        todoListCopy[activeTask.id] = updatedTask;
      }

      setTodoList(todoListCopy);

      localStorage.setItem("todos", JSON.stringify(todoListCopy));
    }
  }, [
    pomoStatus,
    minutes,
    pomoDuration,
    breakDuration,
    pomoStage,
    elapsedTime,
    activeTask,
    count,
    setTodoList,
    todoList,
  ]);

  //Form Section
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPomoStatus("reset");
    setShowForm(false);
  }

  function handlePomoStage() {
    setPomoStage((stage) => (stage === "ongoing" ? "break" : "ongoing"));
    setElapsedTime(0);
    setPomoStatus("stopped");
  }

  return (
    <div className="row-span-2 flex flex-col items-center justify-between justify-around rounded-3xl bg-[#f3f3f3]/60 backdrop-blur-md">
      <div className="flex h-45 w-6/12 justify-between rounded-3xl bg-[#f3f3f3]/40">
        <button
          onClick={handlePomoStage}
          className="flex w-3/4 items-center justify-center gap-2 rounded-3xl"
          style={{
            backgroundColor: `${pomoStage === "ongoing" ? "white" : "transparent"}`,
          }}
        >
          <img src={timer} alt="timer" />
          <span>Ongoing</span>
        </button>
        <button
          onClick={handlePomoStage}
          className="flex w-2/3 items-center justify-center gap-2 rounded-3xl"
          style={{
            backgroundColor: `${pomoStage === "break" ? "white" : "transparent"}`,
          }}
        >
          <img src={coffe} alt="cofee" />
          <span> Break</span>
        </button>
      </div>

      <div className="flex h-200 w-2/4 flex-col justify-between text-center">
        <span className="cursor-pointer select-none text-100 font-bold text-[#1b2952]">
          {Math.floor(minutes / 60) < 10
            ? "0" + Math.floor(minutes / 60)
            : Math.floor(minutes / 60)}
          :{seconds < 10 ? "0" + seconds : seconds}
        </span>
        <form
          style={{ display: `${showForm ? "inline-block" : "none"}` }}
          onSubmit={handleSubmit}
        >
          <input
            className="mb-8 rounded-md p-4 text-center"
            type="text"
            placeholder="Enter Session duration"
            onChange={(e) => setPomoDuration(Number(e.target.value))}
          />
          <button className="ml-4 rounded-md border-2 bg-green-500 p-4">
            Enter
          </button>
        </form>
        <div className="h-2.5 rounded-3xl bg-white">
          <div
            className="h-full rounded-full bg-green-400"
            style={{ width: `${percentage}%` }}
          >
            &nbsp;
          </div>
        </div>
      </div>

      <span className="flex w-1/3 select-none items-center justify-center rounded-md bg-[#B3BBC4]/40 p-8 font-bold text-[#1b2952]">
        <img
          width={42}
          height={42}
          src={activeTask?.category.src || folder}
          alt=""
        />
        {activeTask?.todoName || " #1 It's time to focus"}
      </span>

      <div className="flex w-3/4 select-none justify-center gap-12">
        <button
          onClick={() => setPomoStatus("reset")}
          className="rounded-full bg-white px-8 text-[#1b2952]"
          style={{
            display: `${pomoStatus === "stopped" ? "none" : "inline-block"}`,
          }}
        >
          <img src={reset} alt="Reset" />
        </button>
        <button
          onClick={() =>
            setPomoStatus((status) =>
              status === "stopped" ? "ongoing" : "stopped",
            )
          }
          className="text-10 flex w-1/3 items-center justify-center gap-18 rounded-full bg-[#0bb463] p-12 text-white"
        >
          <img src={pomoStatus === "stopped" ? play : stop} alt="stop" />
          {pomoStatus === "stopped" ? "Start" : "Stop"}
        </button>
        <button
          onClick={() =>
            setPomoStatus((status) =>
              status === "paused" ? "ongoing" : "paused",
            )
          }
          className="rounded-full bg-white p-8 text-[#1b2952]"
          style={{
            display: `${pomoStatus === "stopped" ? "none" : "inline-block"}`,
          }}
        >
          <img src={pausePlay} alt="Pause" />
        </button>
      </div>
    </div>
  );
}
