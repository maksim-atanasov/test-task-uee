import { useEffect, useState } from "react";

export const Clock = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="clock">{time.toLocaleTimeString("uk-UA")}</span>;
};
