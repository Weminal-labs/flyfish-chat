import { Outlet } from "react-router-dom";

export default function AuthPage() {
  return (
    <div className="bg-[url('/images/auth-background.png')] w-full h-screen flex justify-center items-center">
      <Outlet />
    </div>
  );
}
