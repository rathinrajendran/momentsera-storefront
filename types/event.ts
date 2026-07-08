export interface Event {
  id: number;
  event_key: string;
  event_type: string;
  status: string;
  invite_key: string;
}

export interface EventSettings {
  invite_mode: string;
  accent_color: string;
  font_style: string;
  animations: boolean;
}
