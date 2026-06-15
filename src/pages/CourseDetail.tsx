import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  CheckCircle,
  Lock,
  PlayCircle,
  FileText,
  ClipboardCheck,
  Code2,
  Download,
  MessageSquare,
  BookOpen,
  Award,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse } from '@/components/courses/courseData';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = id || '1';
  const course = getCourse(courseId);

  // Read per-module completion from local progress
  let progress: Record<string, { completed: boolean }> = {};
  try {
    progress = JSON.parse(localStorage.getItem(`course-progress-${courseId}`) || '{}');
  } catch {
    /* noop */
  }

  const completedCount = course.modules.filter(m => progress[m.id]?.completed).length;
  const totalModules = course.modules.length;
  const pct = Math.round((completedCount / totalModules) * 100);

  const firstIncomplete =
    course.modules.find(m => !progress[m.id]?.completed) ?? course.modules[0];

  const handleStart = (moduleId: string) => {
    navigate(`/course/${courseId}/lesson/${moduleId}`);
  };

  const meta = {
    description:
      'Structured modules combining instructional content, assessments, and hands-on coding challenges.',
    level: 'Professional',
    duration: `${totalModules} modules`,
  };



  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="aspect-video bg-gradient-primary rounded-lg mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                      onClick={() => handleStart(firstIncomplete.id)}
                    >
                      <Play className="w-6 h-6 mr-2" />
                      {completedCount > 0 ? 'Continue Learning' : 'Start Course'}
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enrolled
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{meta.level}</Badge>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground mb-4">{meta.description}</p>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Your Progress</span>
                    <span className="text-sm font-medium">
                      {completedCount}/{totalModules} modules
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              </div>

              <Tabs defaultValue="curriculum" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="mt-6">
                  <div className="space-y-4">
                    {course.modules.map((m, i) => {
                      const done = !!progress[m.id]?.completed;
                      const prevDone = i === 0 || !!progress[course.modules[i - 1].id]?.completed;
                      const locked = !done && !prevDone;
                      return (
                        <Card
                          key={m.id}
                          className={done ? 'border-success/50' : ''}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between gap-2">
                              <CardTitle className="text-lg">
                                Module {i + 1}: {m.title}
                              </CardTitle>
                              {done ? (
                                <Badge className="bg-success text-success-foreground">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                              ) : locked ? (
                                <Badge variant="outline">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Locked
                                </Badge>
                              ) : (
                                <Badge variant="outline">In progress</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="flex items-center gap-2 p-2 rounded bg-muted/50 text-sm">
                                {m.content.kind === 'video' ? (
                                  <PlayCircle className="w-4 h-4 text-primary" />
                                ) : (
                                  <FileText className="w-4 h-4 text-primary" />
                                )}
                                <span>
                                  1. {m.content.kind === 'video' ? 'Interactive Video' : 'PDF Reading'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 p-2 rounded bg-muted/50 text-sm">
                                <ClipboardCheck className="w-4 h-4 text-primary" />
                                <span>2. Assessment ({m.assessment.length} Qs)</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 rounded bg-muted/50 text-sm">
                                <Code2 className="w-4 h-4 text-primary" />
                                <span>3. Coding Challenge</span>
                              </div>
                            </div>
                            <div className="flex justify-end mt-3">
                              <Button
                                size="sm"
                                variant={locked ? 'ghost' : 'default'}
                                disabled={locked}
                                onClick={() => handleStart(m.id)}
                              >
                                {done ? 'Review' : 'Start Module'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course structure</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>
                          Each module is composed of three sequential stages designed to take you
                          from concept to capability:
                        </p>
                        <ul className="space-y-1 pl-4 list-disc text-muted-foreground">
                          <li>Instructional content — a video with in-video questions, or a PDF reading.</li>
                          <li>Assessment — MCQ, true/false, fill in the blanks, and match the following.</li>
                          <li>Hands-on coding — solve a problem in Python, C, or Java with automatic grading.</li>
                        </ul>
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
                  <div className="space-y-4">
                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90"
                      size="lg"
                      onClick={() => handleStart(firstIncomplete.id)}
                    >
                      {completedCount > 0 ? 'Continue Learning' : 'Start Course'}
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t space-y-4">
                    <h3 className="font-semibold">This course includes:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="w-4 h-4 text-muted-foreground" />
                        <span>Interactive video with in-video quizzes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>PDF reading materials</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
                        <span>Mixed-format assessments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Code2 className="w-4 h-4 text-muted-foreground" />
                        <span>Hands-on coding challenges</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span>Q&A support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span>{meta.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <span>Downloadable resources</span>
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
