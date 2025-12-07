import { Member, Event, Post, Photo, Resource } from '../types';

export const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Arthur Keelapavoor', relation: 'Patriarch', birthDate: '1940-05-12', photoUrl: 'https://picsum.photos/150/150?random=1', location: 'Keelapavoor, TN', phone: '555-0101', email: 'arthur@fam.com', parentId: null, bio: "The rock of the family. Loves traditional farming." },
  { id: '2', name: 'Martha Keelapavoor', relation: 'Matriarch', birthDate: '1942-08-23', photoUrl: 'https://picsum.photos/150/150?random=2', location: 'Keelapavoor, TN', phone: '555-0102', email: 'martha@fam.com', parentId: null, bio: "Makes the best sweets in the village." },
  { id: '3', name: 'John Keelapavoor', relation: 'Son', birthDate: '1965-03-10', photoUrl: 'https://picsum.photos/150/150?random=3', location: 'Chennai, TN', phone: '555-0103', email: 'john@fam.com', parentId: '1' },
  { id: '4', name: 'Sarah Raja', relation: 'Daughter', birthDate: '1968-11-05', photoUrl: 'https://picsum.photos/150/150?random=4', location: 'Bangalore, KA', phone: '555-0104', email: 'sarah@fam.com', parentId: '1' },
  { id: '5', name: 'Jack Keelapavoor', relation: 'Grandson', birthDate: '1995-07-20', photoUrl: 'https://picsum.photos/150/150?random=5', location: 'San Francisco, CA', phone: '555-0105', email: 'jack@fam.com', parentId: '3' },
  { id: '6', name: 'Emily Raja', relation: 'Granddaughter', birthDate: '1998-02-14', photoUrl: 'https://picsum.photos/150/150?random=6', location: 'New York, NY', phone: '555-0106', email: 'emily@fam.com', parentId: '4' },
];

export const INITIAL_EVENTS: Event[] = [
  { id: '1', title: 'Grandma Martha\'s 82nd Birthday', date: '2024-08-23', type: 'birthday', description: 'Big celebration at the main house in Keelapavoor!' },
  { id: '2', title: 'Annual Family Reunion', date: '2024-07-15', type: 'gathering', location: 'Courtallam Falls', description: 'Don\'t forget to bring your swimsuits.' },
  { id: '3', title: 'Arthur & Martha Anniversary', date: '2024-06-20', type: 'anniversary' }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: '1', authorId: '2', content: 'So proud of Jack for his graduation! Can\'t wait to see everyone this summer.', timestamp: '2024-05-20T10:00:00Z', likes: 12,
    comments: [
      { id: 'c1', authorId: '5', content: 'Thanks Grandma! Love you!', timestamp: '2024-05-20T10:30:00Z' }
    ]
  }
];

export const INITIAL_PHOTOS: Photo[] = [
  { id: '1', url: 'https://picsum.photos/800/600?random=10', caption: 'Summer Festival 2023', uploadedBy: '3', date: '2023-07-15' },
  { id: '2', url: 'https://picsum.photos/800/600?random=11', caption: 'Deepavali at the village', uploadedBy: '4', date: '2023-11-12' },
  { id: '3', url: 'https://picsum.photos/800/600?random=12', caption: 'Jack\'s Graduation', uploadedBy: '1', date: '2024-05-15' },
];

export const INITIAL_RESOURCES: Resource[] = [
  { id: '1', title: 'Keelapavoor Ancestry Records (1950)', type: 'pdf', url: '#', description: 'Scanned copies of original land and birth records.' },
  { id: '2', title: 'Martha\'s Secret Recipe Book', type: 'doc', url: '#', description: 'The family favorites including the famous Halwa recipe.' },
  { id: '3', title: 'Emergency Contact List', type: 'link', url: '#', description: 'Phone numbers for family doctors, nearby hospitals, and police.' },
  { id: '4', title: 'Family Reunion Planning Guide', type: 'pdf', url: '#', description: 'Instructions for hosting the annual meetup.' },
];