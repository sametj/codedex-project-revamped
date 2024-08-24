import { todo, todoArray } from "@/types";
import { useState } from "react";

import search from "@/assets/magnifying-glass.svg";
import add from "@/assets/plus-circle-fill.svg";
import menu from "@/assets/dots-three-outline-vertical-fill.svg";
import folder from "@/assets/folder-open-fill.svg";
import editIcon from "@/assets/pencil-simple-line-fill.svg";
import deleteIcon from "@/assets/trash-fill.svg";

export default function TaskList({
  todoList,
  activeTaskId,
  showForm,
  checkboxChange,
  activateTask,
  deleteTask,
}: {
  todoList: todoArray;
  activeTaskId: number | null;
  showForm: () => void;
  activateTask: (id: number) => void;
  deleteTask: (id: number) => void;
  checkboxChange: (id: number) => void;
}) {
  const activeTask = todoList.find((item) => item.id === activeTaskId) || null;

  return (
    <>
      <section className="border-m row-span-3 flex flex-col items-center rounded-3xl bg-[#f3f3f3]/60 backdrop-blur-md">
        <div className="flex w-full basis-0 items-center justify-between border-b-2 p-12">
          <div className="font-bold text-[#1b2952]">
            <span>Task List </span>
            {todoList.length > 0 && (
              <span className="font-light text-[#4c4f53]">
                (
                {todoList.length > 1
                  ? todoList.length + " tasks"
                  : todoList.length + " task"}
                )
              </span>
            )}
          </div>

          <div className="flex w-1/6 items-center justify-between text-white">
            <button>
              <img src={search} alt="search" />
            </button>

            <button>
              <img src={menu} alt="menu" />
            </button>
          </div>
        </div>

        {/* Todo List view */}
        <div className="basis-4/4 flex h-full w-full flex-wrap overflow-auto border-b-2 py-20 text-white">
          {todoList.length > 0 ? (
            <Tasks
              showForm={showForm}
              deleteTask={deleteTask}
              todoList={todoList}
              activeTask={activeTask}
              setTodoList={checkboxChange}
              activateTask={activateTask}
            />
          ) : (
            <EmptyList />
          )}
        </div>

        {/* Add task button */}
        <button
          onClick={showForm}
          className="flex basis-0 items-center justify-between gap-8 p-24"
        >
          <img src={add} alt="add" />
          <span className="text-20 font-bold text-[#1b2952]">Add Task</span>
        </button>
      </section>
    </>
  );
}

function EmptyList() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-20 rounded-2xl">
      <div className="flex h-80 w-80 flex-col items-center justify-center rounded-2xl bg-white">
        <img src={folder} alt="folder-icon" />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-20 font-bold text-[#1b2952]">No Tasks</span>
        <span className="text-10 text-zinc-600">
          Add some task to the list.
        </span>
      </div>
    </div>
  );
}

function Tasks({
  todoList,
  activeTask,
  deleteTask,
  setTodoList,
  activateTask,
  showForm,
}: {
  todoList: todoArray;
  activeTask: todo | null;
  showForm: () => void;
  deleteTask: (id: number) => void;
  setTodoList: (id: number) => void;
  activateTask: (id: number) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-12">
      {todoList.map((todo) => (
        <Task
          showForm={showForm}
          deleteTask={deleteTask}
          key={todo.id}
          todo={todo}
          activeTask={activeTask}
          activateTask={activateTask}
          setTodoList={setTodoList}
        />
      ))}
    </div>
  );
}

function Task({
  todo,
  activeTask,
  setTodoList,
  activateTask,
  deleteTask,
  showForm,
}: {
  todo: todo;
  activeTask: todo | null;
  deleteTask: (id: number) => void;
  showForm: () => void;
  activateTask: (id: number) => void;
  setTodoList: (id: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  function handleClick(funtionType: string, todoId: number) {
    if (funtionType === "delete") {
      deleteTask(todoId);
      setShowMenu(!showMenu);
    }
    if (funtionType === "edit") {
      showForm();
      activateTask(todoId);
      setShowMenu(!showMenu);
    }
  }

  return (
    <li
      onClickCapture={() => activateTask(todo.id)}
      key={todo.id}
      className="relative flex items-center justify-between from-violet-100/20 from-20% via-violet-200 via-30% to-transparent to-100% p-8 hover:bg-gradient-to-r"
    >
      <div className="flex items-center">
        <input
          checked={todo.isCompleted}
          onChange={() => setTodoList(todo.id)}
          className="appearance-none"
          type="checkbox"
          id={`${todo.todoName}-checkbox-${todo.id}`}
        />
        <label
          htmlFor={`${todo.todoName}-checkbox-${todo.id}`}
          className="custom-checkbox"
          style={{
            border: `${activeTask?.id === todo.id ? "2px solid #1b2952" : "2px solid #B3BBC4"}`,
            borderColor: `${activeTask?.id === todo.id ? "#1b2952" : "#B3BBC4"}`,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-check"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </label>
      </div>

      <div className="rounded-md bg-white py-8">
        <img src={todo.category.src} />
      </div>

      <div className="mx-20 flex w-full flex-col self-start">
        <span
          className="font-bold text-[#1b2952]"
          style={{
            textDecoration: `${todo.isCompleted ? "line-through" : "none"}`,
            color: `${todo.isCompleted ? "gray" : "#1b2952"}`,
          }}
        >
          {todo.todoName}
        </span>
        <span className="text-[#1b2952]">
          {todo.isCompleted
            ? "Done"
            : `session ${todo.currentSession}/ ${todo.totalSession}`}
        </span>
      </div>
      <span className="w-2/4 text-[gray]">At {todo.time}</span>
      <button
        onClick={() => setShowMenu((menu) => !menu)}
        className="flex items-center justify-center p-2"
      >
        <img src={menu} alt="Edit icon" />
      </button>
      {showMenu && (
        <EditMenu>
          <button
            onClick={() => handleClick("edit", todo.id)}
            className="flex items-center gap-8 p-4"
          >
            <img src={editIcon} />
            Edit
          </button>
          <button
            onClick={() => handleClick("delete", todo.id)}
            className="flex items-center gap-8 p-4"
          >
            <img src={deleteIcon} />
            Delete
          </button>
        </EditMenu>
      )}
    </li>
  );
}

function EditMenu({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute right-15 top-45 z-10 flex h-fit w-fit flex-col gap-8 divide-y rounded-md bg-white p-8 text-black">
      {children}
    </div>
  );
}
