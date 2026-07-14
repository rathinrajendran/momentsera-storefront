"use client";

import { useMemo } from "react";
import { DeviceType } from "./EditorLayout";
import { PreviewFrame } from "./PreviewFrame";

type Props = {
  device: DeviceType;
  splitScreen: boolean;
  eventKey: string;
};

export default function PreviewPanel({ device, splitScreen, eventKey }: Props) {
  const previewUrl = useMemo(() => `/preview/${eventKey}`, [eventKey]);
  return (
    <div className="flex h-full flex-col rounded-[1rem]">       
      <PreviewFrame previewUrl={previewUrl} device={device} splitScreen={splitScreen} />
    </div>
  );
}
