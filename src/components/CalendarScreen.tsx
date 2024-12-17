import { useState, useEffect } from "react";
import { fetchTasks, updateTask } from "../services/task";
import useAuthStore from "../stores/authStore";
import { ITask } from "../types/task";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

export const CalendarScreen = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const { accessToken, userId } = useAuthStore();

  useEffect(() => {
    if (userId && accessToken) {
      loadTasks();
    }
  }, [userId, accessToken]);

  const loadTasks = async () => {
    if (userId == null) {
      return;
    }
    try {
      toast.info("Loading tasks...");
      const data = await fetchTasks(userId);
      setTasks(data);
      toast.dismiss();
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast.error("Failed to load tasks.");
    }
  };

  const handleEventDrop = async (eventInfo: any) => {
    const taskId = eventInfo.event.id;
    const newStart = eventInfo.event.start;
    const newEnd = eventInfo.event.end || newStart;

    try {
      const updatedStatus = newStart && newStart < new Date() ? "Expired" : "Todo";
      await updateTask(taskId, {
        opened_at: newStart.toISOString(),
        dued_at: newEnd.toISOString(),
        status: updatedStatus,
      });
      toast.success("Task updated successfully.");
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
      eventInfo.revert();
    }
  };

  const taskEvents: EventInput[] = tasks.map((task) => ({
    id: task.id,
    title: task.name,
    start: task.opened_at || new Date().toISOString(),
    end: task.dued_at || new Date().toISOString(),
    backgroundColor: getStatusColor(task.status),
    borderColor: getStatusColor(task.status),
  }));

  function getStatusColor(status: string) {
    switch (status) {
      case "Expired":
        return "#6b7280";
      case "Todo":
        return "#fb923c";
      case "In Progress":
        return "#3b82f6";
      case "Completed":
        return "#22c55e";
      default:
        return "lightgray";
    }
  }

  return (
    <div className="min-h-full bg-gray-200 p-6">
      <ToastContainer />
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Calendar View</h1>
          {/* Chú thích màu sắc */}
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-gray-500 mr-2"></span> <span>Expired</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-orange-400 mr-2"></span> <span>Todo</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 mr-2"></span> <span>In Progress</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 mr-2"></span> <span>Completed</span>
            </div>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          droppable={true}
          events={taskEvents}
          eventDrop={handleEventDrop}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
        />
      </div>
    </div>
  );
};
