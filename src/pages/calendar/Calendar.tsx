import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores";
import { toast } from "react-toastify";
import PomodoroTimer from "../../components/Pomodoro";
import { ITask } from "../../types/task";
import { taskService } from "../../services";

export const CalendarPage = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<ITask> | null>(null);
  const { accessToken, userId } = useAuthStore();
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handleTimerStateChange = (isRunning: boolean) => {
    setIsTimerRunning(isRunning);
  };
  const closeModal = () => {
    if (!isTimerRunning) {
      setShowModal(false);
      setIsTimerRunning(false);
    }
  };
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
      const data = await taskService.fetchTasks(userId);
      setTasks(data);
      toast.dismiss();
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  const handleEventDrop = async (eventInfo: any) => {
    const taskId = eventInfo.event.id;
    const newStart = eventInfo.event.start;
    const newEnd = eventInfo.event.end || newStart;

    try {
      const updatedStatus = newStart && newStart < new Date() ? "Expired" : "Todo";
      await taskService.updateTask(taskId, {
        opened_at: newStart.toISOString(),
        dued_at: newEnd.toISOString(),
        status: updatedStatus,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      eventInfo.revert();
    }
  };

  const handleEventClick = (eventInfo: any) => {
    const event = eventInfo.event;
  
    setSelectedTask({
      id: event.id,
      name: event.title,
      opened_at: event.extendedProps.opened_at,
      dued_at: event.extendedProps.dued_at,
      priority: event.extendedProps.priority,
      status: event.extendedProps.status,
      createdBy: event.extendedProps.createdBy,
      description: event.extendedProps.description,
      created_at: event.extendedProps.created_at,
      updated_at: event.extendedProps.updated_at,
    });
  
    setShowModal(true);
  };
  

  const onCompleteTask = async (type: string) => {
    switch(type) {
      case 'complete':
        if (!selectedTask || !selectedTask.id) return;
        try {
          toast.info("Updating task...");

          // Check if the task is done (based on your specific conditions)
          if (selectedTask.status !== "Completed") {
            selectedTask.status = "Completed";
          }

          // Remove unnecessary fields before updating
          const { id, createdBy, created_at, updated_at, ...formattedTask } =
            selectedTask;
          await taskService.updateTask(selectedTask.id, formattedTask);

          loadTasks();
          toast.success("Task updated successfully");
          setShowModal(false);
        } catch (error) {
          console.error("Error updating task:", error);
          toast.error("Failed to update task");
        }
        break;
      case '0_time_left_work':
        toast.info("Out of time for work session, you can start a break");
        break;
      case '0_time_left_break':
        toast.info("Out of time for break session, you can focus on task");
        break;
      default:
        break;
    }
    
  };

  const taskEvents: EventInput[] = tasks.map((task) => ({
    id: task.id,
    title: task.name,
    start: task.opened_at || new Date().toISOString(),
    end: task.dued_at || new Date().toISOString(),
    backgroundColor: getStatusColor(task.status),
    borderColor: getStatusColor(task.status),
    extendedProps: {
      createdBy: task.createdBy,
      description: task.description,
      priority: task.priority,
      status: task.status,
      opened_at: task.opened_at,
      dued_at: task.dued_at,
      created_at: task.created_at,
      updated_at: task.updated_at,
    },
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
  };

  return (
    <div className="min-h-full bg-gray-200 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Calendar View</h1>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-gray-500 mr-2"></span>
              <span>Expired</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-orange-400 mr-2"></span>
              <span>Todo</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 mr-2"></span>
              <span>In Progress</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 mr-2"></span>
              <span>Completed</span>
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
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
        />
        {showModal && (
          <div
            onClick={closeModal}
            className="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-1/4 z-30 text-center items-center justify-center p-6 rounded shadow"
            >
              <PomodoroTimer
                selectedTask={selectedTask}
                onTimerStateChange={handleTimerStateChange}
                onCompleteTask={onCompleteTask}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
