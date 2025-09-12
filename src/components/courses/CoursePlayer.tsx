import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  FileText,
  PlayCircle,
  MessageSquare,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CoursePlayerProps {
  courseId: string;
  lessonId: string;
  onComplete?: (lessonId: string) => void;
  onNext?: (nextLessonId: string) => void;
}

const CoursePlayer = ({ courseId, lessonId, onComplete, onNext }: CoursePlayerProps) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showRemedialContent, setShowRemedialContent] = useState(false);
  const [currentRemedialSlide, setCurrentRemedialSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [hasFailedQuiz, setHasFailedQuiz] = useState(false);
  const passingScore = 50;

  // Mock course data with all lessons
  const courseData = {
    id: courseId,
    title: courseId === '1' ? 'Cybersecurity for Professionals' : 'AI for Professionals',
    lessons: [
      {
        id: '1',
        title: 'Introduction to Cybersecurity',
        type: 'video' as const,
        duration: '15:30',
        completed: false,
        content: {
          video: {
            url: 'https://example.com/video1.mp4',
            duration: 930,
            transcript: 'Welcome to Cybersecurity Fundamentals. In this comprehensive module, we will explore the essential concepts that form the foundation of modern cybersecurity practices...'
          }
        }
      },
      {
        id: '2',
        title: 'Threat Landscape Overview',
        type: 'slides' as const,
        duration: '12:00',
        completed: false,
        content: {
          slides: [
            {
              id: 1,
              title: 'Current Threat Environment',
              content: 'Understanding the modern cybersecurity threat landscape and its evolution.',
              points: ['Advanced Persistent Threats (APTs)', 'Ransomware Evolution', 'State-sponsored Attacks', 'Insider Threats']
            },
            {
              id: 2,
              title: 'Attack Vectors and Methods',
              content: 'Common methods used by cybercriminals to compromise systems and networks.',
              points: ['Email-based Attacks', 'Web Application Exploits', 'Network Intrusions', 'Social Engineering']
            }
          ]
        }
      },
      {
        id: '3',
        title: 'Risk Assessment Fundamentals',
        type: 'video' as const,
        duration: '18:45',
        completed: false,
        content: {
          video: {
            url: 'https://example.com/video3.mp4',
            duration: 1125,
            transcript: 'Risk assessment is a critical component of cybersecurity management. This module covers systematic approaches to identifying, analyzing, and evaluating security risks...'
          }
        }
      },
      {
        id: '4',
        title: 'Security Controls Implementation',
        type: 'slides' as const,
        duration: '20:15',
        completed: false,
        content: {
          slides: [
            {
              id: 1,
              title: 'Preventive Controls',
              content: 'Security measures designed to prevent security incidents before they occur.',
              points: ['Firewalls and Network Security', 'Access Controls', 'Encryption Technologies', 'Security Awareness Training']
            },
            {
              id: 2,
              title: 'Detective Controls',
              content: 'Tools and processes to identify security threats and incidents as they happen.',
              points: ['Intrusion Detection Systems (IDS)', 'Log Monitoring', 'Vulnerability Scanning', 'Security Information and Event Management (SIEM)']
            },
            {
              id: 3,
              title: 'Corrective Controls',
              content: 'Actions taken to address security incidents and vulnerabilities after detection.',
              points: ['Incident Response Plans', 'Patch Management', 'System Recovery Procedures', 'Lessons Learned Process']
            }
          ]
        }
      },
      {
        id: '5',
        title: 'Incident Response Planning',
        type: 'video' as const,
        duration: '25:20',
        completed: false,
        content: {
          video: {
            url: 'https://example.com/video5.mp4',
            duration: 1520,
            transcript: 'Effective incident response is crucial for minimizing the impact of security breaches. This module covers the development and implementation of comprehensive incident response plans...'
          }
        }
      },
      {
        id: '6',
        title: 'Compliance and Governance',
        type: 'slides' as const,
        duration: '16:40',
        completed: false,
        content: {
          slides: [
            {
              id: 1,
              title: 'Regulatory Compliance',
              content: 'Understanding key cybersecurity regulations and compliance requirements.',
              points: ['GDPR Requirements', 'SOX Compliance', 'HIPAA Security Rule', 'PCI DSS Standards']
            },
            {
              id: 2,
              title: 'Governance Framework',
              content: 'Establishing effective cybersecurity governance structures within organizations.',
              points: ['Board-level Oversight', 'Risk Management Committees', 'Security Policies and Procedures', 'Performance Metrics and KPIs']
            }
          ]
        }
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'Which of the following is NOT part of the CIA triad in cybersecurity?',
          options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
          correct: 3
        },
        {
          id: 2,
          question: 'What type of attack uses deceptive emails to steal sensitive information?',
          options: ['Malware', 'Phishing', 'DoS Attack', 'SQL Injection'],
          correct: 1
        },
        {
          id: 3,
          question: 'Which framework is commonly used for cybersecurity risk management?',
          options: ['ITIL', 'NIST', 'COBIT', 'PRINCE2'],
          correct: 1
        },
        {
          id: 4,
          question: 'What is the primary purpose of access controls in cybersecurity?',
          options: ['Increase performance', 'Restrict unauthorized access', 'Backup data', 'Monitor network traffic'],
          correct: 1
        }
      ]
    },
    remedialSlides: [
      {
        id: 1,
        title: 'Remedial: Cybersecurity Basics Review',
        content: 'Let\'s review the fundamental concepts of cybersecurity that are essential for understanding this module.',
        points: ['Information Security Triad (CIA)', 'Basic Threat Types and Classifications', 'Security Policies and Procedures', 'Risk Management Fundamentals']
      },
      {
        id: 2,
        title: 'Remedial: Understanding Threats in Detail',
        content: 'A comprehensive review of common cyber threats and their impact on organizations.',
        points: ['Types of Malware Explained', 'Phishing Attack Patterns', 'Social Engineering Tactics', 'Vulnerability Assessment Methods']
      }
    ]
  };

  const currentLesson = courseData.lessons.find(lesson => lesson.id === lessonId) || courseData.lessons[0];

  useEffect(() => {
    if (currentLesson.type === 'video') {
      setDuration(currentLesson.content.video?.duration || 0);
    }
    // Reset states when lesson changes
    setShowQuiz(false);
    setQuizCompleted(false);
    setQuizAnswers({});
    setShowRemedialContent(false);
    setCurrentSlide(0);
    setCurrentTime(0);
    setHasFailedQuiz(false);
  }, [lessonId, currentLesson]);

  const handleLessonSwitch = (newLessonId: string) => {
    navigate(`/course/${courseId}/lesson/${newLessonId}`);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSlideNavigation = (direction: 'prev' | 'next') => {
    const slides = currentLesson.content.slides || [];
    if (direction === 'prev' && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (direction === 'next' && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleCompleteContent = () => {
    setShowQuiz(true);
  };

  const handleQuizAnswer = (questionId: number, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex });
  };

  const handleCompleteQuiz = () => {
    const score = getQuizScore();
    setQuizScore(score);
    setQuizCompleted(true);
    
    if (score < passingScore) {
      setHasFailedQuiz(true);
      setShowRemedialContent(true);
    } else {
      setLessonCompleted(true);
      onComplete?.(lessonId);
    }
  };

  const handleCompleteRemedial = () => {
    setShowRemedialContent(false);
    setQuizAnswers({});
    setQuizCompleted(false);
    setHasFailedQuiz(false);
    setShowQuiz(true);
  };

  const getQuizScore = () => {
    const questions = courseData.quiz.questions;
    const correct = questions.filter(q => quizAnswers[q.id] === q.correct).length;
    return Math.round((correct / questions.length) * 100);
  };

  const calculateCourseProgress = () => {
    const completedLessons = courseData.lessons.filter(l => l.completed).length;
    return Math.round((completedLessons / courseData.lessons.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/course/${courseId}`)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Course
              </Button>
              <div>
                <h1 className="font-semibold">{currentLesson.title}</h1>
                <p className="text-sm text-muted-foreground">Lesson {lessonId} of {courseData.lessons.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{currentLesson.duration}</span>
              {lessonCompleted && (
                <Badge variant="default" className="bg-success text-success-foreground">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course Progress Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{courseData.title}</CardTitle>
                <div className="space-y-2">
                  <Progress value={calculateCourseProgress()} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {calculateCourseProgress()}% Complete
                  </p>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {courseData.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSwitch(lesson.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        lesson.id === lessonId
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-transparent hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2">
                            {lesson.type === 'video' ? (
                              <PlayCircle className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <FileText className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium">{lesson.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          </div>
                        </div>
                        {lesson.completed && (
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {showRemedialContent ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <CardTitle className="text-lg text-destructive">Remedial Content Required</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You scored {quizScore}% on the quiz. Please review this remedial content before retaking the quiz.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{courseData.remedialSlides[currentRemedialSlide].title}</CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {currentRemedialSlide + 1} / {courseData.remedialSlides.length}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          {courseData.remedialSlides[currentRemedialSlide].content}
                        </p>
                        
                        <ul className="space-y-2">
                          {courseData.remedialSlides[currentRemedialSlide].points?.map((point, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentRemedialSlide(Math.max(0, currentRemedialSlide - 1))}
                        disabled={currentRemedialSlide === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      
                      {currentRemedialSlide === courseData.remedialSlides.length - 1 ? (
                        <Button onClick={handleCompleteRemedial}>
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Retake Quiz
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => setCurrentRemedialSlide(Math.min(courseData.remedialSlides.length - 1, currentRemedialSlide + 1))}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : showQuiz ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Knowledge Check</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {Object.keys(quizAnswers).length} / {courseData.quiz.questions.length} answered
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {courseData.quiz.questions.map((question, qIndex) => (
                      <Card key={question.id}>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Question {qIndex + 1}: {question.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <button
                                key={oIndex}
                                onClick={() => handleQuizAnswer(question.id, oIndex)}
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                  quizAnswers[question.id] === oIndex
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:bg-muted/50'
                                }`}
                              >
                                <span className="flex items-center space-x-2">
                                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-xs">
                                    {String.fromCharCode(65 + oIndex)}
                                  </span>
                                  <span>{option}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="flex justify-between items-center pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowQuiz(false)}
                      >
                        Back to Lesson
                      </Button>
                      <Button 
                        onClick={handleCompleteQuiz}
                        disabled={Object.keys(quizAnswers).length < courseData.quiz.questions.length}
                      >
                        Submit Quiz
                      </Button>
                    </div>

                    {quizCompleted && (
                      <Card className={`${quizScore >= passingScore ? 'border-success' : 'border-destructive'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            {quizScore >= passingScore ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <XCircle className="w-5 h-5 text-destructive" />
                            )}
                            <div>
                              <p className="font-medium">
                                Quiz {quizScore >= passingScore ? 'Passed' : 'Failed'}: {quizScore}%
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {quizScore >= passingScore 
                                  ? 'Congratulations! You can now proceed to the next lesson.'
                                  : 'Please review the remedial content and retake the quiz.'
                                }
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  {currentLesson.type === 'video' ? (
                    <div className="space-y-4">
                      {/* Video Player */}
                      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-primary/20 flex items-center justify-center">
                          <Button 
                            size="lg"
                            onClick={handlePlayPause}
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                          >
                            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                          </Button>
                        </div>
                      </div>

                      {/* Video Controls */}
                      <div className="space-y-2">
                        <Progress value={(currentTime / duration) * 100} className="h-2" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
                              <SkipBack className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handlePlayPause}>
                              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}>
                              <SkipForward className="w-4 h-4" />
                            </Button>
                            <Volume2 className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                      </div>

                      {/* Transcript */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Transcript</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {currentLesson.content.video?.transcript}
                          </p>
                        </CardContent>
                      </Card>

                      <div className="flex justify-end pt-4">
                        <Button onClick={handleCompleteContent}>
                          Proceed to Quiz
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Slide Display */}
                      <Card className="min-h-[400px]">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{currentLesson.content.slides?.[currentSlide]?.title}</CardTitle>
                            <span className="text-sm text-muted-foreground">
                              {currentSlide + 1} / {currentLesson.content.slides?.length || 0}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">
                            {currentLesson.content.slides?.[currentSlide]?.content}
                          </p>
                          
                          {currentLesson.content.slides?.[currentSlide]?.points && (
                            <ul className="space-y-2">
                              {currentLesson.content.slides[currentSlide].points!.map((point, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm">{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>

                      {/* Slide Navigation */}
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => handleSlideNavigation('prev')}
                          disabled={currentSlide === 0}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        <div className="flex space-x-1">
                          {currentLesson.content.slides?.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`w-3 h-3 rounded-full ${
                                index === currentSlide ? 'bg-primary' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        
                        {currentSlide === (currentLesson.content.slides?.length || 0) - 1 ? (
                          <Button onClick={handleCompleteContent}>
                            Proceed to Quiz
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            onClick={() => handleSlideNavigation('next')}
                            disabled={currentSlide === (currentLesson.content.slides?.length || 0) - 1}
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
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