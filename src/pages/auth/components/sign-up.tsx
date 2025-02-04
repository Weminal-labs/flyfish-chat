import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";

// Import components
import LoadingSpinner from "src/components/loading-spinner";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";

// Import hooks
import { useAuth } from "src/hooks/use-auth";

// Import types
import type { SignUpUserType } from "src/objects/user/types";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpUserType>();
  const navigate = useNavigate();
  const { signup, isPending } = useAuth();

  const onSubmit: SubmitHandler<SignUpUserType> = (data) => {
    if (isPending) return;

    // Check confirm password
    if (data.confirmedPassword !== data.password) {
      toast.error("Failed to confirm your password");
      return;
    }

    console.log("Data:", data);
    signup(data);
  };

  return (
    <div className="w-full max-w-[480px] bg-white p-6 rounded-lg border border-blue-700">
      <header>
        <h1 className="font-bold text-4xl">Sign up</h1>
        <p>Let we know you</p>
      </header>
      <hr className="my-3" />
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <Input
            type="email"
            id="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500">You must enter your email</p>
          )}
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col w-full me-2">
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              First name
            </label>
            <Input
              type="text"
              id="firstName"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <p className="text-red-500">You must enter your first name</p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Last name
            </label>
            <Input
              type="text"
              id="lastName"
              {...register("lastName", { required: true })}
            />
            {errors.lastName && (
              <p className="text-red-500">You must enter your last name</p>
            )}
          </div>
        </div>
        <hr className="my-5" />
        <div className="flex flex-col mb-5">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Username
          </label>
          <Input
            type="text"
            id="username"
            {...register("username", { required: true })}
          />
          {errors.username && (
            <p className="text-red-500">You must enter your username</p>
          )}
        </div>
        <div className="flex flex-col mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <Input
            type="password"
            id="password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-red-500">You must enter your password</p>
          )}
        </div>
        <div className="flex flex-col mb-5">
          <label
            htmlFor="confirmedPassword"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Confirm your password
          </label>
          <Input
            type="password"
            id="confirmedPassword"
            {...register("confirmedPassword", { required: true })}
          />
          {errors.password && (
            <p className="text-red-500">You must confirm your password</p>
          )}
        </div>
        <hr className="my-3" />
        <div className="flex flex-col items-center">
          <Button type="submit" disabled={isPending} className="w-full mb-3">
            {isPending ? (
              <div className="flex justify-center items-center">
                <LoadingSpinner width="w-4" height="w-4" />
                <span className="ms-3">Wait a few seconds...</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
          <p className="text-sm">
            Back to{" "}
            <span
              className="cursor-pointer font-bold underline text-blue-700"
              onClick={() => navigate("/sign-in")}
            >
              sign in
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
