import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import type { AssessmentQuestion } from '../courseData';

interface Props {
  questions: AssessmentQuestion[];
  onComplete: () => void;
  passingScore?: number;
}

type Answer =
  | { type: 'mcq'; value: number | null }
  | { type: 'true_false'; value: boolean | null }
  | { type: 'fill_blank'; value: string }
  | { type: 'match'; value: Record<string, string> };

const initAnswer = (q: AssessmentQuestion): Answer => {
  switch (q.type) {
    case 'mcq':
      return { type: 'mcq', value: null };
    case 'true_false':
      return { type: 'true_false', value: null };
    case 'fill_blank':
      return { type: 'fill_blank', value: '' };
    case 'match':
      return { type: 'match', value: {} };
  }
};

const isCorrect = (q: AssessmentQuestion, a: Answer): boolean => {
  switch (q.type) {
    case 'mcq':
      return a.type === 'mcq' && a.value === q.correct;
    case 'true_false':
      return a.type === 'true_false' && a.value === q.correct;
    case 'fill_blank':
      return (
        a.type === 'fill_blank' &&
        a.value.trim().toLowerCase() === q.correct.trim().toLowerCase()
      );
    case 'match':
      return (
        a.type === 'match' &&
        q.pairs.every(p => a.value[p.left] === p.right)
      );
  }
};

const AssessmentStage = ({ questions, onComplete, passingScore = 60 }: Props) => {
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(questions.map(q => [q.id, initAnswer(q)])),
  );
  const [submitted, setSubmitted] = useState(false);

  const shuffledRight = useMemo(() => {
    const map: Record<string, string[]> = {};
    questions.forEach(q => {
      if (q.type === 'match') {
        map[q.id] = [...q.pairs.map(p => p.right)].sort(() => Math.random() - 0.5);
      }
    });
    return map;
  }, [questions]);

  const score = useMemo(() => {
    const correct = questions.filter(q => isCorrect(q, answers[q.id])).length;
    return Math.round((correct / questions.length) * 100);
  }, [answers, questions]);

  const allAnswered = questions.every(q => {
    const a = answers[q.id];
    if (a.type === 'mcq') return a.value !== null;
    if (a.type === 'true_false') return a.value !== null;
    if (a.type === 'fill_blank') return a.value.trim().length > 0;
    if (a.type === 'match') return q.type === 'match' && q.pairs.every(p => a.value[p.left]);
    return false;
  });

  const update = (id: string, a: Answer) =>
    setAnswers(prev => ({ ...prev, [id]: a }));

  const reset = () => {
    setAnswers(Object.fromEntries(questions.map(q => [q.id, initAnswer(q)])));
    setSubmitted(false);
  };

  const passed = submitted && score >= passingScore;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assessment</CardTitle>
        <p className="text-sm text-muted-foreground">
          Answer all questions. Passing score: {passingScore}%.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q, idx) => {
          const a = answers[q.id];
          const correct = submitted && isCorrect(q, a);
          return (
            <Card key={q.id} className={submitted ? (correct ? 'border-success' : 'border-destructive') : ''}>
              <CardHeader>
                <CardTitle className="text-base flex items-start gap-2">
                  <span>Q{idx + 1}.</span>
                  <span className="flex-1">{q.question}</span>
                  {submitted && (correct ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  ))}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {q.type === 'mcq' && a.type === 'mcq' && (
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        disabled={submitted}
                        onClick={() => update(q.id, { type: 'mcq', value: i })}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          a.value === i ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === 'true_false' && a.type === 'true_false' && (
                  <div className="flex gap-2">
                    {[true, false].map(v => (
                      <button
                        key={String(v)}
                        disabled={submitted}
                        onClick={() => update(q.id, { type: 'true_false', value: v })}
                        className={`flex-1 p-3 rounded-lg border transition-colors ${
                          a.value === v ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        {v ? 'True' : 'False'}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === 'fill_blank' && a.type === 'fill_blank' && (
                  <Input
                    value={a.value}
                    disabled={submitted}
                    onChange={e => update(q.id, { type: 'fill_blank', value: e.target.value })}
                    placeholder="Type your answer"
                  />
                )}

                {q.type === 'match' && a.type === 'match' && (
                  <div className="space-y-2">
                    {q.pairs.map(p => (
                      <div key={p.left} className="grid grid-cols-2 gap-3 items-center">
                        <div className="p-2 bg-muted rounded text-sm font-medium">{p.left}</div>
                        <select
                          disabled={submitted}
                          value={a.value[p.left] ?? ''}
                          onChange={e =>
                            update(q.id, {
                              type: 'match',
                              value: { ...a.value, [p.left]: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded border bg-background text-sm"
                        >
                          <option value="">— select —</option>
                          {shuffledRight[q.id]?.map(r => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {submitted && (
          <Card className={passed ? 'border-success' : 'border-destructive'}>
            <CardContent className="p-4 flex items-center gap-3">
              {passed ? (
                <CheckCircle className="w-6 h-6 text-success" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              <div className="flex-1">
                <p className="font-medium">
                  Score: {score}% — {passed ? 'Passed' : 'Failed'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {passed
                    ? 'You can proceed to the coding challenge.'
                    : 'Review the material and try again.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {!submitted ? (
            <Button onClick={() => setSubmitted(true)} disabled={!allAnswered}>
              Submit Assessment
            </Button>
          ) : passed ? (
            <Button onClick={onComplete}>
              Continue to Coding
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentStage;
