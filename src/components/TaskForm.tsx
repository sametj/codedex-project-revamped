import { useState } from "react";

import folder from "@/assets/folder-open-fill.svg";
import plus from "@/assets/plus.svg";
import minus from "@/assets/minus.svg";
import close from "@/assets/x-light.svg";
import briefcase from "@/assets/briefcase-fill.svg";
import controller from "@/assets/game-controller-fill.svg";
import food from "@/assets/bread-fill.svg";
import book from "@/assets/book-bookmark-fill.svg";
import sport from "@/assets/barbell-fill.svg";

import { todoArray } from "@/types";

import constants from "@/constants";

const categories = [
  { src: briefcase, name: "Work" },
  { src: controller, name: "Play" },
  { src: food, name: "Food" },
  { src: book, name: "Learn" },
  { src: sport, name: "Sport" },
  { src: folder, name: "Others" },
];

export default function TaskForm({
  showForm,
  todoList,
  activeTaskId,
}: {
  activeTaskId: number | null;
  showForm: () => void;
  todoList: todoArray;
}) {
  const [session, setSession] = useState<number>(1);
  const [notesOpen, setNotesOpen] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [taskDuration, setTaskDuration] = useState<number>(
    constants.defaultPomoDuration,
  );
  const [taskBreak, setTaskBreak] = useState<number>(
    constants.defaultBreakDuration,
  );
  const [icon, setIcon] = useState<string>("");

  function updateFormValue() {
    if (activeTaskId) {
      const updatedTask = todoList.find((item) => item.id === activeTaskId);
      if (!updatedTask) {
        throw new Error("Task not found");
      }

      setTaskName(updatedTask.todoName);
      setIcon(updatedTask.category.src);
      setTaskDuration(Number(updatedTask.pomoDuration));
      setTaskBreak(Number(updatedTask.breakDuration));
      setDescription(String(updatedTask.description));
      setSession(updatedTask.totalSession);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (activeTaskId) {
      editTask();
    } else {
      const newTask = {
        id: Date.now(),
        category: { src: icon },
        todoName: taskName,
        isCompleted: false,
        currentSession: 1,
        pomoDuration: taskDuration,
        breakDuration: taskBreak,
        description: description,
        totalSession: session,
        time: new Date().toLocaleTimeString(),
      };
      if (taskName.length < 1) {
        return;
      }
      todoList.push(newTask);
      localStorage.setItem("todos", JSON.stringify(todoList));

      showForm();
    }
    clearForm();
  }

  function clearForm() {
    setTaskName("");
    setIcon("");
    setTaskDuration(25);
    setTaskBreak(5);
    setDescription("");
    setSession(1);
  }

  function editTask() {
    const updatedTask = todoList.find((item) => item.id === activeTaskId);
    if (!updatedTask) {
      throw new Error("Task not found");
    }
    updatedTask.category.src = icon;
    updatedTask.pomoDuration = taskDuration;
    updatedTask.breakDuration = taskBreak;
    updatedTask.description = description;
    updatedTask.totalSession = session;

    localStorage.setItem("todos", JSON.stringify(todoList));
    showForm();
  }

  function handlePlus() {
    setSession((prev) => prev + 1);
  }

  function handleMinus() {
    setSession((prev) => (prev > 1 ? prev - 1 : 1));
  }

  return (
    <section className="absolute z-10 flex h-full w-full items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onLoad={updateFormValue}
        onAbort={clearForm}
        onSubmit={handleSubmit}
        className="flex h-fit w-2/5 flex-col gap-20 overflow-clip rounded-3xl bg-white"
      >
        {/* Input for task */}
        <div className="flex h-100 w-full flex-col gap-20 bg-[#fefaf9] p-22 font-bold focus:outline-none">
          <input
            className="bg-[#fefaf9] text-20 outline-none"
            type="text"
            placeholder="Enter Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          {taskName.length < 1 && (
            <span className="flex items-center gap-8 text-xs text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-exclamation-circle"
                viewBox="0 0 16 16"
              >
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
                className="h-fit w-80 rounded-md bg-zinc-400/20 p-4"
                style={{
                  outline: `${icon === category.src ? "2px solid #22c55e" : "none"}`,
                }}
                key={index}
              >
                <img src={category.src} />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Session setter */}
        <div className="flex w-full items-center justify-between p-20">
          <span>Total Sessions</span>
          <div className="flex w-1/5 items-center justify-around rounded-2xl bg-zinc-200 p-2">
            <button type="button" onClick={handleMinus}>
              <img src={minus} />
            </button>
            <span className="w-40 rounded-3xl bg-white p-4 text-center">
              {session}
            </span>
            <button type="button" onClick={handlePlus}>
              <img src={plus} />
            </button>
          </div>
        </div>

        <div className="flex h-fit w-full items-center gap-20 p-20">
          <div className="flex gap-4">
            <span className=""> Enter Focus Duration:</span>
            <select
              onChange={(e) => setTaskDuration(Number(e.target.value))}
              className="rounded-md border-2"
              name="pomoDuration"
              value={taskDuration}
            >
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="35">35</option>
              <option value="40">40</option>
              <option value="45">45</option>
              <option value="50">50</option>
              <option value="55">55</option>
              <option value="60">60</option>
            </select>
          </div>
          <div className="flex gap-4">
            <span> Enter Break Duration:</span>
            <select
              onChange={(e) => setTaskBreak(Number(e.target.value))}
              className="rounded-md border-2"
              name="break"
              value={taskBreak}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
        </div>

        {/* Task Description */}
        <div className="flex h-1/5 items-center p-20">
          <span
            className="flex items-center gap-8"
            style={{ display: `${notesOpen ? "none" : "flex"}` }}
          >
            Add Notes
            <button
              type="button"
              onClick={() => setNotesOpen(!notesOpen)}
              className="flex h-40 w-40 items-center justify-center rounded-full bg-zinc-200"
            >
              <img src={plus} />
            </button>
          </span>

          <div
            className="relative w-full"
            style={{
              display: `${notesOpen ? "inline-block" : "none"}`,
            }}
          >
            <textarea
              className="break-word h-fit w-full resize-none rounded-md border-2 p-20"
              placeholder="Enter Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setNotesOpen(false)}
              className="absolute right-20 top-10 flex h-20 w-20 items-center justify-center rounded-full bg-red-400 p-2"
            >
              <img src={close} />
            </button>
          </div>
        </div>

        {/* Button container*/}
        <div className="flex w-full items-center justify-center gap-20 border-t-2 p-12">
          <button
            onClick={showForm}
            className="w-1/5 rounded-3xl bg-red-400 p-12 text-white"
          >
            Cancel
          </button>
          <button className="w-1/5 rounded-3xl bg-green-500 p-12 text-white">
            {activeTaskId ? "Save" : "Add Task"}
          </button>
        </div>
      </form>
    </section>
  );
}
