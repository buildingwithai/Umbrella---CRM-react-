import { useState, useEffect } from 'react';
import { Contact, Task, OutreachCampaign } from './types';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Smith', email: 'alice@example.com', company: 'TechCorp', role: 'CTO', status: 'Lead', notes: 'Interested in AI automation.' },
  { id: '2', name: 'Bob Jones', email: 'bob@example.com', company: 'InnovateInc', role: 'CEO', status: 'Contacted', notes: 'Follow up next week.', lastContacted: new Date().toISOString() },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', company: 'DesignWorks', role: 'Director', status: 'Meeting', notes: 'Demo scheduled.' },
];

export function useAppStore() {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('denchclaw_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('denchclaw_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [campaigns, setCampaigns] = useState<OutreachCampaign[]>(() => {
    const saved = localStorage.getItem('denchclaw_campaigns');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('denchclaw_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('denchclaw_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('denchclaw_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    setContacts(prev => [...prev, { ...contact, id: uuidv4() }]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const addCampaign = (campaign: Omit<OutreachCampaign, 'id' | 'createdAt'>) => {
    setCampaigns(prev => [{ ...campaign, id: uuidv4(), createdAt: new Date().toISOString() }, ...prev]);
  };

  const updateCampaign = (id: string, updates: Partial<OutreachCampaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    tasks,
    setTasks,
    campaigns,
    addCampaign,
    updateCampaign
  };
}
