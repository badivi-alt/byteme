&apos;use client&apos;;

import React, { useState, useEffect } from "react";
import { User, PlanItem, Task, Event, Curriculum, Topic } from "@/entities/all";
import { format, startOfDay, isToday, addDays, startOfWeek, endOfWeek } from "date-fns";
import {
  CheckCircle,
  Clock,
  Flame,
  Calendar,
  TrendingUp,
  BookOpen,
  Play,
  Plus,
  MessageCircle,
  Target,
  Award,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Import components defined earlier
function CopilotInviteCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to start learning?
              </h3>
              <p className="text-gray-600 mb-4">
                Use our AI Copilot to create a personalized learning plan tailored to your goals and schedule.
              </p>
              <div className="flex items-center space-x-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                  <a href="/copilot">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start with Copilot
                  </a>
                </Button>
                <Button variant="outline" onClick={onDismiss}>
                  Maybe later
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TodayOverview({ todayItems, tasks, user }: { 
  todayItems: PlanItem[];
  tasks: Record<string, Task>;
  user: User;
}) {
  const completedCount = todayItems.filter(item => item.status === &apos;done&apos;).length;
  const totalMinutes = todayItems.reduce((sum, item) => {
    const task = tasks[item.task_id];
    return sum + (task?.duration_minutes || 0);
  }, 0);
  const completedMinutes = todayItems
    .filter(item => item.status === &apos;done&apos;)
    .reduce((sum, item) => {
      const task = tasks[item.task_id];
      return sum + (task?.duration_minutes || 0);
    }, 0);

  const progressPercentage = totalMinutes > 0 ? (completedMinutes / totalMinutes) * 100 : 0;
  const targetMinutes = user?.preferences?.daily_minutes_target || 90;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span>Today&apos;s Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {completedCount} / {todayItems.length}
              </div>
              <div className="text-sm text-gray-600">Tasks completed</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {completedMinutes} min
              </div>
              <div className="text-sm text-gray-600">of {targetMinutes} min goal</div>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-3" />
          
          {todayItems.length > 0 && (
            <div className="flex items-center justify-between">
              <Button size="sm" asChild>
                <a href="/today">
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </a>
              </Button>
              <span className="text-sm text-gray-600">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
          )}
          
          {todayItems.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-3">No tasks scheduled for today</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/plan">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tasks
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyOverview({ weeklyItems, tasks }: {
  weeklyItems: PlanItem[];
  tasks: Record<string, Task>;
}) {
  const weeklyCompleted = weeklyItems.filter(item => item.status === &apos;done&apos;).length;
  const weeklyProgress = weeklyItems.length > 0 ? (weeklyCompleted / weeklyItems.length) * 100 : 0;
  const weeklyMinutes = weeklyItems
    .filter(item => item.status === &apos;done&apos;)
    .reduce((sum, item) => {
      const task = tasks[item.task_id];
      return sum + (task?.duration_minutes || 0);
    }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span>This Week</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {weeklyCompleted}
              </div>
              <div className="text-sm text-gray-600">Tasks completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(weeklyMinutes / 60)}h
              </div>
              <div className="text-sm text-gray-600">Time invested</div>
            </div>
          </div>
          
          <Progress value={weeklyProgress} className="h-3" />
          
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" asChild>
              <a href="/plan">
                <Calendar className="w-4 h-4 mr-2" />
                View Plan
              </a>
            </Button>
            <span className="text-sm text-gray-600">
              {Math.round(weeklyProgress)}% weekly goal
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActiveTopics({ curricula }: { curricula: Curriculum[] }) {
  if (!curricula.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span>Active Topics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {curricula.slice(0, 3).map((curriculum) => (
            <div key={curriculum.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{curriculum.title}</h4>
                <p className="text-sm text-gray-600">
                  {curriculum.settings?.time_per_day || 90} min/day
                </p>
              </div>
              <Badge variant={curriculum.status === &apos;active&apos; ? &apos;default&apos; : &apos;secondary&apos;}>
                {curriculum.status}
              </Badge>
            </div>
          ))}
          
          {curricula.length > 3 && (
            <div className="text-center pt-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="/plan">
                  View all {curricula.length} topics
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [todayItems, setTodayItems] = useState<PlanItem[]>([]);
  const [weeklyItems, setWeeklyItems] = useState<PlanItem[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCopilotInvite, setShowCopilotInvite] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (!currentUser.has_completed_copilot) {
        setShowCopilotInvite(true);
      }

      const today = format(new Date(), &apos;yyyy-MM-dd&apos;);
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

      const todayPlanItems = await PlanItem.filter({
        user_id: currentUser.id,
        scheduled_date: today
      }, &apos;scheduled_index&apos;);

      const weeklyPlanItems = await PlanItem.filter({
        user_id: currentUser.id,
        scheduled_date: {
          $gte: format(weekStart, &apos;yyyy-MM-dd&apos;),
          $lte: format(weekEnd, &apos;yyyy-MM-dd&apos;)
        }
      });

      const allItems = [...todayPlanItems, ...weeklyPlanItems];
      if (allItems.length > 0) {
        const taskIds = [...new Set(allItems.map(item => item.task_id))];
        const relatedTasks = await Task.filter({ id: { $in: taskIds } });
        const taskMap: Record<string, Task> = {};
        relatedTasks.forEach(task => {
          taskMap[task.id] = task;
        });
        setTasks(taskMap);
      }

      const activeCurricula = await Curriculum.filter({
        user_id: currentUser.id,
        status: &apos;active&apos;
      }, &apos;-created_date&apos;);

      const allTopics = await Topic.list();

      setTodayItems(todayPlanItems);
      setWeeklyItems(weeklyPlanItems);
      setCurricula(activeCurricula);
      setTopics(allTopics);

      await Event.create({
        user_id: currentUser.id,
        event_name: &apos;home_viewed&apos;,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(&apos;Error loading home data:&apos;, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissCopilotInvite = async () => {
    setShowCopilotInvite(false);
    try {
      await Event.create({
        user_id: user!.id,
        event_name: &apos;copilot_invite_dismissed&apos;,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(&apos;Error logging copilot dismiss:&apos;, error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.full_name?.split(&apos; &apos;)[0] || &apos;Learner&apos;}!
            </h1>
            <p className="text-gray-600">
              {format(new Date(), &apos;EEEE, MMMM d, yyyy&apos;)}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                {user?.streak_days || 0} day streak
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-500" />
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                {user?.xp || 0} XP
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Copilot Invite Card */}
      {showCopilotInvite && (
        <CopilotInviteCard onDismiss={handleDismissCopilotInvite} />
      )}

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TodayOverview todayItems={todayItems} tasks={tasks} user={user!} />
        <WeeklyOverview weeklyItems={weeklyItems} tasks={tasks} />
        <ActiveTopics curricula={curricula} />
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-gray-600" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" asChild>
              <a href="/today">
                <Play className="w-6 h-6" />
                <span className="text-sm">Start Learning</span>
              </a>
            </Button>
            
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" asChild>
              <a href="/copilot">
                <MessageCircle className="w-6 h-6" />
                <span className="text-sm">New Plan</span>
              </a>
            </Button>
            
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" asChild>
              <a href="/library">
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">Browse Library</span>
              </a>
            </Button>
            
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" asChild>
              <a href="/insights">
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">View Progress</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
