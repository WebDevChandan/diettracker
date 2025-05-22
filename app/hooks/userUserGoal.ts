import { useContext } from "react";
import { UserGoalContext } from "../context/UserGoalProvider";

export default function useUserGoal() {
    const context = useContext(UserGoalContext);

    if (!context)
        throw new Error("UserGoalContext not found");

    return {
        ...context,
    };
}
