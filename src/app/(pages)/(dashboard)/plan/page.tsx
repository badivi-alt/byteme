'use client';

import React, { useState, useEffect } from "react";
import { User, PlanItem, Task } from "@/entities/all";
import { format, startOfWeek, addDays, addWeeks, isSameDay, isBefore, startOfToday } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Clock,
  Filter,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PlanPage() {
  const [user, setUser] = useState<User | null>(null);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [isCatchingUp, setIsCatchingUp] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Load plan items for the next 10 weeks
      const allPlanItems = await PlanItem.filter(
        { user_id: currentUser.id },
        'scheduled_date,scheduled_index'
      );
      
      // Load all tasks
      if (allPlanItems.length > 0) {
        const taskIds = [...new Set(allPlanItems.map(item => item.task_id))];
        const allTasks = await Task.filter({ id: { $in: taskIds } });
        const taskMap: Record<string, Task> = {};
        allTasks.forEach(task => {
          taskMap[task.id] = task;
        });
        setTasks(taskMap);
      }

      setPlanItems(allPlanItems);
    } catch (error) {
      console.error('Error loading plan data:', error);
    } finally {
      setLoading(false);
    }
  };

  const overdueItems = React.useMemo(() => {
    const today = startOfToday();
    return planItems.filter(item =>
      item.status === 'pending' && isBefore(new Date(item.scheduled_date), today)
    );
  }, [planItems]);

  const handleBulkCatchUp = async () => {
    setIsCatchingUp(true);
    try {
      const todayStr = format(startOfToday(), 'yyyy-MM-dd');
      const updates = overdueItems.map(item =>
        PlanItem.update(item.id, { scheduled_date: todayStr })
      );
      await Promise.all(updates);
      await loadData();
    } catch(e) {
      console.error("Failed to catch up", e);
    } finally {
      setIsCatchingUp(false);
    }
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const allowedDays = user?.work_days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const displayDays = weekDays.filter(day => {
    const dayName = format(day, 'EEE');
    return allowedDays.includes(dayName);
  });

  const getTasksForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let items = planItems.filter(item => item.scheduled_date === dateStr);
    if (statusFilter !== 'all') {
      items = items.filter(item => item.status === statusFilter);
    }
    return items.sort((a, b) => (a.scheduled_index || 0) - (b.scheduled_index || 0));
  };

  const getDayTotal = (date: Date) => {
    const dayTasks = getTasksForDay(date);
    return dayTasks.reduce((total, item) => {
      const task = tasks[item.task_id];
      return total + (task?.duration_minutes || 0);
    }, 0);
  };

  const getStatusColor = (status: PlanItem['status']) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'snoozed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'skipped': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-20 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Learning Plan</h1>
          <p className="text-gray-600">
            Your personalized {user?.preferences?.topic || 'learning'} journey
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="snoozed">Snoozed</SelectItem>
              <SelectItem value="skipped">Skipped</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" asChild>
            <a href="/library">
              <Plus className="w-4 h-4 mr-2" />
              Add from Library
            </a>
          </Button>
        </div>
      </div>

      {/* Overdue Banner */}
      {overdueItems.length > 0 && (
        <Card className="mb-6 bg-yellow-50 border-yellow-300">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-3 text-yellow-600" />
              <p className="text-yellow-800">
                You have <strong>{overdueItems.length}</strong> overdue task(s).
              </p>
            </div>
            <Button size="sm" onClick={handleBulkCatchUp} disabled={isCatchingUp}>
              {isCatchingUp && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Move to Today
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Week Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Week of {format(weekStart, 'MMMM d, yyyy')}
              </h2>
              <p className="text-sm text-gray-600">
                {displayDays.length} learning days scheduled
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {displayDays.map((day) => {
          const dayTasks = getTasksForDay(day);
          const dayTotal = getDayTotal(day);
          const target = user?.preferences?.daily_minutes_target || 90;
          const isToday = isSameDay(day, new Date());

          return (
            <Card key={day.toISOString()} className={`h-full ${isToday ? 'ring-2 ring-indigo-500' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-900">
                  <div className="flex items-center justify-between">
                    <span>
                      {format(day, 'EEE')}
                      {isToday && (
                        <Badge className="ml-2 bg-indigo-100 text-indigo-800 text-xs">
                          Today
                        </Badge>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(day, 'd')}
                    </span>
                  </div>
                </CardTitle>
                <div className="flex items-center text-xs text-gray-600">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{dayTotal}min / {target}min</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-2">
                {dayTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No tasks scheduled</p>
                  </div>
                ) : (
                  dayTasks.map((planItem) => {
                    const task = tasks[planItem.task_id];
                    if (!task) return null;

                    return (
                      <Card
                        key={planItem.id}
                        className={`${getStatusColor(planItem.status)} cursor-pointer hover:shadow-sm transition-all`}
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">
                            {task.title}
                          </h4>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {task.duration_minutes}m
                              </Badge>
                              {task.provider && (
                                <Badge variant="outline" className="text-xs">
                                  {task.provider}
                                </Badge>
                              )}
                            </div>
                            {planItem.status === 'done' && (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                          {task.skill_tags && task.skill_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {task.skill_tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {task.skill_tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{task.skill_tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Week Summary */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {displayDays.reduce((total, day) => total + getTasksForDay(day).length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {displayDays.reduce((total, day) => total + getDayTotal(day), 0)}min
              </div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {displayDays.reduce((total, day) =>
                  total + getTasksForDay(day).filter(item => item.status === 'done').length, 0
                )}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round(
                  displayDays.reduce((total, day) => {
                    const dayTasks = getTasksForDay(day);
                    const completed = dayTasks.filter(item => item.status === 'done').length;
                    return total + (dayTasks.length > 0 ? (completed / dayTasks.length) * 100 : 0);
                  }, 0) / (displayDays.length || 1)
                )}%
              </div>
              <div className="text-sm text-gray-600">Avg Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
