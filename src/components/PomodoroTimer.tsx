import { useEffect, useState } from "react";
import { todo } from "@/types";
import pausePlay from "@/assets/play-pause.svg";
import reset from "@/assets/arrows-counter-clockwise.svg";
import stop from "@/assets/stop-fill.svg";
import timer from "@/assets/timer-fill.svg";
import coffe from "@/assets/coffee-fill.svg";
import play from "@/assets/play-fill.svg";
import folder from "@/assets/folder-open-fill.svg";

export default function PomodoroTimer({
  pomoDuration,
  breakDuration,
  activeTask,
  setPomoDuration,
}: {
  activeTask: todo | null;
  pomoDuration: number;
  breakDuration: number;
  setPomoDuration: (duration: number) => void;
  setBreakDuration: (duration: number) => void;
}) {
  const [pomoStage, setPomoStage] = useState<string>("ongoing");
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [pomoStatus, setPomoStatus] = useState<string>("stopped");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [minutes, setMinutes] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const seconds = minutes % 60;

  //Percentage for bar
  const pomodoroDuration = pomoStage === "ongoing" ? pomoDuration : breakDuration;
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
      setMinutes(pomoStage === "ongoing" ? pomoDuration * 60 : breakDuration * 60);
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
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    if (pomoStatus === "reset") {
      setMinutes(pomoStage === "ongoing" ? pomoDuration * 60 : breakDuration * 60);
      setElapsedTime(0);
      setPomoStatus("stopped");
    }

    if (pomoStatus === "paused") {
      setElapsedTime(elapsedTime);
      setPomoStatus("paused");
    }
  }, [pomoStatus, minutes, pomoDuration, breakDuration, pomoStage, elapsedTime, activeTask, count]);

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

  function handleSessionCount() {
    setCount((prev) => prev + 0.5);

    if (count === activeTask?.totalSession) {
      setPomoStatus("stopped");
      setPomoStage("ongoing");
      setCount(0);
    }
  }

  return (
    <div className="row-span-2 bg-[#f3f3f3]/80  backdrop-blur-md flex flex-col justify-around flex items-center justify-between rounded-3xl">
      <div className="flex w-6/12  bg-[#d7ddeb]/60 h-45  rounded-3xl justify-between">
        <button
          onClick={handlePomoStage}
          className="w-3/4 flex items-center justify-center  gap-2 rounded-3xl"
          style={{
            backgroundColor: `${pomoStage === "ongoing" ? "white" : "transparent"}`,
          }}>
          <img src={timer} alt="timer" />
          <span>Ongoing</span>
        </button>
        <button
          onClick={handlePomoStage}
          className="w-2/3 flex items-center justify-center gap-2 rounded-3xl"
          style={{
            backgroundColor: `${pomoStage === "break" ? "white" : "transparent"}`,
          }}>
          <img src={coffe} alt="cofee" />
          <span> Break</span>
        </button>
      </div>

      <div className="flex flex-col h-200 w-2/4  text-center justify-between">
        <span
          // onClick={() => setShowForm((show) => !show)}
          className="text-100 text-[#1b2952] font-bold cursor-pointer select-none">
          {Math.floor(minutes / 60) < 10
            ? "0" + Math.floor(minutes / 60)
            : Math.floor(minutes / 60)}
          :{seconds < 10 ? "0" + seconds : seconds}
        </span>
        <form style={{ display: `${showForm ? "inline-block" : "none"}` }} onSubmit={handleSubmit}>
          <input
            className="rounded-md p-4 mb-8 text-center"
            type="text"
            placeholder="Enter Session duration"
            onChange={(e) => setPomoDuration(Number(e.target.value))}
          />
          <button className="border-2 rounded-md ml-4 p-4 bg-green-500">Enter</button>
        </form>
        <div className="bg-white h-2.5 rounded-3xl">
          <div className="bg-green-400 h-full rounded-full" style={{ width: `${percentage}%` }}>
            &nbsp;
          </div>
        </div>
      </div>

      <span className="w-1/3 flex items-center justify-center text-[#1b2952] font-bold bg-[#B3BBC4]/60 p-8 rounded-md">
        <img width={42} height={42} src={activeTask?.category.src || folder} alt="" />{" "}
        {activeTask?.todoName || " #1 It's time to focus"}
      </span>

      <div className="flex gap-12  w-3/4  justify-center">
        <button
          onClick={() => setPomoStatus("reset")}
          className="rounded-full bg-white px-8 text-[#1b2952]"
          style={{
            display: `${pomoStatus === "stopped" ? "none" : "inline-block"}`,
          }}>
          <img src={reset} alt="Reset" />
        </button>
        <button
          onClick={() => setPomoStatus((status) => (status === "stopped" ? "ongoing" : "stopped"))}
          className="flex items-center justify-center gap-18 text-10 bg-[#0bb463] text-white p-12 w-1/3 rounded-full">
          <img src={pomoStatus === "stopped" ? play : stop} alt="stop" />
          {pomoStatus === "stopped" ? "Start" : "Stop"}
        </button>
        <button
          onClick={() => setPomoStatus((status) => (status === "paused" ? "ongoing" : "paused"))}
          className="rounded-full text-[#1b2952] bg-white p-8"
          style={{
            display: `${pomoStatus === "stopped" ? "none" : "inline-block"}`,
          }}>
          <img src={pausePlay} alt="Pause" />
        </button>
      </div>
    </div>
  );
}
