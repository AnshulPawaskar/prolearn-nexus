import { useParams, useNavigate } from 'react-router-dom';
import CoursePlayer from './CoursePlayer';

const CoursePlayerWrapper = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  const handleComplete = (completedLessonId: string) => {
    console.log('Lesson completed:', completedLessonId);
    // In a real app, this would update the lesson completion status
  };

  const handleNext = (nextLessonId: string) => {
    navigate(`/course/${courseId}/lesson/${nextLessonId}`);
  };

  if (!courseId || !lessonId) {
    return <div>Invalid course or lesson ID</div>;
  }

  return (
    <CoursePlayer
      courseId={courseId}
      lessonId={lessonId}
      onComplete={handleComplete}
      onNext={handleNext}
    />
  );
};

export default CoursePlayerWrapper;