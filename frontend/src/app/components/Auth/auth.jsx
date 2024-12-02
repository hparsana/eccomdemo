import { useState, useEffect } from "react";
import { redirect } from "next/navigation"; // Import redirect for Next.js navigation
import { USERS } from "@/app/utils/constant";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(USERS.GET_USER_INFO);

        if (res?.data?.success) {
          setUser(res?.data?.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
