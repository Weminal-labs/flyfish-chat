// import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Import objects
import { AuthAPI } from "src/objects/auth/api";

// Import state
import { useAuthState } from "src/states/auth";

// Import utils
import { BrowserStorageUtils } from "src/utils/browser_storage";
import { CookieUtils } from "src/utils/cookies";

// Import types
import type {
  UserType,
  SignInUserType,
  SignUpUserType,
} from "src/objects/user/types";

export function useAuth() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isPending,
    user,
    updateIsAuthenticated,
    updateUser,
    updateIsPending,
  } = useAuthState();

  const signin = async function (data?: SignInUserType) {
    try {
      updateIsPending(true);

      const user = BrowserStorageUtils.getItem("user") as UserType | undefined;
      let payload: any = {};

      if (user && !data) {
        payload.username = user.username;
        payload.token = CookieUtils.readCookie(CookieUtils.TOKEN_NAME + "tkn");
      } else if (data) {
        payload = data;
      }

      const responseData = await AuthAPI.signIn(payload);

      if (!responseData) throw new Error("Sign up failed");

      const message = responseData.success?.message || "Sign in successfully";
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
      });

      updateIsAuthenticated(true);
      updateIsPending(false);
      if (responseData.data.token) {
        updateUser(responseData.data.user);

        // Add token to cookie
        CookieUtils.writePersistentCookie(
          CookieUtils.TOKEN_NAME + "tkn",
          responseData.data.token
        );
      }

      if (responseData.data.user) {
        // Save to local storage
        BrowserStorageUtils.setItem("user", responseData?.data.user);
      }

      return responseData.data;
    } catch (error: any) {
      updateIsPending(false);
      navigate("/");
    }
  };
  const signup = async function (data: SignUpUserType) {
    try {
      updateIsPending(true);

      const responseData = await AuthAPI.signUp(data);

      if (!responseData) throw new Error("Sign up failed");

      const message = responseData.success?.message || "Sign up successfully";

      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
      });

      updateIsAuthenticated(true);
      updateIsPending(false);
      updateUser(responseData.data.user);

      // Add token to cookie
      CookieUtils.writePersistentCookie(
        CookieUtils.TOKEN_NAME + "tkn",
        responseData.data.token
      );

      // Save to local storage
      BrowserStorageUtils.setItem("user", responseData?.data.user);

      return responseData;
    } catch (error: any) {
      updateIsPending(false);
      navigate("/");
    }
  };
  const signout = function (fn?: () => void) {
    CookieUtils.removeCookie(CookieUtils.TOKEN_NAME + "tkn");
    updateIsAuthenticated(false);
    updateUser(null);

    // Do something
    if (fn) fn();

    // Navigate to /
    navigate("/");
  };

  return {
    isAuthenticated,
    isPending,
    user,
    signin,
    signup,
    signout,
  };
}
