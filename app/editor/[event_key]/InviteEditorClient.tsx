import EditorLayout from "./EditorLayout";
import { PreviewDraftProvider } from "./PreviewDraftContext";

export default function InviteEditorClient({ eventKey, eventId, initialData }: { eventKey: string; eventId: number; initialData: any }) {
  console.log("initialData", initialData);
  
  return (
    <PreviewDraftProvider initialData={initialData}>
      <EditorLayout
        eventKey={eventKey}
        eventId={eventId}
        KeyInvite={initialData?.invite?.invite_key}
        typeEvent={initialData?.invite?.event_type}
        privacyData={initialData?.privacy}
      />
    </PreviewDraftProvider>
  );
}
