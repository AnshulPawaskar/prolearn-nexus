import Navigation from '@/components/layout/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  CheckCircle,
  Lock,
  PlayCircle,
  FileText,
  ClipboardCheck,
  Code2,
  Award,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse } from '@/components/courses/courseData';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = id || '1';
  const course = getCourse(courseId);

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

  const description =
    'Structured modules combining instructional content, assessments, and hands-on coding challenges.';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        {/* Compact hero */}
        <div className="rounded-xl bg-gradient-primary text-white p-5 sm:p-6 mb-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-white/20 hover:bg-white/20 text-white border-0">
                  <CheckCircle className="w-3 h-3 mr-1" /> Enrolled
                </Badge>
                <Badge variant="secondary" className="bg-white/15 text-white border-0">
                  Professional
                </Badge>
                <Badge variant="secondary" className="bg-white/15 text-white border-0">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {totalModules} modules
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight truncate">
                {course.title}
              </h1>
              <p className="text-sm text-white/80 mt-1 max-w-2xl">{description}</p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <Button
                size="lg"
                className="w-full md:w-auto bg-white text-primary hover:bg-white/90"
                onClick={() => handleStart(firstIncomplete.id)}
              >
                <Play className="w-5 h-5 mr-2" />
                {completedCount > 0 ? 'Continue' : 'Start Course'}
              </Button>
            </div>
          </div>

          <div className="relative mt-4">
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Your progress</span>
              <span>
                {completedCount}/{totalModules} · {pct}%
              </span>
            </div>
            <Progress value={pct} className="h-1.5 bg-white/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Curriculum */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Curriculum</h2>
              <span className="text-xs text-muted-foreground">
                {completedCount} of {totalModules} completed
              </span>
            </div>
            {course.modules.map((m, i) => {
              const done = !!progress[m.id]?.completed;
              const prevDone = i === 0 || !!progress[course.modules[i - 1].id]?.completed;
              const locked = !done && !prevDone;
              return (
                <Card
                  key={m.id}
                  className={`transition-colors ${
                    done ? 'border-success/40' : ''
                  } ${!locked ? 'hover:border-primary/40 cursor-pointer' : 'opacity-70'}`}
                  onClick={() => !locked && handleStart(m.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          done
                            ? 'bg-success/10 text-success'
                            : locked
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {done ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : locked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <span className="font-semibold text-sm">{i + 1}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium truncate">
                            Module {i + 1}: {m.title}
                          </h3>
                          {done && (
                            <Badge className="bg-success/10 text-success hover:bg-success/10 border-0 text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            {m.content.kind === 'video' ? (
                              <PlayCircle className="w-3.5 h-3.5" />
                            ) : (
                              <FileText className="w-3.5 h-3.5" />
                            )}
                            {m.content.kind === 'video' ? 'Video' : 'PDF'}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClipboardCheck className="w-3.5 h-3.5" />
                            {m.assessment.length} Qs
                          </span>
                          <span className="flex items-center gap-1">
                            <Code2 className="w-3.5 h-3.5" />
                            Coding
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={locked ? 'ghost' : done ? 'outline' : 'default'}
                        disabled={locked}
                        onClick={e => {
                          e.stopPropagation();
                          handleStart(m.id);
                        }}
                        className="flex-shrink-0"
                      >
                        {done ? 'Review' : locked ? 'Locked' : 'Start'}
                        {!locked && <ChevronRight className="w-4 h-4 ml-1" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="lg:sticky lg:top-6">
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-3">Course structure</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Each module follows a three-stage flow to take you from concept to capability.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">Content</div>
                      <div className="text-xs text-muted-foreground">Video or PDF reading</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">Assessment</div>
                      <div className="text-xs text-muted-foreground">MCQ, T/F, fill, match</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">Coding challenge</div>
                      <div className="text-xs text-muted-foreground">Python, C, or Java</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">Certificate</div>
                      <div className="text-xs text-muted-foreground">On completion</div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={() => handleStart(firstIncomplete.id)}
                >
                  {completedCount > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
