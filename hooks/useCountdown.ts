import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

export function useCountdown(targetDate: Date | null) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      const diff = Math.max(differenceInSeconds(targetDate, new Date()), 0);

      setSecondsLeft(diff);
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return {
    days: Math.floor(secondsLeft / 86400),

    hours: Math.floor((secondsLeft % 86400) / 3600),

    minutes: Math.floor((secondsLeft % 3600) / 60),

    seconds: secondsLeft % 60,
  };
}
