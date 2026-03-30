import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from './ui';
import { Search, Plus, MoreHorizontal, Mail } from 'lucide-react';
import { Contact, ContactStatus } from '../types';
import { cn } from '../lib/utils';

export function Contacts({ onNavigate }: { onNavigate: (view: string, data?: any) => void }) {
  const { contacts, addContact, updateContact, deleteContact } = useAppStore();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({ status: 'Lead' });

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContact.name && newContact.email) {
      addContact(newContact as Omit<Contact, 'id'>);
      setIsAdding(false);
      setNewContact({ status: 'Lead' });
    }
  };

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case 'Lead': return 'bg-gray-100 text-gray-800';
      case 'Contacted': return 'bg-blue-100 text-blue-800';
      case 'Meeting': return 'bg-purple-100 text-purple-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6 border-blue-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">New Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input required value={newContact.name || ''} onChange={e => setNewContact({...newContact, name: e.target.value})} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input required type="email" value={newContact.email || ''} onChange={e => setNewContact({...newContact, email: e.target.value})} placeholder="jane@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input required value={newContact.company || ''} onChange={e => setNewContact({...newContact, company: e.target.value})} placeholder="Acme Corp" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input required value={newContact.role || ''} onChange={e => setNewContact({...newContact, role: e.target.value})} placeholder="VP of Sales" />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Save Contact</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search contacts..." 
              className="pl-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100">
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Company</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Last Contacted</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b transition-colors hover:bg-gray-100/50">
                  <td className="p-4 align-middle">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-xs text-gray-500">{contact.email}</div>
                  </td>
                  <td className="p-4 align-middle">
                    <div>{contact.company}</div>
                    <div className="text-xs text-gray-500">{contact.role}</div>
                  </td>
                  <td className="p-4 align-middle">
                    <select 
                      className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-md border-0 focus:ring-2 focus:ring-gray-950", getStatusColor(contact.status))}
                      value={contact.status}
                      onChange={(e) => updateContact(contact.id, { status: e.target.value as ContactStatus })}
                    >
                      <option value="Lead">Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-4 align-middle text-gray-500">
                    {contact.lastContacted ? new Date(contact.lastContacted).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="sm" onClick={() => onNavigate('outreach', { contactId: contact.id })}>
                      <Mail className="h-4 w-4 mr-2" /> Draft Email
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteContact(contact.id)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
