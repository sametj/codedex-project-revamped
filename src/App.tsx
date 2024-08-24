import { useState } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import TaskForm from "./components/TaskForm";
import PomoDoroStatus from "./components/PomodoroStatus";
import TaskList from "./components/TaskList";

import constants from "./constants";

import { todoArray } from "@/types";

// Fetching todos from local storage without use effect
function fetchTodos() {
  let todos: todoArray = [];
  try {
    const localStorageTodos = localStorage.getItem("todos");
    if (localStorageTodos) {
      todos = JSON.parse(localStorageTodos);
    }
  } catch (error) {
    console.log(error);
  }
  return todos;
}

export default function App() {
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [todoList, setTodoList] = useState<todoArray>(fetchTodos());
  const [pomoDuration, setPomoDuration] = useState<number>(
    constants.defaultPomoDuration,
  );
  const [breakDuration, setBreakDuration] = useState<number>(
    constants.defaultBreakDuration,
  );
  const [taskFormVisible, setTaskFormVisible] = useState<boolean>(false);

  const completedTodos = todoList.filter((todo) => todo.isCompleted);
  const completedPercentage = (completedTodos.length / todoList.length) * 100;

  function handleShowForm() {
    if (activeTaskId) {
      setActiveTaskId(null);
    }

    setTaskFormVisible((show) => !show);
  }

  function handleCheckboxChange(id: number) {
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );
  }

  function handlePomoDuration(duration: number) {
    setPomoDuration(duration);
  }

  function handleBreakDuration(duration: number) {
    setBreakDuration(duration);
  }

  function incrementSession() {
    if (activeTaskId) {
      const updatedTask = todoList.find((item) => item.id === activeTaskId);

      if (!updatedTask) {
        throw new Error("Task not found");
      }

      updatedTask.currentSession += 0.5;
      updatedTask.isCompleted =
        updatedTask.currentSession === updatedTask.totalSession;

      const newTodoList = todoList.map((item) => {
        if (item.id !== activeTaskId) {
          return item;
        }

        return { ...updatedTask };
      });

      setTodoList(newTodoList);

      localStorage.setItem("todos", JSON.stringify(newTodoList));
    }
  }

  function activateTask(id: number) {
    const task = todoList.find((todo) => todo.id === id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (activeTaskId === task.id) {
      setActiveTaskId(null);
    } else {
      setActiveTaskId(task.id);
      setPomoDuration(task.pomoDuration || constants.defaultPomoDuration);
      setBreakDuration(task.breakDuration || constants.defaultBreakDuration);
    }
  }

  function deleteTask(id: number) {
    const newTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(newTodoList);
    localStorage.setItem("todos", JSON.stringify(newTodoList));
  }

  return (
    <>
      {taskFormVisible && (
        <TaskForm
          todoList={todoList}
          activeTaskId={activeTaskId}
          showForm={handleShowForm}
        />
      )}
      <div className="container mx-auto grid h-screen grid-cols-2 grid-rows-3 gap-20 px-100 py-100">
        <TaskList
          todoList={todoList}
          activeTaskId={activeTaskId}
          activateTask={activateTask}
          deleteTask={deleteTask}
          showForm={handleShowForm}
          checkboxChange={handleCheckboxChange}
        />
        <section className="row-span-3 grid grid-rows-3 gap-20">
          <PomoDoroStatus
            todoList={todoList}
            completedTodos={completedTodos}
            completedPercentage={completedPercentage}
          />

          <PomodoroTimer
            incrementSession={incrementSession}
            todoList={todoList}
            activeTaskId={activeTaskId}
            pomoDuration={pomoDuration}
            breakDuration={breakDuration}
            setPomoDuration={handlePomoDuration}
            setBreakDuration={handleBreakDuration}
          />
        </section>
      </div>
    </>
  );
}
