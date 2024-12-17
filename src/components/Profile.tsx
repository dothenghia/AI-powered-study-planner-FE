import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/7573940.jpg";
import useAuthStore from "../stores/authStore";
import { useEffect } from "react";
import useMsgStore from "../stores/msgStore";
import avatar from "../assets/9334237.jpg";
import { useFetchProfile } from "../hooks/useFetchProfile";

export const Profile = () => {
  const { email, username, logout } = useAuthStore();
  const { fetchProfile } = useFetchProfile();
  const { setMsg } = useMsgStore();
  const navigate = useNavigate();

  useEffect(() => {
    setMsg("", false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile  ]);

  // if (!profile) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="h-screen bg-gray-200  dark:bg-gray-800 flex flex-wrap items-center  justify-center  ">
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute bg-cover bottom-0 left-0 w-full h-full object-cover"
      />
      <div className="container rounded-lg overflow-hidden lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3 bg-white  shadow-lg transform   duration-200 easy-in-out">
        <div className=" h-48 overflow-hidden">
          <img
            className="w-full object-center"
            src="https://cdn.dribbble.com/userupload/3714105/file/original-9c91bf74146f5edca3a83ca040aae782.jpg?resize=1024x768"
            alt=""
          />
        </div>
        <div className="flex justify-center px-5 -mt-12">
          <img
            className="h-32 w-32 bg-white p-2 rounded-full"
            src={avatar}
            alt=""
          />
        </div>
        <div>
          <div className="text-center px-14">
            <h2 className="text-gray-700 text-xl font-bold">{username}</h2>
            <p className="text-gray-400 mb-10 text-md font-normal">{email}</p>
            <p className="mt-2 text-gray-500 mb-14 text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s,{" "}
            </p>
          </div>
          <hr className="mt-6" />
          <div className="flex  bg-gray-50 ">
            <div
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-center w-full bg-[#afe0ff]    p-4 text-gray-700 hover:bg-[#f6d0ff] cursor-pointer"
            >
              <p className="font-semibold ">Log Out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
