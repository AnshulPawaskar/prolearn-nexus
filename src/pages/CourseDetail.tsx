import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  CheckCircle,
  Lock,
  PlayCircle,
  Download,
  MessageSquare,
  BookOpen,
  Award
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock course data - in a real app, this would be fetched based on the ID
  const course = {
    id: id || '1',
    title: 'Advanced React Development',
    description: 'Master React hooks, context, and advanced patterns for building scalable applications. Learn from real-world projects and industry best practices.',
    duration: '12 hours',
    level: 'Advanced',
    image: '',
    progress: 75,
    isEnrolled: true,
    lastWatched: 'Custom Hooks Deep Dive',
    completionRate: 89,
    skills: ['React Hooks', 'Context API', 'Performance Optimization', 'Testing'],
    requirements: ['Basic React knowledge', 'JavaScript ES6+', 'HTML/CSS fundamentals'],
    whatYouWillLearn: [
      'Advanced React patterns and best practices',
      'Custom hooks development and optimization',
      'State management with Context API',
      'Performance optimization techniques',
      'Testing React components effectively',
      'Real-world project development'
    ]
  };

  const curriculum = [
    {
      id: 1,
      title: 'Introduction to Advanced React',
      lessons: [
        { id: 1, title: 'Course Overview', duration: '5:30', completed: true, locked: false },
        { id: 2, title: 'Setting up the Environment', duration: '8:15', completed: true, locked: false },
        { id: 3, title: 'Advanced Component Patterns', duration: '15:20', completed: true, locked: false }
      ]
    },
    {
      id: 2,
      title: 'Custom Hooks Mastery',
      lessons: [
        { id: 4, title: 'Understanding Custom Hooks', duration: '12:45', completed: true, locked: false },
        { id: 5, title: 'Building Reusable Hooks', duration: '18:30', completed: true, locked: false },
        { id: 6, title: 'Custom Hooks Deep Dive', duration: '22:15', completed: false, locked: false, current: true }
      ]
    },
    {
      id: 3,
      title: 'Context API & State Management',
      lessons: [
        { id: 7, title: 'Context API Fundamentals', duration: '14:20', completed: false, locked: false },
        { id: 8, title: 'Advanced Context Patterns', duration: '16:45', completed: false, locked: false },
        { id: 9, title: 'State Management Best Practices', duration: '20:10', completed: false, locked: false }
      ]
    },
    {
      id: 4,
      title: 'Performance Optimization',
      lessons: [
        { id: 10, title: 'React.memo and useMemo', duration: '13:25', completed: false, locked: true },
        { id: 11, title: 'Code Splitting Strategies', duration: '17:30', completed: false, locked: true },
        { id: 12, title: 'Performance Monitoring', duration: '11:15', completed: false, locked: true }
      ]
    }
  ];


  const totalLessons = curriculum.reduce((acc, section) => acc + section.lessons.length, 0);
  const completedLessons = curriculum.reduce((acc, section) => 
    acc + section.lessons.filter(lesson => lesson.completed).length, 0
  );

  const handleStartLesson = (lessonId: number) => {
    navigate(`/course/${id}/lesson/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="mb-8">
                <div className="aspect-video bg-gradient-primary rounded-lg mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                      onClick={() => course.isEnrolled ? handleStartLesson(6) : undefined}
                    >
                      <Play className="w-6 h-6 mr-2" />
                      {course.isEnrolled ? 'Continue Learning' : 'Preview Course'}
                    </Button>
                  </div>
                  {course.isEnrolled && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enrolled
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground mb-4">{course.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    {/* <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="ml-1">({course.reviews} reviews)</span> */}
                  </div>
                  <div className="flex items-center">
                    {/* <Users className="w-4 h-4 mr-1" />
                    <span>{course.students} students</span> */}
                  </div>
                  <div className="flex items-center">
                    {/* <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}</span> */}
                  </div>
                </div>

                {course.isEnrolled && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Your Progress</span>
                      <span className="text-sm font-medium">{completedLessons}/{totalLessons} lessons completed</span>
                    </div>
                    <Progress value={(completedLessons / totalLessons) * 100} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Last watched: {course.lastWatched}
                    </p>
                  </div>
                )}
              </div>

              {/* Course Content Tabs */}
              <Tabs defaultValue="curriculum" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {/* <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger> */}
                </TabsList>

                <TabsContent value="curriculum" className="mt-6">
                  <div className="space-y-4">
                    {curriculum.map((section, sectionIndex) => (
                      <Card key={section.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Section {sectionIndex + 1}: {section.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {section.lessons.map((lesson) => (
                              <div 
                                key={lesson.id} 
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  lesson.current ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  {lesson.completed ? (
                                    <CheckCircle className="w-5 h-5 text-success" />
                                  ) : lesson.locked ? (
                                    <Lock className="w-5 h-5 text-muted-foreground" />
                                  ) : (
                                    <PlayCircle className="w-5 h-5 text-primary" />
                                  )}
                                  <div>
                                    <p className={`font-medium ${lesson.current ? 'text-primary' : ''}`}>
                                      {lesson.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {lesson.current && (
                                    <Badge variant="outline">Current</Badge>
                                  )}
                                  {!lesson.locked && course.isEnrolled && (
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => handleStartLesson(lesson.id)}
                                    >
                                      {lesson.completed ? 'Review' : 'Start'}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>What you'll learn</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {course.whatYouWillLearn.map((item, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {course.requirements.map((req, index) => (
                            <li key={index} className="text-sm flex items-start space-x-2">
                              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Skills you'll gain</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {course.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  {!course.isEnrolled ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-primary">Free</span>
                        </div>
                      <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                        Enroll Now
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button 
                        className="w-full bg-gradient-primary hover:opacity-90" 
                        size="lg"
                        onClick={() => handleStartLesson(6)}
                      >
                        Continue Learning
                      </Button>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t space-y-4">
                    <h3 className="font-semibold">This course includes:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="w-4 h-4 text-muted-foreground" />
                        <span>{course.duration} on-demand video</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <span>Downloadable resources</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span>Assignments and projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span>Q&A support</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;