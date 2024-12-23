import { useQuery } from "@tanstack/react-query";
import { type Student } from "@prisma/client";

export const useStudent = () => {
  const { data: student, isLoading } = useQuery<Student>({
    queryKey: ["student"],
    queryFn: async () => {
      const response = await fetch("/api/(student)/student");
      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }
      return response.json();
    },
  });

  return {
    student,
    isLoading,
  };
};
