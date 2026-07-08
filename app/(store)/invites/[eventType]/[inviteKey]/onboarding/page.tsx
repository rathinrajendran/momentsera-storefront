// page.tsx (SERVER COMPONENT)

import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage({ params }: { params: Promise<{ eventType: string; inviteKey: string }> }) {
  const { eventType, inviteKey } = await params;

  return <OnboardingClient eventType={eventType} inviteKey={inviteKey} />;
}
