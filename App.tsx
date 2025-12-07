import React, { useState, useEffect } from 'react';
import { ViewState, Member, Event, Post, Photo, Resource } from './types';
import { INITIAL_MEMBERS, INITIAL_EVENTS, INITIAL_POSTS, INITIAL_PHOTOS, INITIAL_RESOURCES } from './utils/mockData';
import { initializeAI } from './services/geminiService';
import { FamilyTree } from './components/FamilyTree';
import { Directory, CalendarView, Gallery, MessageBoard, ResourcesView } from './components/Features';
import { AIHistorian } from './components/AIHistorian';
import { Button, SectionHeader } from './components/SharedUI';
import { Users, Calendar, Image, MessageSquare, Trees, Sparkles, LogOut, Lock, FileText } from 'lucide-react';

// Placeholder for the family logo. Replace this URL with your specific hosted image URL.
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/5556/5556468.png";

export default function App() {
  // Default to true to bypass login for easier access
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [password, setPassword] = useState('');
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  
  // App Data State (Mocking a Database)
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);

  useEffect(() => {
    // Initialize AI with current data whenever data changes (in a real app, this would be more optimized)
    initializeAI(members, events);
  }, [members, events]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication
    if (password.toLowerCase() === 'family' || password === '') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect code. Hint: Try "family"');
    }
  };

  // Add Handlers
  const addMember = (m: Omit<Member, 'id'>) => {
    const newM = { ...m, id: Date.now().toString(), photoUrl: `https://picsum.photos/150/150?random=${Date.now()}` } as Member;
    setMembers([...members, newM]);
  };
  
  const addEvent = (ev: Omit<Event, 'id'>) => setEvents([...events, { ...ev, id: Date.now().toString() }]);
  const addPhoto = (p: Omit<Photo, 'id'>) => setPhotos([...photos, { ...p, id: Date.now().toString() }]);
  const addPost = (p: Omit<Post, 'id'>) => setPosts([ { ...p, id: Date.now().toString() }, ...posts]);
  const addResource = (r: Omit<Resource, 'id'>) => setResources([...resources, { ...r, id: Date.now().toString() }]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-8 border-brand-600">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-brand-50 rounded-full shadow-inner">
              <img src={LOGO_URL} alt="Family Logo" className="w-24 h-24 object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-900 mb-2">My Family Roots</h1>
          <p className="text-brand-600 mb-8">Welcome to our Family Hub</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-brand-400" size={20} />
              <input 
                type="password" 
                placeholder="Enter Family Code" 
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full py-3 text-lg shadow-lg">Enter Hub</Button>
          </form>
          <p className="mt-4 text-xs text-brand-400">Secure access for family members only.</p>
        </div>
      </div>
    );
  }

  // Navigation Item
  const NavItem = ({ view: v, label, icon: Icon }: { view: ViewState, label: string, icon: any }) => (
    <button 
      onClick={() => setView(v)}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all w-full md:w-auto md:px-4 md:flex-row md:space-x-2 ${view === v ? 'bg-brand-600 text-white shadow-md' : 'text-brand-700 hover:bg-brand-100'}`}
    >
      <Icon size={24} className={view === v ? 'text-white' : 'text-brand-600'} />
      <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">{label}</span>
    </button>
  );

  // Main Layout
  return (
    <div className="min-h-screen bg-brand-50 pb-24 md:pb-0">
      {/* Top Bar (Desktop) */}
      <header className="bg-white shadow-sm border-b border-brand-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
            <h1 className="text-xl md:text-2xl font-serif font-bold text-brand-900 hidden md:block">My Family Roots</h1>
          </div>
          <div className="hidden md:flex space-x-1 lg:space-x-2">
             <NavItem view={ViewState.TREE} label="Tree" icon={Trees} />
             <NavItem view={ViewState.DIRECTORY} label="Directory" icon={Users} />
             <NavItem view={ViewState.CALENDAR} label="Events" icon={Calendar} />
             <NavItem view={ViewState.GALLERY} label="Gallery" icon={Image} />
             <NavItem view={ViewState.RESOURCES} label="Docs" icon={FileText} />
             <NavItem view={ViewState.MESSAGES} label="Board" icon={MessageSquare} />
             <NavItem view={ViewState.AI_HISTORIAN} label="Archivist" icon={Sparkles} />
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="p-2 text-brand-400 hover:text-brand-700 hover:bg-brand-50 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-200 z-50 px-2 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] overflow-x-auto no-scrollbar">
        <div className="flex justify-between space-x-2 min-w-max px-2">
             <NavItem view={ViewState.TREE} label="Tree" icon={Trees} />
             <NavItem view={ViewState.DIRECTORY} label="People" icon={Users} />
             <NavItem view={ViewState.CALENDAR} label="Events" icon={Calendar} />
             <NavItem view={ViewState.GALLERY} label="Photos" icon={Image} />
             <NavItem view={ViewState.RESOURCES} label="Docs" icon={FileText} />
             <NavItem view={ViewState.MESSAGES} label="Chat" icon={MessageSquare} />
             <NavItem view={ViewState.AI_HISTORIAN} label="AI" icon={Sparkles} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === ViewState.HOME && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center py-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col items-center">
               {/* Decorative background circle */}
               <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
               
               <img src={LOGO_URL} alt="Family Crest" className="w-24 h-24 mb-4 object-contain relative z-10 drop-shadow-md opacity-90" />
               <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 relative z-10">My Family Roots</h2>
               <p className="text-xl opacity-90 relative z-10 font-light">Connecting Generations, Preserving History</p>
               <div className="mt-8 flex justify-center space-x-4 relative z-10">
                 <Button onClick={() => setView(ViewState.CALENDAR)} className="bg-white text-brand-900 hover:bg-brand-50 border-none font-semibold">Upcoming Events</Button>
                 <Button onClick={() => setView(ViewState.AI_HISTORIAN)} variant="outline" className="border-white text-white hover:bg-white/20">Ask Archivist</Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div onClick={() => setView(ViewState.MESSAGES)} className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-brand-100 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4 text-brand-600">
                   <MessageSquare />
                   <h3 className="font-bold text-lg">Latest News</h3>
                </div>
                <p className="text-slate-600 italic">"{posts[0]?.content.substring(0, 80)}..."</p>
                <p className="text-xs text-slate-400 mt-2 text-right">- {members.find(m => m.id === posts[0]?.authorId)?.name}</p>
              </div>

              <div onClick={() => setView(ViewState.CALENDAR)} className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-brand-100 hover:shadow-md transition-shadow">
                 <div className="flex items-center space-x-3 mb-4 text-brand-600">
                   <Calendar />
                   <h3 className="font-bold text-lg">Next Celebration</h3>
                </div>
                {events[0] && (
                  <>
                    <p className="font-medium text-slate-800">{events[0].title}</p>
                    <p className="text-sm text-brand-500 mt-1">{new Date(events[0].date).toLocaleDateString()}</p>
                  </>
                )}
              </div>

              <div onClick={() => setView(ViewState.DIRECTORY)} className="cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-brand-100 hover:shadow-md transition-shadow">
                 <div className="flex items-center space-x-3 mb-4 text-brand-600">
                   <Users />
                   <h3 className="font-bold text-lg">Family Size</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{members.length} <span className="text-base font-normal text-slate-500">Members</span></p>
                <div className="flex -space-x-2 mt-4">
                  {members.slice(0, 5).map(m => (
                    <img key={m.id} src={m.photoUrl} alt={m.name} className="w-8 h-8 rounded-full border-2 border-white" />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 border-2 border-white">+</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === ViewState.TREE && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
             <SectionHeader title="Family Tree" subtitle="Explore our roots and branches" />
             <FamilyTree members={members} />
          </div>
        )}

        {view === ViewState.DIRECTORY && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <Directory members={members} onAdd={addMember} />
          </div>
        )}

        {view === ViewState.CALENDAR && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <CalendarView events={events} onAdd={addEvent} />
          </div>
        )}

        {view === ViewState.GALLERY && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <Gallery photos={photos} onAdd={addPhoto} />
          </div>
        )}

        {view === ViewState.RESOURCES && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <ResourcesView resources={resources} onAdd={addResource} />
          </div>
        )}

        {view === ViewState.MESSAGES && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <MessageBoard posts={posts} onAdd={addPost} members={members} />
          </div>
        )}

        {view === ViewState.AI_HISTORIAN && (
          <div className="animate-in slide-in-from-bottom-4 duration-300 max-w-3xl mx-auto">
            <AIHistorian />
          </div>
        )}
      </main>
    </div>
  );
}