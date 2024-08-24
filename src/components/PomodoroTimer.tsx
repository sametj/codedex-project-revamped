import React, { useEffect, useState } from "react";
import { todoArray } from "@/types";
import pausePlay from "@/assets/play-pause.svg";
import reset from "@/assets/arrows-counter-clockwise.svg";
import stop from "@/assets/stop-fill.svg";
import timer from "@/assets/timer-fill.svg";
import coffe from "@/assets/coffee-fill.svg";
import play from "@/assets/play-fill.svg";
import folder from "@/assets/folder-open-fill.svg";

type TimerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode,
}

const TimerButton = (props: TimerButtonProps) => {
  const { children, ...buttonProps } = props

  return (
    <button
      {...buttonProps}
      className="text-10 flex w-1/3 items-center justify-center gap-18 rounded-full bg-[#0bb463] p-12 text-white"
    >
      {children}
    </button>
  )
}

type pomoStages = "ongoing" | "break"
type timerStates = pomoStages | "stopped" | "paused"

export default function PomodoroTimer({
  todoList,
  pomoDuration,
  breakDuration,
  activeTaskId,
  incrementSession,
}: {
  todoList: todoArray;
  activeTaskId: number | null;
  pomoDuration: number;
  breakDuration: number;
  setBreakDuration: (duration: number) => void;
  incrementSession: () => void;
}) {
  const getStageDuration = (stage:pomoStages) => {
    return stage === "ongoing" ? pomoDuration * 60 : breakDuration * 60
  }

  const defaultStage = "ongoing"

  const [pomoStage, setPomoStage] = useState<pomoStages>(defaultStage);
  const [pomoStatus, setPomoStatus] = useState<timerStates>("stopped");
  const [seconds, setSeconds] = useState<number>(getStageDuration(defaultStage));

  const [customDurationFormVisible, setCustomDurationFormVisible] = useState<boolean>(false);
  const [customDuration, setCustomDuration] = useState(0)

  const activeTask = todoList.find((item) => item.id === activeTaskId) || null;
  const remainingSeconds = seconds % 60;

  //Percentage for bar
  const currentStageDuration = getStageDuration(pomoStage)
  const elapsedTime = currentStageDuration - seconds
  const percentage = (elapsedTime / currentStageDuration) * 100;

  const timerMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const timerSeconds = String(remainingSeconds).padStart(2, "0");
  const timerValue = `${timerMinutes}:${timerSeconds}`;

  const timerRunning = pomoStatus === "ongoing"

  function handleResetClick() {
    setSeconds(getStageDuration(pomoStage));
  }

  function handlePauseClick() {
    setPomoStatus((status) => status === "paused" ? "ongoing" : "paused")
  }

  const startTimer = () => {
    setPomoStatus("ongoing")
  }

  const stopTimer = () => {
    setPomoStatus("stopped")
    setSeconds(getStageDuration(pomoStage))
  }

  const goToStage = (stage:pomoStages) => {
    setPomoStage(stage)
    setSeconds(getStageDuration(stage))
  }

  const handleStageClick = (stage:pomoStages) => {
    if (timerRunning) {
      if (!confirm("Are you sure you want to stop the timer?")) {
        return
      }
    }

    setPomoStatus("stopped")
    goToStage(stage)
  }

  //Form Section
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSeconds(customDuration * 60)
    setCustomDurationFormVisible(false);
  }

  useEffect(() => {
    if (timerRunning) {
      const intervalId = setInterval(() => {
        if (seconds !== 0) {
          setSeconds((time) => time - 1)
        } else {
          setPomoStatus("stopped")

          const nextStage = pomoStage === "ongoing" ? "break" : "ongoing"
          goToStage(nextStage)

          incrementSession()
        }
      }, 1000)

      return () => clearInterval(intervalId)
    }
  }, [seconds, timerRunning])

  return (
    <div className="row-span-2 flex flex-col items-center justify-between justify-around rounded-3xl bg-[#f3f3f3]/60 backdrop-blur-md">
      <div className="flex h-45 w-6/12 justify-between rounded-3xl bg-[#f3f3f3]/40">
        <button
          onClick={() => handleStageClick("ongoing")}
          className="flex w-3/4 items-center justify-center gap-2 rounded-3xl"
          style={{
            backgroundColor: `${pomoStage === "ongoing" ? "white" : "transparent"}`,
          }}
        >
          <img src={timer} alt="timer" />
          <span>Ongoing</span>
        </button>
        <button
          onClick={() => handleStageClick("break")}
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
        <button
          type="button"
          className="cursor-pointer select-none text-100 font-bold text-[#1b2952]"
          onClick={() => setCustomDurationFormVisible(!customDurationFormVisible)}
        >
          {timerValue}
        </button>
        {customDurationFormVisible && (
          <form onSubmit={handleSubmit}>
            <input
              className="mb-8 rounded-md p-4 text-center"
              type="number"
              placeholder="Enter Session duration"
              autoFocus
              max={60}
              value={customDuration}
              onChange={e => setCustomDuration(e.target.valueAsNumber)}
            />
            <button className="ml-4 rounded-md border-2 bg-green-500 p-4">
              Enter
            </button>
          </form>
        )}
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
        {pomoStatus === "stopped" ? (
          <TimerButton onClick={startTimer}>
            <img src={play} alt="start" />
            <span className="text-14">Start</span>
          </TimerButton>
        ) : (
          <>
            <button
              onClick={handleResetClick}
              className="rounded-full bg-white px-8 text-[#1b2952]"
            >
              <img src={reset} alt="Reset" />
            </button>
            <TimerButton onClick={stopTimer}>
              <img src={stop} alt="stop" />
              <span className="text-14">Stop</span>
            </TimerButton>
            <button
              onClick={handlePauseClick}
              className="rounded-full bg-white p-8 text-[#1b2952]"
            >
              <img src={pausePlay} alt="Pause" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
