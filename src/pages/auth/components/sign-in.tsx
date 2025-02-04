import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

// Import components
import LoadingSpinner from "src/components/loading-spinner";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";

// Import hooks
import { useAuth } from "src/hooks/use-auth";

// Import types
import type { SignInUserType } from "src/objects/user/types";

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInUserType>();
  const navigate = useNavigate();
  const { signin, isPending } = useAuth();

  const onSubmit: SubmitHandler<SignInUserType> = (data) => {
    if (isPending) return;
    signin(data);
  };

  return (
    <div className="w-full max-w-[480px] bg-white p-6 rounded-lg border border-blue-700">
      <header>
        <h1 className="font-bold text-4xl">Sign in</h1>
        <p>Do we know you?</p>
      </header>
      <hr className="my-3" />
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
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
        <hr className="my-3" />
        <div className="flex flex-col items-center">
          <Button type="submit" disabled={isPending} className="w-full mb-3">
            {isPending ? (
              <div className="flex justify-center items-center">
                <LoadingSpinner width="w-4" height="w-4" />
                <span className="ms-3">Wait a few seconds...</span>
              </div>
            ) : (
              "Let me in"
            )}
          </Button>
          <p className="text-sm">
            If you don't have account, please{" "}
            <span
              className="cursor-pointer font-bold underline text-blue-700"
              onClick={() => navigate("/sign-up")}
            >
              sign up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
