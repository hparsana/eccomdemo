import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { getUserData } from "@/app/store/Auth/authApi";

const withAuth = (WrappedComponent, authentication = true) => {
  const WithAuthComponent = (props) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { userLoggedIn } = useSelector((data) => data?.userAuthData);

    // Fetch user data when the component mounts
    useEffect(() => {
      dispatch(getUserData());
    }, [dispatch]);

    // Handle authentication and redirection
    useEffect(() => {
      const checkAuth = () => {
        if (authentication && !userLoggedIn) {
          redirect("/login"); // Redirect unauthenticated users to login
        } else if (!authentication && userLoggedIn) {
          redirect("/"); // Redirect authenticated users from public pages to home
        } else {
          setLoading(false); // Stop loading when conditions are met
        }
      };

      checkAuth();
    }, [authentication, userLoggedIn]);

    if (loading) {
      return <div>Loading...</div>; // Or any loading indicator you prefer
    }

    // Render the wrapped component
    return <WrappedComponent {...props} />;
  };

  // Add a display name for better debugging
  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthComponent;
};

export default withAuth;
