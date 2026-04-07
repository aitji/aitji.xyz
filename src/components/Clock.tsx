import { createSignal, onCleanup, onMount } from "solid-js";

function getThaiTime() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function Clock() {
  const [time, setTime] = createSignal(getThaiTime());

  onMount(() => {
    const id = setInterval(() => setTime(getThaiTime()), 1000);
    onCleanup(() => clearInterval(id));
  });

  return (
    <span class="clock" title="thailand, gmt+7">
      {time()}
    </span>
  );
}
