export type ContactStatus = 'Lead' | 'Contacted' | 'Meeting' | 'Closed';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: ContactStatus;
  notes: string;
  lastContacted?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface OutreachCampaign {
  id: string;
  contactId: string;
  prompt: string;
  draft: string;
  status: 'Draft' | 'Sent';
  createdAt: string;
}
