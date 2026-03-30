import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from './ui';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';

export function Tasks() {
  const { tasks, setTasks } = useAppStore();
  const [newTask, setNewTask] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), title: newTask, completed: false, dueDate: new Date().toISOString() }
    ]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Productivity Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-2 mb-6">
            <Input 
              placeholder="Add a new task..." 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </form>

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tasks yet. Add one above!</p>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${task.completed ? 'bg-gray-50 border-transparent' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleTask(task.id)} className="text-gray-500 hover:text-blue-600 transition-colors">
                      {task.completed ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'} font-medium`}>
                      {task.title}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
