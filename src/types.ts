export type todo = {
  id: number;
  category: { src: string; name: string };
  todoName: string;
  isCompleted: boolean;
  session: number;
  time: string;
};

export type todoArray = todo[];
