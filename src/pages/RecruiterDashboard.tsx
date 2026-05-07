import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, Briefcase, TrendingUp } from 'lucide-react';

export function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-zinc-900">ATS Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Active Jobs</CardTitle>
              <Briefcase className="text-zinc-400" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Total Applicants</CardTitle>
              <Users className="text-zinc-400" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">483</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">Interviews Scheduled</CardTitle>
              <TrendingUp className="text-zinc-400" size={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">24</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-500">No recent applications to display.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
