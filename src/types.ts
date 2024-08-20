export type todo = {
  id: number;
  category: { src: string; name: string };
  todoName: string;
  isCompleted: boolean;
  currentSession: number;
  totalSession: number;
  time: string;
};

export type todoArray = todo[];
