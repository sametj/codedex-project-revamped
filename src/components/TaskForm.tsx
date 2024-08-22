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
import error from "@/assets/error.svg";

import { todoArray } from "@/types";

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
}: {
  showForm: () => void;
  todoList: todoArray;
}) {
  const [session, setSession] = useState<number>(1);
  const [notesOpen, setNotesOpen] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [taskDuration, setTaskDuration] = useState<number>(25);
  const [taskBreak, setTaskBreak] = useState<number>(5);
  const [icon, setIcon] = useState<string>("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

  function handlePlus() {
    setSession((prev) => prev + 1);
  }

  function handleMinus() {
    setSession((prev) => (prev > 1 ? prev - 1 : 1));
  }

  return (
    <section className="absolute w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
      <form
        onSubmit={handleSubmit}
        className="w-2/5 h-fit bg-white rounded-3xl overflow-clip flex flex-col gap-20">
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
                className="w-80 h-fit bg-zinc-400/20 rounded-md p-4"
                style={{
                  outline: `${icon === category.src ? "2px solid #22c55e" : "none"}`,
                }}
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

        <div className="w-full h-fit flex items-center gap-20 p-20">
          <div className="flex gap-4">
            <span className=""> Enter Focus Duration:</span>
            <select
              onChange={(e) => setTaskDuration(Number(e.target.value))}
              className="border-2 rounded-md"
              name="pomoDuration">
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
              className="border-2 rounded-md"
              name="break">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
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
              className="absolute right-20 top-10 rounded-full bg-red-400 w-20 h-20 flex items-center justify-center p-2">
              <img src={close} />
            </button>
          </div>
        </div>

        {/* Button container*/}
        <div className="w-full flex items-center justify-center border-t-2 gap-20 p-12 ">
          <button
            onClick={() => showForm()}
            className="w-1/5 bg-red-400 p-12 text-white rounded-3xl ">
            Cancel
          </button>
          <button className="w-1/5 bg-green-500 p-12 rounded-3xl text-white">Add Task</button>
        </div>
      </form>
    </section>
  );
}
