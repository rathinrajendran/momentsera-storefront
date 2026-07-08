"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DeviceType } from "./EditorLayout";
import { PreviewToolbar } from "./PreviewToolbar";
import { PreviewFrame } from "./PreviewFrame";
import { useUpdateEventKey } from "../../../hooks/useEvents";

type Props = {
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  splitScreen: boolean;
  eventKey: string;
  eventId: number;
};

export default function PreviewPanel({ device, onDeviceChange, splitScreen, eventKey, eventId }: Props) {
  const router = useRouter();
  const updateEventKeyMutation = useUpdateEventKey(eventId, eventKey);
  const previewUrl = useMemo(() => `/preview/${eventKey}`, [eventKey]);

  const handleInviteUrlChange = useCallback(
    async (value: string) => {
      try {
        const response = await updateEventKeyMutation.mutateAsync(value);
        if (!response?.success || !response?.event_key) {
          return;
        }
        router.replace(`/editor/${response.event_key}`);
      } catch (error) {
        console.error("Failed to update invite URL:", error);
      }
    },
    [router, updateEventKeyMutation],
  );

  return (
    <div className="flex h-full flex-col rounded-[1rem]">
      {!splitScreen && (
        <PreviewToolbar inviteUrl={eventKey} onInviteUrlChange={handleInviteUrlChange} device={device} onDeviceChange={onDeviceChange} />
      )}
      <PreviewFrame previewUrl={previewUrl} device={device} splitScreen={splitScreen} />
    </div>
  );
}
