import { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { Slide, toast, ToastContainer } from "react-toastify";
import { Modal } from "../../components/ui/Modal";
import { PomodoroTimer } from "../../components/Pomodoro";
import { useTasks } from "../../hooks/useTasks";
import { useAuthStore } from "../../stores";
import { ITask } from "../../types/task";
import { STATUS } from "../../types/common";
import { COLORS } from "../../constants/colors";
import LoadingIndicator from "react-loading-indicator";
import { getStatusColor } from "../../utils/theme";

export default function CalendarPage() {
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<ITask> | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { userId } = useAuthStore();
  const { tasks, isLoading, fetchTasks, updateTask } = useTasks();

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, []);

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

  // Generate events for the calendar
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

  // Handle event drop - update task status
  const handleEventDrop = useCallback(async (eventInfo: any) => {
    const taskId = eventInfo.event.id;
    const newStart = eventInfo.event.start;
    const newEnd = eventInfo.event.end || newStart;
    const currentStatus = eventInfo.event.extendedProps.status;

    try {
      const now = new Date();

      // Update status based on task timing
      if (currentStatus === STATUS.TODO && newEnd < now) {
        await updateTask(taskId, {
          opened_at: newStart.toISOString(),
          dued_at: newEnd.toISOString(),
          status: STATUS.EXPIRED,
        });
      } else if (currentStatus === STATUS.EXPIRED && newStart >= now) {
        await updateTask(taskId, {
          opened_at: newStart.toISOString(),
          dued_at: newEnd.toISOString(),
          status: STATUS.TODO,
        });
      }
    } catch (error) {
      eventInfo.revert();
    }
  }, [updateTask]);

  // Handle event click - open task modal
  const handleEventClick = useCallback((eventInfo: any) => {
    const { event } = eventInfo;
    const taskData = {
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
    };

    setSelectedTask(taskData);
    setShowPomodoroModal(true);
  }, []);


  const onCompleteTask = async (type: string) => {
    switch (type) {
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
        return COLORS.STATUS_EXPIRED;
      case "Todo":
        return COLORS.STATUS_TODO;
      case "In Progress":
        return COLORS.STATUS_IN_PROGRESS;
      case "Completed":
        return COLORS.STATUS_COMPLETED;
      default:
        return "lightgray";
    }
  };

  return (
    <div className="p-6">
      <ToastContainer
        position="top-center"
        autoClose={2345}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
        toastClassName={"w-fit px-5 !min-h-14"}
        closeButton={false}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Calendar View</h1>
        <div className="flex space-x-5">
          <div className="flex items-center">
            <span className={`w-4 h-4 rounded-full bg-[${COLORS.STATUS_TODO}] mr-2`}></span>
            <span>Todo</span>
          </div>
          <div className="flex items-center">
            <span className={`w-4 h-4 rounded-full bg-[${COLORS.STATUS_IN_PROGRESS}] mr-2`}></span>
            <span>In Progress</span>
          </div>
          <div className="flex items-center">
            <span className={`w-4 h-4 rounded-full bg-[${COLORS.STATUS_COMPLETED}] mr-2`}></span>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <span className={`w-4 h-4 rounded-full bg-[${COLORS.STATUS_EXPIRED}] mr-2`}></span>
            <span>Expired</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 px-6 py-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingIndicator />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
