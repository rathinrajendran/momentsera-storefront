import EditorLayout from "./EditorLayout";
import { PreviewDraftProvider } from "./PreviewDraftContext";

export default function InviteEditorClient({ eventKey, eventId, initialData }: { eventKey: string; eventId: number; initialData: any }) {
  
  return (
    <PreviewDraftProvider initialData={initialData}>
      <EditorLayout eventKey={eventKey} eventId={eventId} />
    </PreviewDraftProvider>
  );
}
