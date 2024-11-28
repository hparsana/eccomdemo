import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Login as SetLoginAuth } from "../store/Auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { getUserData } from "@/app/store/Auth/authApi";
const withAuth = (WrappedComponent, authentication = true) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { userLoggedIn } = useSelector((data) => data?.userAuthData);

    useEffect(() => {
      dispatch(getUserData());
    }, []);

    useEffect(() => {
      const checkAuth = () => {
        if (authentication && !userLoggedIn) {
          redirect("/login");
        } else if (!authentication && userLoggedIn) {
          setLoading(false);
          redirect("/");
        } else {
          setLoading(false);
        }
      };

      checkAuth();
    }, [authentication, userLoggedIn]);

    if (loading) {
      return <div>Loading...</div>; // Or any loading component you prefer
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
