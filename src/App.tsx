import React, { useEffect, useState } from "react";
import pausePlay from "@/assets/play-pause.svg";
import reset from "@/assets/arrows-counter-clockwise.svg";
import stop from "@/assets/stop-fill.svg";
import timer from "@/assets/timer-fill.svg";
import coffe from "@/assets/coffee-fill.svg";
import search from "@/assets/magnifying-glass.svg";
import add from "@/assets/plus-circle-fill.svg";
import menu from "@/assets/dots-three-outline-vertical-fill.svg";
import play from "@/assets/play-fill.svg";
import folder from "@/assets/folder-open-fill.svg";
import briefcase from "@/assets/briefcase-fill.svg";
import controller from "@/assets/game-controller-fill.svg";
import food from "@/assets/bread-fill.svg";
import book from "@/assets/book-bookmark-fill.svg";
import sport from "@/assets/barbell-fill.svg";
import plus from "@/assets/plus.svg";
import minus from "@/assets/minus.svg";
import close from "@/assets/x-light.svg";

import { todoArray } from "@/types";

const categories = [
  { src: briefcase, name: "Work" },
  { src: controller, name: "Play" },
  { src: food, name: "Food" },
  { src: book, name: "Learn" },
  { src: sport, name: "Sport" },
  { src: folder, name: "Others" },
];

export default function App() {
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [todoList, setTodoList] = useState<todoArray>([]);

  useEffect(() => {
    const todos = localStorage.getItem("todos");
    if (todos) {
      setTodoList(JSON.parse(todos));
    }
  }, []);

  const completedTodos = todoList.filter((todo) => todo.isCompleted);
  const completedPercentage = (completedTodos.length / todoList.length) * 100;

  function handleShowForm() {
    setShowTaskForm((show) => !show);
  }
  function handleCheckboxChange(id: number) {
    setTodoList((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );
  }

  return (
    <>
      {showTaskForm && <TaskForm todoList={todoList} showForm={handleShowForm} />}
      <div className="container mx-auto grid grid-cols-2 grid-rows-3  px-100 py-100 h-screen gap-20 ">
        {/* Todo list Section */}
        <section className=" row-span-3  flex flex-col  items-center border-m rounded-3xl bg-[#f3f3f3]/80 backdrop-blur-md">
          <div className="basis-0 p-12  flex items-center justify-between w-full border-b-2">
            <div className="text-[#1b2952] font-bold">
              <span>Task List </span>
              {todoList.length > 0 && (
                <span className="text-[#4c4f53] font-light">
                  ({todoList.length > 1 ? todoList.length + " tasks" : todoList.length + " task"})
                </span>
              )}
            </div>

            <div className="text-white w-1/6 flex items-center justify-between">
              <button>
                <img src={search} alt="search" />
              </button>

              <button>
                <img src={menu} alt="menu" />
              </button>
            </div>
          </div>

          {/* Todo List view */}
          <div className="basis-4/4 py-20 w-full h-full text-white flex  border-b-2  flex-wrap overflow-auto">
            {todoList.length > 0 ? (
              <TaskList todoList={todoList} setTodoList={handleCheckboxChange} />
            ) : (
              <EmptyList />
            )}
          </div>

          {/* Add task button */}
          <button
            onClick={handleShowForm}
            className="basis-0 flex items-center justify-between gap-8 p-24">
            <img src={add} alt="add" />
            <span className="text-20 text-[#1b2952] font-bold">Add Task</span>
          </button>
        </section>

        <section className="row-span-3 grid grid-rows-3  gap-20">
          <PomoDoroStatus
            todoList={todoList}
            completedTodos={completedTodos}
            completedPercentage={completedPercentage}
          />
          <PomodoroTimer />
        </section>
      </div>
    </>
  );
}

function TaskList({
  todoList,
  setTodoList,
}: {
  todoList: todoArray;
  setTodoList: (id: number) => void;
}) {
  return (
    <ul className="flex flex-col gap-12 w-full">
      {todoList.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center p-8 justify-between hover:bg-gradient-to-r from-violet-100/20 from-20% via-violet-200 via-30% to-transparent to-100%">
          <div className="flex items-center">
            <input
              onChange={setTodoList.bind(null, todo.id)}
              className="appearance-none"
              type="checkbox"
              id={`${todo.todoName}-checkbox-${todo.id}`}
            />
            <label htmlFor={`${todo.todoName}-checkbox-${todo.id}`} className="custom-checkbox">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-check">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </label>
          </div>

          <div className="bg-white rounded-md py-8">
            <img src={todo.category.src} />
          </div>

          <div className="flex mx-20 w-full flex-col self-start ">
            <span
              className="font-bold text-[#1b2952]"
              style={{
                textDecoration: `${todo.isCompleted ? "line-through" : "none"}`,
                color: `${todo.isCompleted ? "gray" : "#1b2952"}`,
              }}>
              {todo.todoName}
            </span>
            <span className="text-[#1b2952]">
              {todo.isCompleted ? "Done" : `session ${todo.currentSession}/ ${todo.totalSession}`}
            </span>
          </div>
          <span className="self-end text-[gray] w-1/4 ">At {todo.time}</span>
        </li>
      ))}
    </ul>
  );
}

