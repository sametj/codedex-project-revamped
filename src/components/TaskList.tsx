import { todo, todoArray } from "@/types";

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
}: {
  todoList: todoArray;
  activeTaskId: number | null;
  showForm: () => void;
  activateTask: (id:number) => void,
  checkboxChange: (id: number) => void;
}) {
  const activeTask = todoList.find(item => item.id === activeTaskId) || null

  return (
    <>
      <section className=" row-span-3  flex flex-col  items-center border-m rounded-3xl bg-[#f3f3f3]/60 backdrop-blur-md">
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
            <Tasks
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
        <button onClick={showForm} className="basis-0 flex items-center justify-between gap-8 p-24">
          <img src={add} alt="add" />
          <span className="text-20 text-[#1b2952] font-bold">Add Task</span>
        </button>
      </section>
    </>
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

function Tasks({
  todoList,
  activeTask,
  setTodoList,
  activateTask,
}: {
  todoList: todoArray;
  activeTask: todo | null;
  setTodoList: (id: number) => void;
  activateTask: (id:number) => void;
}) {
  return (
    <div className="flex flex-col gap-12 w-full">
      {todoList.map((todo) => (
        <Task
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
}: {
  todo: todo;
  activeTask: todo | null;
  activateTask: (id:number) => void;
  setTodoList: (id: number) => void;
}) {
  return (
    <li
      onClick={() => activateTask(todo.id)}
      key={todo.id}
      className=" relative flex items-center p-8 justify-between hover:bg-gradient-to-r from-violet-100/20 from-20% via-violet-200 via-30% to-transparent to-100%">
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
          }}>
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
      <span className=" text-[gray] w-2/4 ">At {todo.time}</span>
      <button className="flex  items-center justify-center p-2">
        <img src={menu} alt="Edit icon" />
      </button>
      {activeTask?.id === todo.id && (
        <EditMenu>
          <button className="flex gap-8 p-4 items-center">
            <img src={editIcon} />
            Edit
          </button>
          <button className="flex gap-8 p-4 items-center">
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
    <div className="absolute top-45 right-15 bg-white divide-y w-fit h-fit text-black p-8 flex flex-col gap-8  rounded-md z-10">
      {children}
    </div>
  );
}
