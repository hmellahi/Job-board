export interface Meta {
  page: number;
  maxPage: number;
  count: number;
  total: number;
  text_keywords_synonyms: string[];
}

export interface Board {
  key: string;
  name: string;
  type: string;
  subtype: string;
  environment: string;
}

export interface Location {
  text: string;
  lat: number;
  lng: number;
  gmaps: string | null;
  fields: string[];
}

export interface Skill {
  name: string;
  value: string | null;
  type: string | null;
}

export interface Certification {
  name: string;
  value: string | null;
  type: string | null;
}

export interface Task {
  name: string;
  value: string | null;
  type: string | null;
}

export interface Tag {
  name: string;
  value: string;
}

export interface RangeDate {
  name: string;
  value_min: string;
  value_max: string;
}

export interface JobPost {
  id: number;
  key: string;
  reference?: string;
  board_key: string;
  board: Board;
  name: string;
  url: string;
  picture: string | null;
  summary: string;
  location: Location;
  archive: string | null;
  archived_at: string | null;
  updated_at: string;
  created_at: string;
  sections: string[];
  culture: string | null;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  interviews: string | null;
  skills: Skill[];
  languages: string[];
  certifications: Certification[];
  courses: string[];
  tasks: Task[];
  interests: string[];
  tags: Tag[];
  metadatas: string[];
  ranges_float: number[];
  ranges_date: RangeDate[];
}

export interface JobsApiResponse {
  code: number;
  message: string;
  meta: Meta;
  data: {
    jobs: JobPost[];
  };
}
