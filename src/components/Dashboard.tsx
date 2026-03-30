import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { useAppStore } from '../store';
import { Users, Mail, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { contacts, campaigns } = useAppStore();

  const stats = [
    { title: 'Total Contacts', value: contacts.length, icon: Users, color: 'text-blue-500' },
    { title: 'Emails Drafted', value: campaigns.length, icon: Mail, color: 'text-green-500' },
    { title: 'Meetings Booked', value: contacts.filter(c => c.status === 'Meeting').length, icon: Calendar, color: 'text-purple-500' },
    { title: 'Closed Deals', value: contacts.filter(c => c.status === 'Closed').length, icon: TrendingUp, color: 'text-orange-500' },
  ];

  const pipelineData = [
    { name: 'Lead', count: contacts.filter(c => c.status === 'Lead').length },
    { name: 'Contacted', count: contacts.filter(c => c.status === 'Contacted').length },
    { name: 'Meeting', count: contacts.filter(c => c.status === 'Meeting').length },
    { name: 'Closed', count: contacts.filter(c => c.status === 'Closed').length },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 5).map(campaign => {
                const contact = contacts.find(c => c.id === campaign.contactId);
                return (
                  <div key={campaign.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">Drafted email for {contact?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
              {campaigns.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
