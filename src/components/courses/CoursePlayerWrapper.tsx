import { useParams } from 'react-router-dom';
import CoursePlayer from './CoursePlayer';

const CoursePlayerWrapper = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();

  if (!courseId || !lessonId) {
    return <div>Invalid course or module ID</div>;
  }

  return (
    <CoursePlayer
      courseId={courseId}
      lessonId={lessonId}
      onComplete={id => console.log('Module completed:', id)}
    />
  );
};

export default CoursePlayerWrapper;