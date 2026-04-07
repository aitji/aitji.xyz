import { createSignal, onMount, Show } from "solid-js";

type Status = "online" | "idle" | "dnd" | "offline";
const DOT: Record<Status, string> = Object.freeze({
  online: "#4ade80",
  idle: "#facc15",
  dnd: "#f87171",
  offline: "#6b7280",
});

const LABEL: Record<Status, string> = Object.freeze({
  online: "online",
  idle: "idle",
  dnd: "dnd",
  offline: "offline",
});

export default function Discord() {
  const [status, setStatus] = createSignal<Status>("offline");
  const [ready, setReady] = createSignal(false);

  onMount(async () => {
    try {
      const res = await fetch("/api/discord");
      if (res.ok) {
        const { status: s } = await res.json();
        if (s in DOT) setStatus(s as Status);
      }
    } catch {
      /* offline */
    }
    setReady(true);
  });

  return (
    <Show when={ready()} fallback={<span class="discord-loading" />}>
      <span class="discord-pill">
        <span
          class="discord-dot"
          style={{ background: DOT[status()] }}
          aria-hidden="true"
        />
        <span class="discord-label">{LABEL[status()]}</span>
      </span>
    </Show>
  );
}
