import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/courses/CourseCard';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Play,
  Calendar,
  Bell
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ first_name?: string; last_name?: string }>({});

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Mock data
  const enrolledCourses = [
    {
      id: '1',
      title: 'Cybersecurity for Professionals',
      description: 'Comprehensive cybersecurity training covering threat detection and response',
      instructor: 'Dr. Sarah Mitchell',
      duration: '24 hours',
      students: 1543,
      rating: 4.9,
      level: 'Advanced' as const,
      price: 149,
      image: '',
      progress: 75,
      isEnrolled: true
    },
    {
      id: '2',
      title: 'AI for Professionals',
      description: 'Master artificial intelligence and machine learning implementation',
      instructor: 'Prof. Michael Chen',
      duration: '28 hours',
      students: 2187,
      rating: 4.8,
      level: 'Advanced' as const,
      price: 159,
      image: '',
      progress: 45,
      isEnrolled: true
    }
  ];

  const recentActivity = [
    { id: 1, type: 'completed', course: 'Advanced React Development', lesson: 'Custom Hooks', time: '2 hours ago' },
    { id: 2, type: 'started', course: 'Python for Data Science', lesson: 'Data Visualization', time: '1 day ago' },
    { id: 3, type: 'completed', course: 'UI/UX Design Fundamentals', lesson: 'Color Theory', time: '2 days ago' },
  ];

  const stats = {
    totalCourses: 5,
    completedCourses: 2,
    totalHours: 45,
    streak: 7
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back {profile.first_name? `, ${profile.first_name} ${profile.last_name}!` : '!'} 👋
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey. You're doing great!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-primary text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                <BookOpen className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-white/80">Active learning paths</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Trophy className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedCourses}</div>
                <p className="text-xs text-muted-foreground">Courses finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalHours}</div>
                <p className="text-xs text-muted-foreground">Total time invested</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.streak} days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Continue Learning */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Continue Learning</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/enrolled')}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{course.title}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/course/${course.id}`)}
                          className="bg-gradient-primary hover:opacity-90"
                        >
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity & Upcoming */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === 'completed' ? 'bg-success' : 'bg-primary'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">
                                {activity.type === 'completed' ? 'Completed' : 'Started'}
                              </span>{' '}
                              <span className="text-muted-foreground">{activity.lesson}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.course} • {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;