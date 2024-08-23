export type todo = {
  id: number;
  category: { src: string };
  todoName: string;
  isCompleted: boolean;
  pomoDuration?: number;
  breakDuration?: number;
  currentSession: number;
  totalSession: number;
  time: string;
};

export type todoArray = todo[];
