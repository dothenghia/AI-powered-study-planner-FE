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
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "15px" }}>
        {selectedTask?.name}
      </h1>
      <div
        style={{
          fontSize: "1rem",
          fontWeight: "500",
          color: "#62748e",
          textAlign: "center",
          display: "inline-block",
          marginBottom: "10px",
        }}
      >
        <p>From {formatDate(selectedTask?.opened_at)}</p>
        <p>To {formatDate(selectedTask?.dued_at)}</p>
      </div>
      <hr
        style={{
          border: "none",
          borderTop: "2px solid #ddd",
          width: "80%",
        }}
      />
      <div className="switch-toggle">
        <input
          type="checkbox"
          id="pricing-plan-switch"
          className="switch-toggle-checkbox"
          checked={isWorkSession}
          onChange={handleChange}
        />
        <label
          className="switch-toggle-label items-center"
          htmlFor="pricing-plan-switch"
        >
          <span className={isWorkSession ? "active" : "inactive"}>
            Work Session
          </span>
          <span className={isWorkSession ? "inactive" : "active"}>
            Break Session
          </span>
        </label>
      </div>
      <div
        style={{
          textAlign: "center",
          color: "#1b2950",
          fontSize: "5.5rem",
          fontWeight: "500",
          marginBottom: "10px",
        }}
      >
        {formatTime(timeLeft)}
      </div>

      {/* <div
        style={{
          width: "80%",
          height: "10px",
          backgroundColor: "#d0d3e2",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "#007bff",
            transition: "width 0.25s ease",
            width: `${progress}%`,
          }}
        ></div>
      </div> */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "1rem",
            fontWeight: "500",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          Work Duration (min):
          <input
            type="number"
            value={workDuration}
            onChange={handleWorkDurationChange}
            min="1"
            style={{
              marginTop: "5px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              outline: "none",
              fontSize: "1rem",
              color: "#333",
              transition: "box-shadow 0.3s ease",
            }}
            onFocus={(e) =>
              (e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)")
            }
            onBlur={(e) =>
              (e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)")
            }
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "1rem",
            fontWeight: "500",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          Break Duration (min):
          <input
            type="number"
            value={breakDuration}
            onChange={handleBreakDurationChange}
            min="1"
            style={{
              marginTop: "5px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              outline: "none",
              fontSize: "1rem",
              color: "#333",
              transition: "box-shadow 0.3s ease",
            }}
          />
        </label>
      </div> */}
      <div style={{ display: "flex", gap: "25px" }}>
        <button
          className="rounded-full"
          onClick={resetTimer}
          style={{
            padding: "10px 12px",
            fontSize: "1rem",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#d0d3e2",
          }}
        >
          <img
            width="25"
            height="25"
            src="https://img.icons8.com/ios-filled/50/4D4D4D/update-left-rotation.png"
            alt="update-left-rotation"
          />
        </button>
        <button
          disabled={!isInProgress}
          onClick={toggleTimer}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            backgroundColor: isInProgress ? "#007bff" : "#cccccc", // Disabled state background
            color: isInProgress ? "#fff" : "#666666", // Disabled state text color
            opacity: isInProgress ? 1 : 0.7,
          }}
        >
          {isRunning ? (
            <div className="flex items-center gap-2">
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/glyph-neue/64/FFFFFF/circled-pause.png"
                alt="circled-pause"
              />
              Pause
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/sf-black-filled/64/FFFFFF/play.png"
                alt="play"
              />
              Start
            </div>
          )}
        </button>
        <button
          className="rounded-full"
          onClick={() => onCompleteTask?.("complete")}
          style={{
            gap: "10px",
            alignItems: "center",
            display: "flex",
            padding: "10px 10px",
            fontSize: "1rem",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#d0d3e2",
          }}
        >
          <img
            width="30"
            height="30"
            src="https://img.icons8.com/ios-glyphs/30/4D4D4D/task-completed.png"
            alt="task-completed"
          />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
