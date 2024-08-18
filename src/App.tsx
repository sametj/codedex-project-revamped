import { useEffect, useState } from "react";
import pausePlay from "@/assets/play-pause.svg";
import reset from "@/assets/arrows-counter-clockwise.svg";
import stop from "@/assets/stop-fill.svg";
import timer from "@/assets/timer-fill.svg";
import coffe from "@/assets/coffee-fill.svg";
import search from "@/assets/magnifying-glass.svg";
import add from "@/assets/plus-circle-fill.svg";
import menu from "@/assets/dots-three-outline-vertical-fill.svg";
import { todoArray } from "@/types";

export const todos: todoArray = [
  {
    id: 2,
    todoName: "Test",
    isCompleted: false,
    time: "06:50",
  },
  {
    id: 3,
    todoName: "Test-2",
    isCompleted: false,
    time: "06:50",
  },
  {
    id: 4,
    todoName: "Test-1",
    isCompleted: false,
    time: "06:50",
  },
];

export default function App() {
  const [taskList] = useState<todoArray>(todos);
  const [time, setTime] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const taskListLength = taskList.length;

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

  // Pomodoro Section
  const [pomoDuration, setPomoduration] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [pomoStatus, setPomoStatus] = useState<string>("stopped");
  const [showForm, setShowForm] = useState<boolean>(false);

  const seconds = minutes % 60;

  useEffect(() => {
    const interval = setInterval(() => {
      if (pomoStatus === "paused") {
        return;
      } else if (pomoStatus === "stopped") {
        setMinutes(pomoDuration * 60);
        setElapsedTime(0);
      } else if (pomoStatus === "reset") {
        setMinutes(pomoDuration * 60);
        setElapsedTime(0);
        setPomoStatus("ongoing");
      } else setMinutes((prev) => prev - 1);
      setElapsedTime((elapsed) => {
        if (elapsed < minutes) {
          return elapsed + 1;
        } else {
          clearInterval(interval);
          return elapsed;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, pomoDuration, pomoStatus]);

  //Percentage for bar
  const percentage = (elapsedTime / minutes) * 100;

  //Form Section
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPomoStatus("reset");
    setShowForm(false);
  }

  return (
    <div className='container mx-auto grid grid-cols-2 grid-rows-3  px-100 py-100 h-screen gap-20 '>
      {/* Todo list Section */}
      <section className=' row-span-3  flex flex-col  items-center border-m rounded-3xl bg-[#f3f3f3]/80 backdrop-blur-md'>
        <div className='basis-0 p-12  flex items-center justify-between w-full border-b-2'>
          <div className='text-[#1b2952] font-bold'>
            Task List
            <span className='text-[#4c4f53] font-light'>
              {""} ({taskListLength} tasks)
            </span>
          </div>

          <div className='text-white w-1/6 flex items-center justify-between'>
            <button>
              <img src={search} alt='search' />
            </button>

            <button>
              <img src={menu} alt='menu' />
            </button>
          </div>
        </div>

        <div className='basis-4/4 p-12 w-full h-full text-white border-b-2  flex-wrap overflow-auto'>
          <ul className='flex flex-col gap-12  '>
            {todos.map((todo) => (
              <li key={todo.id} className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    className='hidden'
                    type='checkbox'
                    id={`${todo.todoName}-checkbox-${todo.id}`}
                  />
                  <label
                    htmlFor={`${todo.todoName}-checkbox-${todo.id}`}
                    className='custom-checkbox'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='feather feather-check'>
                      <polyline points='20 6 9 17 4 12'></polyline>
                    </svg>
                  </label>
                </div>
                <div className='bg-white rounded-md p-8'>
                  <img src={timer} alt='' />
                </div>
                <div className='flex mx-20 w-full flex-col self-start '>
                  <span className='font-bold text-[#1b2952]'>
                    {todo.todoName}
                  </span>
                  <span className='text-[#1b2952]'>
                    {todo.isCompleted ? "Done" : "Incomplete"}
                  </span>
                </div>
                <span className='self-end text-[gray] w-1/4 '>
                  At {todo.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button className='basis-0 flex items-center justify-between gap-8 p-24'>
          <img src={add} alt='add' />
          <span
            className='text-20 text-[#1b2952] font-bold
          '>
            Add Task
          </span>
        </button>
      </section>

      {/* Pomodoro and progress section */}
      <main className='row-span-3 grid grid-rows-3  gap-20 '>
        <div className='row-span-1 bg-[#f3f3f3]/80  p-22 flex justify-between items-center justify-center rounded-3xl backdrop-blur-md'>
          <div className='flex flex-col h-full justify-between '>
            <span className='text-lg font-bold '>Daily Progress</span>
            <div className='flex gap-12 w-full h-1/4 justify-start'>
              <span className='rounded-3xl text-white flex items-center  px-18  bg-blue-600 '>
                3/6
              </span>
              <span className=' flex items-center text-center '>
                Tasks was done
              </span>
            </div>

            <span className='text-zinc-700 font-bold'>
              {date.toDateString()} {time}
            </span>
          </div>
          <div className='bg-white w-100 h-100 rounded-full flex items-center justify-center font-bold text-24'>
            38%
          </div>
        </div>

        <div className='row-span-2 bg-[#f3f3f3]/80  backdrop-blur-md flex flex-col justify-around flex items-center justify-between rounded-3xl'>
          <div className='flex w-6/12  bg-[#d7ddeb]/60 h-45  rounded-3xl justify-between'>
            <button className='w-3/4 flex items-center justify-center  gap-2 rounded-3xl bg-white '>
              <img src={timer} alt='timer' />
              <span>Ongoing</span>
            </button>
            <button className='w-2/3 flex items-center justify-center gap-2 rounded-3xl'>
              <img src={coffe} alt='cofee' />
              <span> Break</span>
            </button>
          </div>

          <div className='flex flex-col h-200 w-2/4  text-center justify-between'>
            <span
              onClick={() => setShowForm((show) => !show)}
              className='text-100 text-[#1b2952] font-bold cursor-pointer select-none'>
              {Math.floor(minutes / 60) < 10
                ? "0" + Math.floor(minutes / 60)
                : Math.floor(minutes / 60)}
              :{seconds < 10 ? "0" + seconds : seconds}
            </span>
            <form
              style={{ display: `${showForm ? "inline-block" : "none"}` }}
              onSubmit={handleSubmit}>
              <input
                className='rounded-md p-4 mb-8 text-center'
                type='text'
                placeholder='Enter Session duration'
                onChange={(e) => setPomoduration(Number(e.target.value))}
              />
              <button className='border-2 rounded-md ml-4 p-4 bg-green-500'>
                Enter
              </button>
            </form>
            <div className='bg-white h-2.5 rounded-3xl'>
              <div
                className='bg-green-400 h-full rounded-full'
                style={{ width: `${percentage}%` }}>
                &nbsp;
              </div>
            </div>
          </div>

          <span className='w-3/4 text-center text-[#1b2952] font-bold bg-[#B3BBC4]/60 p-8 rounded-md'>
            Learn How to use grid
          </span>

          <div className='flex gap-12  w-3/4  justify-center'>
            <button
              onClick={() => setPomoStatus("reset")}
              className='rounded-full bg-white px-8 text-[#1b2952] '>
              <img src={reset} alt='Reset' />
            </button>
            <button
              onClick={() => setPomoStatus("stopped")}
              className='flex items-center justify-center gap-2 text-10 bg-[#0bb463] text-white p-12 w-1/3 rounded-full'>
              <img src={stop} alt='stop' /> Stop
            </button>
            <button
              onClick={() =>
                setPomoStatus((status) =>
                  status === "paused" ? "play" : "paused"
                )
              }
              className='rounded-full text-[#1b2952] bg-white p-8'>
              <img src={pausePlay} alt='Pause' />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
