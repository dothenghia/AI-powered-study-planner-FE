import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores";
import avatar from "../../assets/avatar.jpg";
import background from "../../assets/background.jpg";
import { Input } from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateSchema } from "../../utils/validations";
import { useProfile } from "../../hooks/useProfile";

export interface UpdateProfileType {
  email: string;
  username: string;
  imageUrl: string;
}

export default function ProfilePage() {
  const { email, username, imageUrl, userId, clearUser } = useAuthStore(); // Add `updateUser` to manage user updates.
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ email, username, imageUrl });
  const { updateProfile } = useProfile();
  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const form = useForm({
    resolver: yupResolver(updateSchema),
    defaultValues: {
      email: email,
      username: username,
      imageUrl: imageUrl,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: any) => {
    const response = await updateProfile(userId, data);
    setIsEditing(!response);
  };

  return (
    <div className="h-[calc(100vh-52px)] bg-gray-200 dark:bg-gray-800 flex flex-wrap items-center justify-center">
      <img
        src={background}
        alt="Background"
        className="absolute bg-cover bottom-0 left-0 w-full h-full object-cover"
      />
      <div className="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3 bg-white shadow-lg transform duration-200 easy-in-out rounded-lg overflow-hidden">
        <div className="h-48 overflow-hidden">
          <img
            className="w-full object-cover"
            src="https://cdn.dribbble.com/userupload/3714105/file/original-9c91bf74146f5edca3a83ca040aae782.jpg?resize=1024x768"
            alt="Profile cover"
          />
        </div>
        <div className="flex justify-center px-5 -mt-12">
          <img
            className="h-32 w-32 bg-white p-2 rounded-full object-cover"
            src={imageUrl ?? avatar}
            alt="Profile"
          />
        </div>
        <div>
          <div className={`${isEditing ?? "text-center"} px-14`}>
            {isEditing ? (
              <div>
                <form
                  id="update-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Display name
                  </label>
                  <Input
                    {...register("username")}
                    placeholder="Enter display name"
                    error={errors.username?.message}
                  />
                  <label className="block mt-5 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    {...register("email")}
                    placeholder="Enter email"
                    error={errors.email?.message}
                  />

                  <label className="block mt-5 text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <Input
                    {...register("imageUrl")}
                    placeholder="Enter image url"
                    error={errors.imageUrl?.message}
                  />
                </form>
              </div>
            ) : (
              <div>
                <h2 className="text-gray-700 text-xl font-bold">{username}</h2>
                <p className="text-gray-400 mt-2 mb-10 text-md">{email}</p>
              </div>
            )}
          </div>
          <hr className="mt-6" />
          <div className="flex bg-gray-50">
            {isEditing ? (
              <>
                <button
                  form="update-form"
                  type="submit"
                  className="text-center w-1/2 bg-green-100 p-4 text-gray-700 hover:bg-green-200 cursor-pointer"
                >
                  <p className="font-semibold">Save</p>
                </button>
                <button
                  onClick={handleCancel}
                  className="text-center w-1/2 bg-red-100 p-4 text-gray-700 hover:bg-red-200 cursor-pointer"
                >
                  <p className="font-semibold">Cancel</p>
                </button>
              </>
            ) : (
              <>
                <div
                  onClick={handleEditToggle}
                  className="text-center w-1/2 bg-yellow-100 p-4 text-gray-700 hover:bg-yellow-200 cursor-pointer"
                >
                  <p className="font-semibold">Edit Profile</p>
                </div>
                <div
                  onClick={handleLogout}
                  className="text-center w-1/2 bg-blue-100 p-4 text-gray-700 hover:bg-blue-200 cursor-pointer"
                >
                  <p className="font-semibold">Log Out</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
