import { useEffect, useState, useCallback, useMemo } from "react";
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
import LoadingIndicator from "react-loading-indicator";
import { getStatusColor } from "../../utils/theme";
import { compareDates, formatDateForComparison } from "../../utils/date";

export default function CalendarPage() {
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<ITask> | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { userId } = useAuthStore();
  const { tasks, isLoading, fetchTasks, updateTask, updateMultipleTasks } = useTasks({ showToast: false });

  // Function to check and update expired tasks
  const checkAndUpdateExpiredTasks = useCallback(async () => {
    const now = new Date();
    const expiredTasks = tasks.reduce<Array<{ id: string; data: { status: typeof STATUS.EXPIRED } }>>((acc, task) => {
      if (
        task.status === STATUS.TODO &&
        task.dued_at &&
        compareDates(formatDateForComparison(task.dued_at || ""), now.toLocaleString('sv-SE').slice(0, 16)) < 0
      ) {
        acc.push({
          id: task.id,
          data: { status: STATUS.EXPIRED }
        });
      }
      return acc;
    }, []);

    if (expiredTasks.length > 0) {
      try {
        await updateMultipleTasks(expiredTasks);
      } catch (error) {
        toast.error('Failed to update expired tasks');
      }
    }
  }, [userId, tasks, updateMultipleTasks]);

  // Effect for initial tasks fetch
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, []);

  // Separate effect for periodic expired tasks check
  useEffect(() => {
    if (!userId || !tasks.length) return;

    const intervalId = setInterval(checkAndUpdateExpiredTasks, 1000);
    return () => clearInterval(intervalId);
  }, [tasks.length, checkAndUpdateExpiredTasks]);

  // Generate events for the calendar
  const taskEvents: EventInput[] = useMemo(() =>
    tasks.map((task) => ({
      id: task.id,
      title: task.name,
      start: task.opened_at || new Date().toISOString(),
      end: task.dued_at || new Date().toISOString(),
      backgroundColor: getStatusColor(task.status),
      borderColor: getStatusColor(task.status),
      extendedProps: {
        ...task
      },
    })),
    [tasks]
  );

  // Handle event drop - update task status
  const handleEventDrop = useCallback(async (eventInfo: any) => {
    const taskId = eventInfo.event.id;
    const newStart = eventInfo.event.start;
    const newEnd = eventInfo.event.end || newStart;
    const currentStatus = eventInfo.event.extendedProps.status;

    try {
      const now = new Date();
      const updateData: Partial<ITask> = {
        opened_at: newStart.toISOString(),
        dued_at: newEnd.toISOString(),
      };

      // Update status based on task timing
      if (currentStatus === STATUS.TODO && compareDates(formatDateForComparison(newEnd.toISOString()), now.toLocaleString('sv-SE').slice(0, 16)) < 0) {
        updateData.status = STATUS.EXPIRED;
      } else if (currentStatus === STATUS.EXPIRED && compareDates(formatDateForComparison(newEnd.toISOString()), now.toLocaleString('sv-SE').slice(0, 16)) >= 0) {
        updateData.status = STATUS.TODO;
      }

      await updateTask(taskId, updateData);
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
      ...event.extendedProps
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
            <span className={`w-4 h-4 rounded-full bg-yellow-500 mr-2`}></span>
            <span>Todo</span>
          </div>
          <div className="flex items-center">
            <span className={`w-4 h-4 rounded-full bg-blue-500 mr-2`}></span>
            <span>In Progress</span>
          </div>
          <div className="flex items-center">
            <span className={`w-4 h-4 rounded-full bg-green-500 mr-2`}></span>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <span className={`w-4 h-4 rounded-full bg-gray-500 mr-2`}></span>
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
