import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Settings, Shield, Activity } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-zinc-900">System Administration</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">System Health</CardTitle>
              <Activity className="text-emerald-500" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">99.9%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Active Users</CardTitle>
              <Shield className="text-zinc-400" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">12,450</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Pending Approvals</CardTitle>
              <Settings className="text-zinc-400" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">5</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
