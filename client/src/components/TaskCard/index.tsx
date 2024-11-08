// import { Task } from "@/state/api";
// import { format } from "date-fns";
// import Image from "next/image";
// import React from "react";

// type Props = {
//   task: Task;
// };

// const TaskCard = ({ task }: Props) => {
//   return (
//     <div className="mb-3 rounded bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
//       {task.attachments && task.attachments.length > 0 && (
//         <div>
//           <strong>Attachments:</strong>
//           <div className="flex flex-wrap">
//             {task.attachments && task.attachments.length > 0 && (
//               <Image
//                 src={`/${task.attachments[0].fileURL}`}
//                 alt={task.attachments[0].fileName}
//                 width={200}
//                 height={200}
//                 className="rounded-md"
//               />
//             )}
//           </div>
//         </div>
//       )}
//       <p>
//         <strong>ID:</strong> {task.id}
//       </p>
//       <p>
//         <strong>Title:</strong> {task.title}
//       </p>
//       <p>
//         <strong>Description:</strong>{" "}
//         {task.description || "No description provided"}
//       </p>
//       <p>
//         <strong>Status:</strong> {task.status}
//       </p>
//       <p>
//         <strong>Priority:</strong> {task.priority}
//       </p>
//       <p>
//         <strong>Tags:</strong> {task.tags || "No tags"}
//       </p>
//       <p>
//         <strong>Start Date:</strong>{" "}
//         {task.startDate ? format(new Date(task.startDate), "P") : "Not set"}
//       </p>
//       <p>
//         <strong>Due Date:</strong>{" "}
//         {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}
//       </p>
//       <p>
//         <strong>Author:</strong>{" "}
//         {task.author ? task.author.username : "Unknown"}
//       </p>
//       <p>
//         <strong>Assignee:</strong>{" "}
//         {task.assignee ? task.assignee.username : "Unassigned"}
//       </p>
//     </div>
//   );
// };

// export default TaskCard;
import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { FaUser, FaRegClock, FaRegFlag, FaTags, FaFileAlt, FaTasks } from "react-icons/fa";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  return (
    <div className="mb-4 rounded-lg bg-white p-6 shadow-lg dark:bg-dark-secondary dark:text-white transition duration-300 hover:shadow-xl">
      
      {/* Attachments Section */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4">
          <strong className="text-gray-700 dark:text-gray-300">Attachments:</strong>
          {/* <div className="flex mt-2">
            <Image
              src={`/${task.attachments[0].fileURL}`}
              alt={task.attachments[0].fileName}
              width={200}
              height={200}
              className="rounded-md shadow-md"
            />
          </div> */}
        </div>
      )}

      {/* Title and Description */}
      <div className="mb-2">
        <h3 className="text-xl font-semibold mb-1 dark:text-gray-100">{task.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {task.description || "No description provided"}
        </p>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center space-x-4 mb-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <FaTasks className="mr-1 text-blue-500" />
          <span>Status:</span> <span className="ml-1 font-medium">{task.status}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <FaRegFlag className="mr-1 text-red-500" />
          <span>Priority:</span> <span className="ml-1 font-medium">{task.priority}</span>
        </div>
      </div>

      {/* Tags */}
      {task.tags && (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
          <FaTags className="mr-1 text-green-500" />
          <span>Tags:</span> <span className="ml-1 font-medium">{task.tags}</span>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
        <div className="flex items-center">
          <FaRegClock className="mr-1 text-yellow-500" />
          <span>Start Date:</span>
          <span className="ml-1">{task.startDate ? format(new Date(task.startDate), "P") : "Not set"}</span>
        </div>
        <div className="flex items-center">
          <FaRegClock className="mr-1 text-yellow-500" />
          <span>Due Date:</span>
          <span className="ml-1">{task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}</span>
        </div>
      </div>

      {/* Author and Assignee */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <FaUser className="mr-1 text-purple-500" />
          <span>Author:</span>
          <span className="ml-1 font-medium">{task.author ? task.author.username : "Unknown"}</span>
        </div>
        <div className="flex items-center">
          <FaUser className="mr-1 text-purple-500" />
          <span>Assignee:</span>
          <span className="ml-1 font-medium">{task.assignee ? task.assignee.username : "Unassigned"}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
