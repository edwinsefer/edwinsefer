import React, { useState } from 'react';
import { Member, Event, Post, Photo, Resource } from '../types';
import { Card, Button, Input, Modal, SectionHeader } from './SharedUI';
import { Calendar as CalendarIcon, MapPin, Phone, Mail, Heart, MessageCircle, Plus, FileText, Link as LinkIcon, Download } from 'lucide-react';

// --- Directory Component ---
export const Directory: React.FC<{ members: Member[]; onAdd: (m: Omit<Member, 'id'>) => void }> = ({ members, onAdd }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<Member>>({});

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.location.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.relation) {
      onAdd(newMember as any);
      setIsModalOpen(false);
      setNewMember({});
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Family Directory" 
        subtitle={`${members.length} Members`}
        action={<Button onClick={() => setIsModalOpen(true)}><Plus size={18} className="inline mr-1"/> Add Member</Button>}
      />
      <Input label="Search Family" placeholder="Search by name or location..." value={search} onChange={e => setSearch(e.target.value)} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(m => (
          <Card key={m.id} className="flex items-start space-x-4 hover:bg-brand-50 transition-colors">
            <img src={m.photoUrl} alt={m.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-200" />
            <div>
              <h3 className="font-bold text-brand-900">{m.name}</h3>
              <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide">{m.relation}</p>
              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <div className="flex items-center"><MapPin size={14} className="mr-2 text-brand-400"/> {m.location}</div>
                <div className="flex items-center"><Phone size={14} className="mr-2 text-brand-400"/> <a href={`tel:${m.phone}`}>{m.phone}</a></div>
                <div className="flex items-center"><Mail size={14} className="mr-2 text-brand-400"/> <a href={`mailto:${m.email}`} className="truncate max-w-[150px]">{m.email}</a></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Family Member">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" required value={newMember.name || ''} onChange={e => setNewMember({...newMember, name: e.target.value})} />
          <Input label="Relation" required value={newMember.relation || ''} onChange={e => setNewMember({...newMember, relation: e.target.value})} />
          <Input label="Location" value={newMember.location || ''} onChange={e => setNewMember({...newMember, location: e.target.value})} />
          <Input label="Birth Date" type="date" value={newMember.birthDate || ''} onChange={e => setNewMember({...newMember, birthDate: e.target.value})} />
          <Input label="Email" type="email" value={newMember.email || ''} onChange={e => setNewMember({...newMember, email: e.target.value})} />
          <Input label="Phone" type="tel" value={newMember.phone || ''} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
          <Button type="submit" className="w-full">Save Member</Button>
        </form>
      </Modal>
    </div>
  );
};

// --- Calendar Component ---
export const CalendarView: React.FC<{ events: Event[]; onAdd: (e: Omit<Event, 'id'>) => void }> = ({ events, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ type: 'gathering' });

  // Simple sort by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date) {
      onAdd(newEvent as any);
      setIsModalOpen(false);
      setNewEvent({ type: 'gathering' });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Family Calendar" 
        subtitle="Birthdays, Anniversaries & Gatherings"
        action={<Button onClick={() => setIsModalOpen(true)}><Plus size={18} className="inline mr-1"/> Add Event</Button>}
      />
      
      <div className="space-y-3">
        {sortedEvents.map(event => {
          const date = new Date(event.date);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          const isBirthday = event.type === 'birthday';
          
          return (
            <div key={event.id} className="flex items-center bg-white p-4 rounded-xl border-l-4 border-brand-500 shadow-sm hover:translate-x-1 transition-transform">
              <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg mr-4 ${isBirthday ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'}`}>
                <span className="text-xs font-bold uppercase">{month}</span>
                <span className="text-2xl font-bold">{day}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-slate-800">{event.title}</h4>
                <p className="text-slate-500 text-sm">{event.description || event.type}</p>
                {event.location && <p className="text-xs text-brand-500 mt-1 font-medium"><MapPin size={12} className="inline mr-1"/>{event.location}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Event Title" required value={newEvent.title || ''} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
          <Input label="Date" type="date" required value={newEvent.date || ''} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-brand-700 mb-1">Type</label>
            <select className="w-full px-3 py-2 rounded-lg border border-brand-200" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="gathering">Gathering</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
          <Input label="Description" value={newEvent.description || ''} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
          <Button type="submit" className="w-full">Save Event</Button>
        </form>
      </Modal>
    </div>
  );
};

// --- Gallery Component ---
export const Gallery: React.FC<{ photos: Photo[]; onAdd: (p: Omit<Photo, 'id'>) => void }> = ({ photos, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd handle file upload here.
    if (newPhoto.caption) {
      onAdd({ ...newPhoto, url: `https://picsum.photos/800/600?random=${Date.now()}`, date: new Date().toISOString().split('T')[0], uploadedBy: 'Current User' } as any);
      setIsModalOpen(false);
      setNewPhoto({});
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Photo Gallery" 
        subtitle="Precious Memories"
        action={<Button onClick={() => setIsModalOpen(true)}><Plus size={18} className="inline mr-1"/> Upload Photo</Button>}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm">
            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white font-medium text-sm">{photo.caption}</p>
              <p className="text-white/80 text-xs">{photo.date}</p>
            </div>
          </div>
        ))}
      </div>

       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Photo">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Caption" required value={newPhoto.caption || ''} onChange={e => setNewPhoto({...newPhoto, caption: e.target.value})} />
          <p className="text-sm text-slate-500 italic">Note: In this demo, a random image will be generated.</p>
          <Button type="submit" className="w-full">Upload</Button>
        </form>
      </Modal>
    </div>
  );
};

// --- Message Board ---
export const MessageBoard: React.FC<{ posts: Post[]; onAdd: (p: Omit<Post, 'id'>) => void; members: Member[] }> = ({ posts, onAdd, members }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd({
        authorId: '1', // Mock current user
        content,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
      });
      setContent('');
    }
  };

  const getAuthorName = (id: string) => members.find(m => m.id === id)?.name || 'Unknown Family Member';
  const getAuthorPic = (id: string) => members.find(m => m.id === id)?.photoUrl || 'https://via.placeholder.com/40';

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <SectionHeader title="Family Board" subtitle="Share news, recipes, and updates" />
      
      <Card className="p-4 bg-brand-50 border-brand-200">
        <form onSubmit={handleSubmit}>
          <textarea 
            className="w-full p-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            rows={3}
            placeholder="What's on your mind? Share a story or update..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <Button type="submit">Post Update</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-6">
        {posts.map(post => (
          <Card key={post.id} className="space-y-3">
            <div className="flex items-center space-x-3">
              <img src={getAuthorPic(post.authorId)} alt="Author" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-bold text-slate-900">{getAuthorName(post.authorId)}</p>
                <p className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleDateString()} at {new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed">{post.content}</p>
            <div className="flex items-center space-x-4 pt-3 border-t border-brand-50 text-slate-500 text-sm">
              <button className="flex items-center space-x-1 hover:text-red-500 transition-colors"><Heart size={16} /> <span>{post.likes}</span></button>
              <button className="flex items-center space-x-1 hover:text-brand-600 transition-colors"><MessageCircle size={16} /> <span>{post.comments.length} Comments</span></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Resources Component ---
export const ResourcesView: React.FC<{ resources: Resource[]; onAdd: (r: Omit<Resource, 'id'>) => void }> = ({ resources, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({ type: 'doc' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResource.title && newResource.url) {
      onAdd({ ...newResource, id: Date.now().toString() } as Resource);
      setIsModalOpen(false);
      setNewResource({ type: 'doc' });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-red-500" size={32} />;
      case 'doc': return <FileText className="text-blue-500" size={32} />;
      case 'link': return <LinkIcon className="text-green-500" size={32} />;
      default: return <FileText className="text-gray-500" size={32} />;
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Resources & Documents" 
        subtitle="Family History, Contacts & Recipes"
        action={<Button onClick={() => setIsModalOpen(true)}><Plus size={18} className="inline mr-1"/> Add Resource</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(resource => (
          <Card key={resource.id} className="hover:shadow-md transition-all flex items-start space-x-4 p-5">
             <div className="bg-brand-50 p-3 rounded-lg">
                {getIcon(resource.type)}
             </div>
             <div className="flex-1">
                <h3 className="font-bold text-brand-900 leading-tight">{resource.title}</h3>
                <p className="text-sm text-slate-500 mt-1 mb-3 line-clamp-2">{resource.description}</p>
                <a href={resource.url} className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-800 uppercase tracking-wider">
                  <Download size={14} className="mr-1" /> Access {resource.type}
                </a>
             </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Resource">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" required value={newResource.title || ''} onChange={e => setNewResource({...newResource, title: e.target.value})} />
           <div className="mb-4">
            <label className="block text-sm font-medium text-brand-700 mb-1">Type</label>
            <select className="w-full px-3 py-2 rounded-lg border border-brand-200" value={newResource.type} onChange={e => setNewResource({...newResource, type: e.target.value as any})}>
              <option value="pdf">PDF Document</option>
              <option value="doc">Text Document</option>
              <option value="link">Web Link</option>
            </select>
          </div>
          <Input label="URL / Link" required value={newResource.url || ''} onChange={e => setNewResource({...newResource, url: e.target.value})} />
          <Input label="Description" value={newResource.description || ''} onChange={e => setNewResource({...newResource, description: e.target.value})} />
          <Button type="submit" className="w-full">Save Resource</Button>
        </form>
      </Modal>
    </div>
  );
};