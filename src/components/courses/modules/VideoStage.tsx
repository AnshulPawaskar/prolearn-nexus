import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ChevronRight } from 'lucide-react';
import type { VideoContent, InVideoQuestion } from './courseData';

interface Props {
  content: VideoContent;
  onComplete: () => void;
}

const VideoStage = ({ content, onComplete }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [askedIdx, setAskedIdx] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<InVideoQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (active) return;
      content.questions.forEach((q, i) => {
        if (!askedIdx.has(i) && v.currentTime >= q.atSeconds) {
          v.pause();
          setActive(q);
          setSelected(null);
          setFeedback(null);
          setAskedIdx(prev => new Set(prev).add(i));
        }
      });
    };
    const onEnd = () => setWatched(true);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', onEnd);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', onEnd);
    };
  }, [active, askedIdx, content.questions]);

  const submitAnswer = () => {
    if (selected === null || !active) return;
    setFeedback(selected === active.correct ? 'correct' : 'wrong');
  };

  const closeAnswer = () => {
    setActive(null);
    setFeedback(null);
    setSelected(null);
    videoRef.current?.play();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Watch the video</CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive questions will appear during playback.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={content.url}
            poster={content.poster}
            controls
            className="w-full h-full"
          />
          {active && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm p-6 flex items-center justify-center">
              <Card className="w-full max-w-lg">
                <CardHeader>
                  <CardTitle className="text-base">In-video question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="font-medium">{active.question}</p>
                  <div className="space-y-2">
                    {active.options.map((opt, i) => (
                      <button
                        key={i}
                        disabled={feedback !== null}
                        onClick={() => setSelected(i)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selected === i
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <span className="text-sm">
                          {String.fromCharCode(65 + i)}. {opt}
                        </span>
                      </button>
                    ))}
                  </div>
                  {feedback && (
                    <div
                      className={`text-sm font-medium ${
                        feedback === 'correct' ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {feedback === 'correct'
                        ? 'Correct! Continuing...'
                        : `Not quite. Correct answer: ${String.fromCharCode(
                            65 + active.correct,
                          )}.`}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    {feedback === null ? (
                      <Button onClick={submitAnswer} disabled={selected === null}>
                        Submit
                      </Button>
                    ) : (
                      <Button onClick={closeAnswer}>Continue</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            {watched && <CheckCircle className="w-4 h-4 text-success" />}
            {watched ? 'Video completed' : 'Watch to the end to continue'}
          </div>
          <Button onClick={onComplete} disabled={!watched}>
            Continue to Assessment
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoStage;
