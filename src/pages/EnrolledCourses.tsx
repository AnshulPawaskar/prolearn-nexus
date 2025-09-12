import Navigation from '@/components/layout/Navigation';
import CourseCard from '@/components/courses/CourseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  PlayCircle,
  CheckCircle,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {
  const navigate = useNavigate();

  // Mock data
  const enrolledCourses = [
    {
      id: '1',
      title: 'Advanced React Development',
      description: 'Master React hooks, context, and advanced patterns',
      instructor: 'Sarah Chen',
      duration: '12 hours',
      students: 2341,
      rating: 4.8,
      level: 'Advanced' as const,
      price: 89,
      image: '',
      progress: 75,
      isEnrolled: true,
      enrolledAt: '2024-01-15',
      lastAccessed: '2 hours ago',
      nextLesson: 'Custom Hooks Deep Dive'
    },
    {
      id: '2',
      title: 'Python for Data Science',
      description: 'Complete guide to data analysis with Python',
      instructor: 'Dr. Michael Rodriguez',
      duration: '18 hours',
      students: 1897,
      rating: 4.9,
      level: 'Intermediate' as const,
      price: 79,
      image: '',
      progress: 45,
      isEnrolled: true,
      enrolledAt: '2024-02-01',
      lastAccessed: '1 day ago',
      nextLesson: 'Data Visualization with Matplotlib'
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn design principles and user research',
      instructor: 'Emma Wilson',
      duration: '15 hours',
      students: 3156,
      rating: 4.7,
      level: 'Beginner' as const,
      price: 65,
      image: '',
      progress: 100,
      isEnrolled: true,
      enrolledAt: '2023-12-10',
      lastAccessed: '3 days ago',
      completedAt: '2024-01-20'
    }
  ];

  const inProgressCourses = enrolledCourses.filter(course => course.progress < 100);
  const completedCourses = enrolledCourses.filter(course => course.progress === 100);

  const overallStats = {
    totalCourses: enrolledCourses.length,
    completed: completedCourses.length,
    inProgress: inProgressCourses.length,
    totalHours: 45,
    averageProgress: Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length)
  };

  const handleViewCourse = (courseId: string) => {
    // Navigate to the current lesson for enrolled courses
    const course = enrolledCourses.find(c => c.id === courseId);
    if (course && course.progress > 0) {
      // Navigate to current lesson (mock lesson ID 6 for demo)
      navigate(`/course/${courseId}/lesson/6`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Learning
            </h1>
            <p className="text-muted-foreground">
              Track your progress and continue your learning journey
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-primary text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
                <BookOpen className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.totalCourses}</div>
                <p className="text-xs text-white/80">Active courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Trophy className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.completed}</div>
                <p className="text-xs text-muted-foreground">Certificates earned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.totalHours}</div>
                <p className="text-xs text-muted-foreground">Hours invested</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <BarChart3 className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.averageProgress}%</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>
          </div>

          {/* Course Tabs */}
          <Tabs defaultValue="in-progress" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="in-progress">In Progress ({inProgressCourses.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="in-progress" className="mt-6">
              <div className="space-y-6">
                {/* Quick Continue Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
                  <div className="space-y-4">
                    {inProgressCourses.slice(0, 2).map((course) => (
                      <Card key={course.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                              <PlayCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold truncate">{course.title}</h3>
                                <Badge variant="outline">{course.level}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">by {course.instructor}</p>
                              <p className="text-sm text-muted-foreground mb-3">
                                Next: {course.nextLesson}
                              </p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Last accessed {course.lastAccessed}
                              </p>
                            </div>
                            <Button 
                              onClick={() => handleViewCourse(course.id)}
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

                {/* All In Progress Courses */}
                {inProgressCourses.length > 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">All In Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {inProgressCourses.slice(2).map((course) => (
                        <CourseCard
                          key={course.id}
                          {...course}
                          onView={handleViewCourse}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {inProgressCourses.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses in progress</h3>
                    <p className="text-muted-foreground mb-4">
                      Start learning something new today!
                    </p>
                    <Button onClick={() => navigate('/courses')}>
                      Browse Courses
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Completed Courses</h2>
                
                {completedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedCourses.map((course) => (
                      <div key={course.id} className="relative">
                        <CourseCard
                          {...course}
                          onView={handleViewCourse}
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No completed courses yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete your first course to earn certificates!
                    </p>
                    <Button onClick={() => navigate('/courses')}>
                      Start Learning
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default EnrolledCourses;