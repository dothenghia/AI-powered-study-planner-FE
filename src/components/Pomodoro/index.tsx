import React, { useState, useEffect } from "react";
import "./index.css";
import useSaveFocusedTime from "../../hooks/useSaveFocusedTime";
import { ITask } from "../../types/task";

type PomodoroProps = {
  selectedTask: Partial<ITask> | null;
  onTimerStateChange?: (isRunning: boolean) => void;
  onCompleteTask?: (type: string) => void;
};

export const PomodoroTimer = (props: PomodoroProps) => {
  const { selectedTask, onCompleteTask } = props;
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [workDuration, setWorkDuration] = useState(1);
  const [breakDuration, setBreakDuration] = useState(5);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const { saveFocusedTime } = useSaveFocusedTime(selectedTask?.id ?? "");
  const isInProgress = selectedTask?.status === "In Progress";
  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return;
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Lưu ý tháng bắt đầu từ 0
    const year = date.getFullYear();

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0 && isWorkSession) {
      timer = setInterval(() => {
        setFocusedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWorkSession]);

  useEffect(() => {
    if (!isRunning && focusedTime > 0) {
      saveFocusedTime(focusedTime);
      setFocusedTime(0);
    }
  }, [isRunning]);

  useEffect(() => {
    if (!isWorkSession) {
      setFocusedTime(0);
    }
  }, [isWorkSession]);

  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isWorkSession) {
        onCompleteTask?.("0_time_left_work");
      } else {
        onCompleteTask?.("0_time_left_break");
      }
      clearInterval(timer);
      setIsWorkSession((prev) => !prev);
      const nextTotalTime = isWorkSession
        ? workDuration * 60
        : breakDuration * 60;
      setTimeLeft(3);
      setTotalTime(nextTotalTime);
      setIsRunning(false);
      props.onTimerStateChange?.(false);
    }
    return () => clearInterval(timer); // Cleanup
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isWorkSession) {
      setTimeLeft(3);
    } else {
      setTimeLeft(3);
    }
  }, [isWorkSession]);

  // Start/Stop timer
  const toggleTimer = () => {
    setIsRunning((prev) => {
      const newState = !prev;
      if (props.onTimerStateChange) {
        props.onTimerStateChange(newState);
      }
      return newState;
    });
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    const initialTime = isWorkSession ? workDuration * 60 : breakDuration * 60;
    setTimeLeft(initialTime);
    setTotalTime(initialTime);
  };
  const [focusedTime, setFocusedTime] = useState(0);

  // Calculate progress percentage
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Handle duration change
  const handleWorkDurationChange = (e: any) => {
    const value = Math.max(1, parseInt(e.target.value || "1"));
    setWorkDuration(value);
    if (isWorkSession) {
      setTimeLeft(value * 60);
      setTotalTime(value * 60);
    }
  };

  const handleChange = () => {
    setIsRunning(false);
    setIsWorkSession(!isWorkSession);

    if (isWorkSession) {
      setTimeLeft(workDuration * 60);
    } else {
      setTimeLeft(breakDuration * 60);
    }
  };

  const handleBreakDurationChange = (e: any) => {
    const value = Math.max(1, parseInt(e.target.value || "1"));
    setBreakDuration(value);
    if (!isWorkSession) {
      setTimeLeft(value * 60);
      setTotalTime(value * 60);
    }
  };

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
            variant={isRunning ? "outline" : "gray"}
            onClick={resetTimer}
            disabled={timeLeft === totalTime}
            className={`flex items-center gap-2 ${timeLeft === totalTime ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <RotateCcw className="w-5 h-5" /> Reset
          </Button>

          <Button
            variant="primary"
            onClick={toggleTimer}
            className="flex items-center gap-2 cursor-pointer"
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
