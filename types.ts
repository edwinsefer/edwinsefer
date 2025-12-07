export interface Member {
  id: string;
  name: string;
  relation: string;
  birthDate: string;
  photoUrl: string;
  location: string;
  phone: string;
  email: string;
  bio?: string;
  parentId?: string | null; // For tree structure
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string
  type: 'birthday' | 'anniversary' | 'gathering' | 'holiday';
  description?: string;
  location?: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  date: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'link';
  url: string;
  description: string;
}

export enum ViewState {
  HOME = 'HOME',
  TREE = 'TREE',
  DIRECTORY = 'DIRECTORY',
  CALENDAR = 'CALENDAR',
  GALLERY = 'GALLERY',
  MESSAGES = 'MESSAGES',
  RESOURCES = 'RESOURCES',
  AI_HISTORIAN = 'AI_HISTORIAN'
}