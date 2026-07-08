import { upsertOnboarding } from "../../../../../../lib/api";

export async function submitOnboarding(
  payload: {
    invite_key: string;
    event_type: string;
  },
  data: {
    stage: string;
    announcement?: Record<string, any>;
  },
) {
  const result = await upsertOnboarding({
    invite_key: payload.invite_key,
    event_type: payload.event_type,
    ...data,
  });

  localStorage.setItem("active_event_key", result.event_key);
  return result;
}
