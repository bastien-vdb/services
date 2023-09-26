export const useLocalStorage = (key: string) => {
  const getItems = () => {
    const tasks = localStorage.getItem(key);
    if (tasks) return JSON.parse(tasks);
  };

  const setItem = (task: string) => {
    let tasks = localStorage.getItem(key);
    let tasksJson = [];
    if (tasks) tasksJson = JSON.parse(tasks);
    localStorage.setItem(key, JSON.stringify([...tasksJson, task]));
  };

  return { getItems, setItem };
};
