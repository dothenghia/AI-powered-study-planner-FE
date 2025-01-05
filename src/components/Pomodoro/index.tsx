import { useState, useEffect, useCallback, useMemo } from "react";
import "./index.css";
import useSaveFocusedTime from "../../hooks/useSaveFocusedTime";
import { ITask } from "../../types/task";
import { PRIORITY, STATUS } from "../../types/common";
import { useTasks } from "../../hooks/useTasks";
import { Button } from "../ui/Button";
import { Play, RotateCcw, Pause, MoveRight, Check, ChartNoAxesGantt } from "lucide-react";
import { formatDate, formatTime } from "../../utils/date";
import { PriorityTag } from "../ui/PriorityTag";
import { StatusTag } from "../ui/StatusTag";

type PomodoroProps = {
  selectedTask: Partial<ITask> | null;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  onTaskEventChange: (type: string) => void;
};

export const PomodoroTimer = ({
  selectedTask,
  isRunning,
  setIsRunning,
  onTaskEventChange
}: PomodoroProps) => {
  const [isWorkSession, setIsWorkSession] = useState(true); // Work Session | Break Session
  const [workDuration] = useState(25); // Default 25 minutes
  const [breakDuration] = useState(5); // Default 5 minutes
  const [totalTime, setTotalTime] = useState(25 * 60); // Total time in seconds of the current session (Default is Work Session)
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Time left in seconds of the current session (Default is Work Session)

  const { updateTask } = useTasks();
  const { saveFocusedTime } = useSaveFocusedTime(selectedTask?.id ?? "");

  // Calculate focused time
  const getFocusedTime = useCallback(() => {
    return isWorkSession ? totalTime - timeLeft : 0;
  }, [isWorkSession, totalTime, timeLeft]);

  // Memoized values
  const taskStatus = useMemo(() => selectedTask?.status, [selectedTask?.status]);
  const isInProgress = taskStatus === STATUS.IN_PROGRESS;
  const isCompleted = taskStatus === STATUS.COMPLETED;

  // Handle task status updates
  const handleStartTask = useCallback(async () => {
    if (!selectedTask?.id) return;

    const success = await updateTask(selectedTask.id, {
      status: STATUS.IN_PROGRESS
    });
    if (success) {
      // Update local state immediately for better UX
      selectedTask.status = STATUS.IN_PROGRESS;
      onTaskEventChange("mark_in_progress");
    }
  }, [selectedTask, updateTask, onTaskEventChange]);

  const handleCompleteTask = useCallback(async () => {
    if (!selectedTask?.id) return;

    const success = await updateTask(selectedTask.id, {
      status: STATUS.COMPLETED
    });
    if (success) {
      // Update local state immediately for better UX
      selectedTask.status = STATUS.COMPLETED;
      onTaskEventChange("mark_as_completed");
    }
  }, [selectedTask, updateTask, onTaskEventChange]);

  // Timer controls
  const toggleTimer = useCallback(() => {
    // Save focused time
    if (isRunning && isWorkSession) {
      const focusedTime = getFocusedTime();
      if (focusedTime > 0) {
        saveFocusedTime(focusedTime);
      }
    }

    // Toggle timer
    setIsRunning(!isRunning);
  }, [isRunning, setIsRunning, isWorkSession, getFocusedTime, saveFocusedTime]);

  // Reset timer
  const resetTimer = useCallback(() => {
    // Save focused time
    if (isRunning && isWorkSession) {
      const focusedTime = getFocusedTime();
      if (focusedTime > 0) {
        saveFocusedTime(focusedTime);
      }
    }
    setIsRunning(false);

    // Reset timer
    const initialTime = isWorkSession ? workDuration * 60 : breakDuration * 60;
    setTimeLeft(initialTime);
    setTotalTime(initialTime);
  }, [isWorkSession, workDuration, breakDuration, setIsRunning, isRunning, getFocusedTime, saveFocusedTime]);

  // Handle session change - switch between work and break sessions, reset timer
  const handleSessionChange = useCallback(() => {
    setIsWorkSession(!isWorkSession);

    // Reset timer
    const newDuration = !isWorkSession ? workDuration : breakDuration;
    setTimeLeft(newDuration * 60);
    setTotalTime(newDuration * 60);
  }, [isWorkSession, workDuration, breakDuration]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    else if (timeLeft === 0) {
      if (isWorkSession) {
        onTaskEventChange?.("0_time_left_work");
      } else {
        onTaskEventChange?.("0_time_left_break");
      }

      // Change session
      handleSessionChange();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWorkSession, workDuration, breakDuration, onTaskEventChange, handleSessionChange]);

  return (
    <div className="flex flex-row items-center justify-center w-full h-full">
      {/* Task Info Section */}
      <div className="flex flex-col items-center justify-center w-1/2 h-full">
        <h1 className="text-3xl font-bold mb-4">{selectedTask?.name}</h1>

        <div className="flex items-center gap-3 mb-4">
          <PriorityTag priority={selectedTask?.priority ?? PRIORITY.LOW} />
          <StatusTag status={selectedTask?.status ?? STATUS.TODO} />
        </div>

        <div className="text-base text-gray-600 text-center mb-4 flex items-center gap-3">
          {formatDate(selectedTask?.opened_at ?? "")} <MoveRight strokeWidth={1.5} /> {formatDate(selectedTask?.dued_at ?? "")}
        </div>

        {/* Start Task Button */}
        <Button
          variant={(isInProgress || isRunning) ? "gray" : "primary"}
          onClick={handleStartTask}
          disabled={isInProgress || isRunning}
          className={`flex items-center gap-2 ${(isInProgress || isRunning) ? "cursor-not-allowed" : "cursor-pointer"} mb-4`}
        >
          <ChartNoAxesGantt className="w-5 h-5" />
          Mark as In Progress
        </Button>

        {/* Complete Task Button */}
        <Button
          variant={(isCompleted || isRunning) ? "gray" : "primary"}
          onClick={handleCompleteTask}
          disabled={isCompleted || isRunning}
          className={`flex items-center gap-2 ${(isCompleted || isRunning) ? "cursor-not-allowed" : "cursor-pointer !bg-green-500 hover:!bg-green-600"}`}
        >
          <Check className="w-5 h-5" />
          Mark as Completed
        </Button>
      </div>

      {/* Timer Section */}
      <div className="min-h-80 my-4 flex flex-col items-center justify-center w-1/2 h-full border-l border-gray-200">
        {/* Switch toggle */}
        <div className="switch-toggle mb-6">
          <input
            type="checkbox"
            id="session-switch"
            className={`switch-toggle-checkbox ${isRunning ? "cursor-not-allowed" : "cursor-pointer"}`}
            checked={isWorkSession}
            onChange={handleSessionChange}
            disabled={isRunning}
          />
          <label className={`switch-toggle-label items-center ${isRunning ? "cursor-not-allowed" : "cursor-pointer"}`} htmlFor="session-switch">
            <span className={isWorkSession ? "active" : "inactive"}>Work Session</span>
            <span className={isWorkSession ? "inactive" : "active"}>Break Session</span>
          </label>
        </div>

        <div className="text-6xl font-medium text-gray-900 mb-8">
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant={timeLeft === totalTime ? "gray" : "outline"}
            onClick={resetTimer}
            disabled={timeLeft === totalTime}
            className={`flex items-center gap-2 ${timeLeft === totalTime ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <RotateCcw className="w-5 h-5" /> Reset
          </Button>

          <Button
            variant={!isInProgress ? "gray" : "primary"}
            onClick={toggleTimer}
            disabled={!isInProgress}
            className={`flex items-center gap-2 ${!isInProgress ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pause Timer
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Timer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
