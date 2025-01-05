import { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { toast } from "react-toastify";
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
  const { tasks, isLoading, fetchTasks, updateTask } = useTasks({ showToast: false });

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, []);

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
      } else {
        await updateTask(taskId, {
          opened_at: newStart.toISOString(),
          dued_at: newEnd.toISOString(),
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

  // Handle task completion
  const handleTaskEvent = useCallback(async (type: string) => {
    if (!selectedTask?.id) return;

    switch (type) {
      case '0_time_left_work':
        toast.info("Out of time for Work session, you can start a Break");
        break;
      case '0_time_left_break':
        toast.info("Out of time for Break session, you can focus on Task");
        break;
      case 'mark_in_progress':
        await fetchTasks(); // Refresh tasks after Mark as In Progress
        break;
      case 'mark_as_completed':
        await fetchTasks(); // Refresh tasks after Mark as Completed
        break;
    }
  }, [selectedTask, fetchTasks]);

  return (
    <div className="p-6">
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
            weekNumbers
            displayEventTime={false}
            timeZone="UTC"
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

      {/* Pomodoro Modal */}
      <Modal
        isOpen={showPomodoroModal}
        onClose={() => {
          setShowPomodoroModal(false);
          setSelectedTask(null);
        }}
        title=""
        hideFooter
        hideTitle
        containerClassName="!max-w-4xl"
        preventCloseOnOutsideClick={isTimerRunning}
      >
        <PomodoroTimer
          selectedTask={selectedTask}
          isRunning={isTimerRunning}
          setIsRunning={setIsTimerRunning}
          onTaskEventChange={handleTaskEvent}
        />
      </Modal>
    </div>
  );
}
