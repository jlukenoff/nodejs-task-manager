import React from "react";
import { Dialog, DialogTitle } from "@headlessui/react";
import { Task, TaskInput } from "./models/Task";
import { listTasks } from "./api/listTasks";
import { createTask } from "./api/createTask";
import { updateTask } from "./api/updateTask";

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTask, setNewTask] = React.useState<TaskInput>({
    title: "",
    content: "",
  });

  React.useEffect(() => {
    listTasks().then((newTasks) => {
      setTasks(newTasks);
    });
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCreateTask = async () => {
    const task = await createTask(newTask);
    setTasks([...tasks, task]);
    setNewTask({ title: "", content: "" });
    closeModal();
  };

  const handleUpdateTask = async (task: Task) => {
    const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(newTasks);
    await updateTask(task);
  };

  console.log(tasks);

  return (
    <div className="flex justify-start items-center h-screen bg-gray-100 flex-col p-8">
      <ul className="w-1/3 mx-auto my-4">
        {tasks
          .sort((a, b) => a.position - b.position)
          .map((task) => (
            <li key={task.id} className="p-2 my-2 bg-gray-200 rounded">
              <input
                type="checkbox"
                className="mr-2"
                checked={task.complete}
                onChange={(e) =>
                  handleUpdateTask({ ...task, complete: e.target.checked })
                }
              />
              <b>{task.title}</b>: {task.content}
              <button
                type="button"
                className="ml-2"
                onClick={() => {
                  if (task.position === 0) {
                    return;
                  }
                  tasks[task.position - 1].position = task.position;
                  handleUpdateTask({
                    ...task,
                    position: task.position - 1,
                  });
                }}
              >
                Up
              </button>
              <button
                type="button"
                className="ml-2"
                onClick={() => {
                  if (task.position === tasks.length - 1) {
                    return;
                  }
                  tasks[task.position + 1].position = task.position;
                  handleUpdateTask({
                    ...task,
                    position: task.position + 1,
                  });
                }}
              >
                Down
              </button>
            </li>
          ))}
      </ul>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create a Task...
      </button>

      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={isOpen}
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Create a task
            </DialogTitle>

            <div className="mt-4">
              <input
                type="text"
                className="w-full p-2 border rounded m-2"
                placeholder="Type your task title..."
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border rounded m-2"
                placeholder="Type your task content..."
                value={newTask.content}
                onChange={(e) =>
                  setNewTask({ ...newTask, content: e.target.value })
                }
              />
              <button
                onClick={handleCreateTask}
                className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded"
              >
                Create
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="w-full px-4 py-2 bg-red-500 text-white rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default App;
