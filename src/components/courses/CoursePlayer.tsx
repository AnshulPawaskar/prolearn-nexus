import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  CheckCircle,
  PlayCircle,
  FileText,
  ClipboardCheck,
  Code2,
  Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCourse } from './courseData';
import VideoStage from './modules/VideoStage';
import PdfStage from './modules/PdfStage';
import AssessmentStage from './modules/AssessmentStage';
import CodingStage from './modules/CodingStage';

interface CoursePlayerProps {
  courseId: string;
  lessonId: string; // here lessonId is the moduleId
  onComplete?: (moduleId: string) => void;
}

type Stage = 'content' | 'assessment' | 'coding' | 'done';

const STAGE_ORDER: Stage[] = ['content', 'assessment', 'coding', 'done'];

const STORAGE_KEY = (courseId: string) => `course-progress-${courseId}`;

type Progress = Record<string, { completed: boolean; stage: Stage }>;

const loadProgress = (courseId: string): Progress => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(courseId)) || '{}');
  } catch {
    return {};
  }
};
const saveProgress = (courseId: string, p: Progress) =>
  localStorage.setItem(STORAGE_KEY(courseId), JSON.stringify(p));

const CoursePlayer = ({ courseId, lessonId, onComplete }: CoursePlayerProps) => {
  const navigate = useNavigate();
  const course = getCourse(courseId);
  const moduleIdx = Math.max(
    0,
    course.modules.findIndex(m => m.id === lessonId),
  );
  const currentModule = course.modules[moduleIdx];

  const [progress, setProgress] = useState<Progress>(() => loadProgress(courseId));
  const [stage, setStage] = useState<Stage>(
    () => progress[currentModule.id]?.stage ?? 'content',
  );

  useEffect(() => {
    setStage(progress[currentModule.id]?.stage ?? 'content');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModule.id]);

  const updateStage = (next: Stage) => {
    setStage(next);
    const np = {
      ...progress,
      [currentModule.id]: {
        completed: next === 'done',
        stage: next,
      },
    };
    setProgress(np);
    saveProgress(courseId, np);
  };

  const switchModule = (id: string) => {
    navigate(`/course/${courseId}/lesson/${id}`);
  };

  const completedCount = course.modules.filter(
    m => progress[m.id]?.completed,
  ).length;
  const coursePct = Math.round((completedCount / course.modules.length) * 100);

  const handleContentDone = () => updateStage('assessment');
  const handleAssessmentDone = () => updateStage('coding');
  const handleCodingDone = () => {
    updateStage('done');
    onComplete?.(currentModule.id);
    // auto-advance to next module if present
    const next = course.modules[moduleIdx + 1];
    if (next) {
      setTimeout(() => switchModule(next.id), 400);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/course/${courseId}`)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="min-w-0">
                <h1 className="font-semibold truncate">{currentModule.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Module {moduleIdx + 1} of {course.modules.length} · {course.title}
                </p>
              </div>
            </div>
            {progress[currentModule.id]?.completed && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <div className="space-y-2">
                  <Progress value={coursePct} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {coursePct}% complete · {completedCount}/{course.modules.length} modules
                  </p>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Modules</CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-1">
                {course.modules.map((m, i) => {
                  const p = progress[m.id];
                  const isActive = m.id === currentModule.id;
                  const prevDone = i === 0 || progress[course.modules[i - 1].id]?.completed;
                  const unlocked = isActive || prevDone || p?.completed;
                  return (
                    <button
                      key={m.id}
                      onClick={() => unlocked && switchModule(m.id)}
                      disabled={!unlocked}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isActive
                          ? 'border-primary bg-primary/5'
                          : unlocked
                          ? 'border-transparent hover:bg-muted/50'
                          : 'border-transparent opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {m.content.kind === 'video' ? (
                              <PlayCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-sm font-medium truncate">
                              {i + 1}. {m.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ClipboardCheck className="w-3 h-3" /> Quiz
                            </span>
                            <span className="flex items-center gap-1">
                              <Code2 className="w-3 h-3" /> Code
                            </span>
                          </div>
                        </div>
                        {p?.completed ? (
                          <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        ) : !unlocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main stage area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Stage stepper */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  {(['content', 'assessment', 'coding'] as Stage[]).map((s, i) => {
                    const reached = STAGE_ORDER.indexOf(stage) >= STAGE_ORDER.indexOf(s);
                    const done =
                      STAGE_ORDER.indexOf(stage) > STAGE_ORDER.indexOf(s) ||
                      stage === 'done';
                    const Icon =
                      s === 'content'
                        ? currentModule.content.kind === 'video'
                          ? PlayCircle
                          : FileText
                        : s === 'assessment'
                        ? ClipboardCheck
                        : Code2;
                    const label =
                      s === 'content'
                        ? currentModule.content.kind === 'video'
                          ? 'Video'
                          : 'PDF'
                        : s === 'assessment'
                        ? 'Assessment'
                        : 'Coding';
                    return (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <div
                          className={`flex items-center gap-2 p-2 rounded-lg flex-1 ${
                            reached ? 'bg-primary/5 text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {i + 1}. {label}
                          </span>
                          {done && <CheckCircle className="w-4 h-4 text-success ml-auto" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {stage === 'content' &&
              (currentModule.content.kind === 'video' ? (
                <VideoStage
                  content={currentModule.content}
                  onComplete={handleContentDone}
                />
              ) : (
                <PdfStage
                  content={currentModule.content}
                  onComplete={handleContentDone}
                />
              ))}

            {stage === 'assessment' && (
              <AssessmentStage
                questions={currentModule.assessment}
                onComplete={handleAssessmentDone}
              />
            )}

            {stage === 'coding' && (
              <CodingStage
                problem={currentModule.coding}
                onComplete={handleCodingDone}
              />
            )}

            {stage === 'done' && (
              <Card className="border-success">
                <CardContent className="p-6 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-success mx-auto" />
                  <h2 className="text-xl font-semibold">Module Complete!</h2>
                  <p className="text-muted-foreground">
                    Great work. {course.modules[moduleIdx + 1]
                      ? 'Moving to the next module...'
                      : 'You have completed all modules in this course.'}
                  </p>
                  <div className="flex justify-center gap-2 pt-2">
                    <Button variant="outline" onClick={() => navigate(`/course/${courseId}`)}>
                      Back to Course
                    </Button>
                    {course.modules[moduleIdx + 1] && (
                      <Button onClick={() => switchModule(course.modules[moduleIdx + 1].id)}>
                        Next Module
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
