import { upsertOnboarding } from "../../../../../../lib/api";

export async function submitOnboarding(
  payload: {
    invite_key: string;
    event_type: string;
  },
  data: {
    stage: string;
    data: {
      announcement?: Record<string, any>;
      schedule?: Record<string, any>[];
    };
  },
) {
  return upsertOnboarding({
    invite_key: payload.invite_key,
    event_type: payload.event_type,
    ...data,
  });
}
