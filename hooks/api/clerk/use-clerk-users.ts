import { useQuery } from "@tanstack/react-query";
import { type User } from "@clerk/nextjs/server";

export const useClerkUser = () => {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["clerk-user"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    },
  });

  return {
    user,
    isLoading,
  };
};