function EmptyList() {
  return (
    <div className="w-full h-full rounded-2xl flex flex-col justify-center gap-20  items-center">
      <div className="flex flex-col items-center justify-center w-80 h-80 bg-white rounded-2xl">
        <img src={folder} alt="folder-icon" />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[#1b2952] font-bold text-20">No Tasks</span>
        <span className="text-zinc-600  text-10">Add some task to the list.</span>
      </div>
    </div>
  );
}

function TaskForm({ showForm, todoList }: { showForm: () => void; todoList: todoArray }) {
  const [session, setSession] = useState<number>(0);
  const [notesOpen, setNotesOpen] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [icon, setIcon] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      category: { src: icon, name: "Work" },
      todoName: taskName,
      isCompleted: false,
      currentSession: 1,
      description: description,
      totalSession: session,
      time: new Date().toLocaleTimeString(),
    };
    todoList.push(newTask);
    localStorage.setItem("todos", JSON.stringify(todoList));
    showForm();
  }

  function handlePlus() {
    setSession((prev) => prev + 1);
  }

  function handleMinus() {
    setSession((prev) => (prev > 0 ? prev - 1 : 0));
  }

  return (
    <section className="absolute w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
      <form
        onSubmit={handleSubmit}
        className="w-2/5 h-3/5 bg-white rounded-3xl overflow-clip flex flex-col gap-20">
        {/* Input for task */}
        <div className="flex flex-col w-full h-100 p-22 focus:outline-none font-bold gap-20 bg-[#fefaf9]">
          <input
            className="text-20 outline-none bg-[#fefaf9]"
            type="text"
            placeholder="Enter Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          {taskName.length < 1 && (
            <span className="flex items-center gap-8 text-red-600 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-exclamation-circle"
                viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
              </svg>
              Title cannot be empty
            </span>
          )}
        </div>
        {/* Section for category */}
        <div className="flex flex-col gap-8 p-8">
          <span className="p-12">Select Category</span>
          <div className="flex justify-around">
            {categories.map((category, index) => (
              <button
                type="button"
                onClick={() => setIcon(category.src)}
                className="w-80 h-fit bg-zinc-400/20 rounded-md p-4 focus:outline-none focus:ring focus:ring-green-500 "
                key={index}>
                <img src={category.src} />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Session setter */}
        <div className="w-full flex items-center justify-between p-20">
          <span>Total Sessions</span>
          <div className="w-1/5 bg-zinc-200 rounded-2xl p-2 flex items-center justify-around">
            <button type="button" onClick={handleMinus}>
              <img src={minus} />
            </button>
            <span className="bg-white w-40 text-center p-4 rounded-3xl">{session}</span>
            <button type="button" onClick={handlePlus}>
              <img src={plus} />
            </button>
          </div>
        </div>

        {/* Task Description */}
        <div className="p-20 h-1/5 flex items-center">
          <span
            className="flex gap-8 items-center"
            style={{ display: `${notesOpen ? "none" : "flex"}` }}>
            Add Notes
            <button
              type="button"
              onClick={() => setNotesOpen(!notesOpen)}
              className="bg-zinc-200 flex items-center justify-center rounded-full w-40 h-40">
              <img src={plus} />
            </button>
          </span>
          <div
            className="relative w-full"
            style={{
              display: `${notesOpen ? "inline-block" : "none"}`,
            }}>
            <textarea
              className="w-full h-fit resize-none p-20 border-2 rounded-md break-word"
              placeholder="Enter Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setNotesOpen(false)}
              className="absolute right-20 top-10 rounded-full bg-zinc-400 w-20 h-20 flex items-center justify-center p-2">
              <img src={close} />
            </button>
          </div>
        </div>

        {/* Button container*/}
        <div className="w-full flex items-center justify-center border-t-2 gap-20 p-12 ">
          <button onClick={() => showForm()} className="w-1/5 bg-zinc-400 p-12 rounded-3xl ">
            Cancel
          </button>
          <button className="w-1/5 bg-green-500 p-12 rounded-3xl">Add Task</button>
        </div>
      </form>
    </section>
  );
}

function PomoDoroStatus({
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

function PomodoroTimer() {
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
    <div className="row-span-2 bg-[#f3f3f3]/80  backdrop-blur-md flex flex-col justify-around flex items-center justify-between rounded-3xl">
      <div className="flex w-6/12  bg-[#d7ddeb]/60 h-45  rounded-3xl justify-between">
        <button className="w-3/4 flex items-center justify-center  gap-2 rounded-3xl bg-white ">
          <img src={timer} alt="timer" />
          <span>Ongoing</span>
        </button>
        <button className="w-2/3 flex items-center justify-center gap-2 rounded-3xl">
          <img src={coffe} alt="cofee" />
          <span> Break</span>
        </button>
      </div>

      <div className="flex flex-col h-200 w-2/4  text-center justify-between">
        <span
          onClick={() => setShowForm((show) => !show)}
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
            onChange={(e) => setPomoduration(Number(e.target.value))}
          />
          <button className="border-2 rounded-md ml-4 p-4 bg-green-500">Enter</button>
        </form>
        <div className="bg-white h-2.5 rounded-3xl">
          <div className="bg-green-400 h-full rounded-full" style={{ width: `${percentage}%` }}>
            &nbsp;
          </div>
        </div>
      </div>

      <span className="w-3/4 text-center text-[#1b2952] font-bold bg-[#B3BBC4]/60 p-8 rounded-md">
        Learn How to use grid
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
          onClick={() => setPomoStatus((status) => (status === "paused" ? "play" : "paused"))}
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
