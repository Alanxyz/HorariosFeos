export interface Session {
  day: string;
  begin: string;
  end: string;
  place: string;
}

export interface Course {
  id: string;
  name: string;
  group: string;
  teacher: string;
  sessions: Session[];
}
