import { useEffect, useState } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import TaskForm from "./components/TaskForm";
import PomoDoroStatus from "./components/PomodoroStatus";
import TaskList from "./components/TaskList";

import { todo, todoArray } from "@/types";

export default function App() {
  const [activeTask, setActiveTask] = useState<todo | null>(null);
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [todoList, setTodoList] = useState<todoArray>([]);
  const [pomoDuration, setPomoDuration] = useState<number>(25);
  const [breakDuration, setBreakDuration] = useState<number>(5);

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

  function handlePomoDuration(duration: number) {
    setPomoDuration(duration);
  }

  function handleBreakDuration(duration: number) {
    setBreakDuration(duration);
  }

  function handleActiveTask(task: todo) {
    setActiveTask(task);
  }

  function handleSetTodoList(newTodoList: todoArray) {
    setTodoList(newTodoList);
  }

  return (
    <>
      {showTaskForm && <TaskForm todoList={todoList} showForm={handleShowForm} />}
      <div className="container mx-auto grid grid-cols-2 grid-rows-3  px-100 py-100 h-screen gap-20 ">
        <TaskList
          activeTask={activeTask}
          setActiveTask={handleActiveTask}
          setPomoDuration={handlePomoDuration}
          setBreakDuration={handleBreakDuration}
          todoList={todoList}
          showForm={handleShowForm}
          checkboxChange={handleCheckboxChange}
        />

        <section className="row-span-3 grid grid-rows-3  gap-20">
          <PomoDoroStatus
            todoList={todoList}
            completedTodos={completedTodos}
            completedPercentage={completedPercentage}
          />
          <PomodoroTimer
            todoList={todoList}
            activeTask={activeTask}
            pomoDuration={pomoDuration}
            breakDuration={breakDuration}
            setPomoDuration={handlePomoDuration}
            setBreakDuration={handleBreakDuration}
            setTodoList={handleSetTodoList}
          />
        </section>
      </div>
    </>
  );
}
