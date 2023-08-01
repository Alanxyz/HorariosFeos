export interface Session {
  day: number;
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

export interface Scheduler{
  courses: Course[];
}

