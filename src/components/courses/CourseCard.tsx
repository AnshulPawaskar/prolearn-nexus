import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Star, PlayCircle } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  progress?: number;
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
  onView?: (courseId: string) => void;
}

const CourseCard = ({ 
  id, 
  title, 
  description, 
  duration,
  image, 
  level, 
  progress, 
  isEnrolled = false,
  onEnroll,
  onView
}: CourseCardProps) => {
  return (
    <Card className="group hover:shadow-course transition-all duration-300 bg-course-card border border-border overflow-hidden">
      <div className="aspect-video bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-primary">
            {level}
          </Badge>
        </div>
        {isEnrolled && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-success text-success-foreground">
              Enrolled
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform" />
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEnrolled && progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          {!isEnrolled ? (
            <>
              {/* <span className="text-2xl font-bold text-primary">${price}</span> */}
              <Button 
                onClick={() => onEnroll?.(id)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Enroll Now
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => onView?.(id)}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              Continue Learning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;