'use client';

import React, { useState, useEffect } from "react";
import { User, PlanItem, Task } from "@/entities/all";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  PlayCircle,
  XCircle,
  CalendarDays
} from "lucide-react";

export default function TodayPage() {
  const [user, setUser] = useState<User | null>(null);
  const [todayItems, setTodayItems] = useState<PlanItem[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const today = format(new Date(), 'yyyy-MM-dd');
      const todayPlanItems = await PlanItem.filter({
        user_id: currentUser.id,
        scheduled_date: today
      }, 'scheduled_index');

      if (todayPlanItems.length > 0) {
        const taskIds = [...new Set(todayPlanItems.map(item => item.task_id))];
        const relatedTasks = await Task.filter({ id: { $in: taskIds } });
        const taskMap: Record<string, Task> = {};
        relatedTasks.forEach(task => {
          taskMap[task.id] = task;
        });
        setTasks(taskMap);
      }

      setTodayItems(todayPlanItems);
    } catch (error) {
      console.error('Error loading today data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async (itemId: string, action: 'done' | 'skipped' | 'snoozed') => {
    try {
      await PlanItem.update(itemId, { 
        status: action,
        completed_at: action === 'done' ? new Date().toISOString() : undefined 
      });
      await loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completedCount = todayItems.filter(item => item.status === 'done').length;
  const totalMinutes = todayItems.reduce((sum, item) => {
    const task = tasks[item.task_id];
    return sum + (task?.duration_minutes || 0);
  }, 0);
  const completedMinutes = todayItems
    .filter(item => item.status === 'done')
    .reduce((sum, item) => {
      const task = tasks[item.task_id];
      return sum + (task?.duration_minutes || 0);
    }, 0);

  const progressPercentage = totalMinutes > 0 ? (completedMinutes / totalMinutes) * 100 : 0;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Today's Learning</h1>
        <p className="text-gray-600">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount} / {todayItems.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Time Invested</p>
              <p className="text-2xl font-bold text-indigo-600">{completedMinutes} min</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Progress</p>
              <Progress value={progressPercentage} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {todayItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks for Today</h3>
              <p className="text-gray-600 mb-4">
                Looks like you don't have any learning tasks scheduled for today.
              </p>
              <Button asChild>
                <a href="/plan">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  View Learning Plan
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          todayItems.map((item, index) => {
            const task = tasks[item.task_id];
            if (!task) return null;

            return (
              <Card key={item.id} className={item.status === 'done' ? 'bg-gray-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium">{task.title}</h3>
                        <Badge variant="secondary">{task.provider}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.duration_minutes} minutes
                        </div>
                        {task.skill_tags?.map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.status !== 'done' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskAction(item.id, 'skipped')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Skip
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskAction(item.id, 'snoozed')}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Snooze
                          </Button>
                          {task.deep_link ? (
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700"
                              onClick={() => handleTaskAction(item.id, 'done')}
                              asChild
                            >
                              <a href={task.deep_link} target="_blank" rel="noopener noreferrer">
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Start
                              </a>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700"
                              onClick={() => handleTaskAction(item.id, 'done')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </>
                      )}
                      {item.status === 'done' && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
