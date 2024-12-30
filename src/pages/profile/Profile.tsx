import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores";
import { useMsgStore } from "../../stores";
import avatar from "../../assets/avatar.jpg";
import background from "../../assets/background.jpg";

export default function ProfilePage() {
  const { email, username, logout } = useAuthStore();
  const { setMsg } = useMsgStore();
  const navigate = useNavigate();

  useEffect(() => {
    setMsg("", false);
  }, [setMsg]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen bg-gray-200 dark:bg-gray-800 flex flex-wrap items-center justify-center">
      <img
        src={background}
        alt="Background"
        className="absolute bg-cover bottom-0 left-0 w-full h-full object-cover"
      />
      <div className="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3 bg-white shadow-lg transform duration-200 easy-in-out rounded-lg">
        <div className="h-48 overflow-hidden">
          <img
            className="w-full object-cover"
            src="https://cdn.dribbble.com/userupload/3714105/file/original-9c91bf74146f5edca3a83ca040aae782.jpg?resize=1024x768"
            alt="Profile cover"
          />
        </div>
        <div className="flex justify-center px-5 -mt-12">
          <img
            className="h-32 w-32 bg-white p-2 rounded-full"
            src={avatar}
            alt="Profile"
          />
        </div>
        <div>
          <div className="text-center px-14">
            <h2 className="text-gray-700 text-xl font-bold">{username}</h2>
            <p className="text-gray-400 mt-2 mb-10 text-md">{email}</p>
            <p className="mt-2 text-gray-500 text-sm mb-14">
              Welcome to your AI-powered study planner! Organize your tasks and achieve your goals efficiently.
            </p>
          </div>
          <hr className="mt-6" />
          <div className="flex bg-gray-50">
            <div
              onClick={handleLogout}
              className="text-center w-full bg-blue-100 p-4 text-gray-700 hover:bg-blue-200 cursor-pointer"
            >
              <p className="font-semibold">Log Out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
