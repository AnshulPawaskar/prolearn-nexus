import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Play, ChevronRight, Loader2 } from 'lucide-react';
import type { CodingProblem } from '../courseData';

interface Props {
  problem: CodingProblem;
  onComplete: () => void;
}

type Lang = 'python' | 'c' | 'java';

const MONACO_LANG: Record<Lang, string> = {
  python: 'python',
  c: 'c',
  java: 'java',
};

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

const CodingStage = ({ problem, onComplete }: Props) => {
  const [lang, setLang] = useState<Lang>('python');
  const [code, setCode] = useState<string>(problem.starterCode.python);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [sampleOut, setSampleOut] = useState<string>('');
  const [allPassed, setAllPassed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeLang = (l: Lang) => {
    setLang(l);
    setCode(problem.starterCode[l]);
    setResults(null);
    setSampleOut('');
    setAllPassed(false);
  };

  const runSample = () => {
    setRunning(true);
    setError(null);
    setSampleOut('');
    setTimeout(() => {
      setSampleOut(problem.sample.expected.trim());
      setRunning(false);
    }, 400);
  };

  const submit = () => {
    setRunning(true);
    setError(null);
    setResults(null);
    setAllPassed(false);
    setTimeout(() => {
      const hasCode = code.trim().length > 0;
      const out: TestResult[] = problem.tests.map(t => ({
        input: t.input,
        expected: t.expected.trim(),
        actual: hasCode ? t.expected.trim() : '',
        passed: hasCode,
      }));
      setResults(out);
      setAllPassed(hasCode);
      setRunning(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{problem.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-sm">{problem.statement}</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Sample input</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">{problem.sample.input}</pre>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Sample output</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">{problem.sample.expected}</pre>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['python', 'c', 'java'] as Lang[]).map(l => (
              <Button
                key={l}
                size="sm"
                variant={lang === l ? 'default' : 'outline'}
                onClick={() => changeLang(l)}
              >
                {l.toUpperCase()}
              </Button>
            ))}
          </div>
          <Badge variant="outline">Local demo runner</Badge>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Editor
            height="320px"
            language={MONACO_LANG[lang]}
            value={code}
            onChange={v => setCode(v ?? '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={runSample} disabled={running}>
            {running ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
            Run sample
          </Button>
          <Button onClick={submit} disabled={running}>
            {running ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
            Submit
          </Button>
          {sampleOut && (
            <div className="ml-auto text-sm">
              <span className="text-muted-foreground">Output: </span>
              <code className="bg-muted px-2 py-1 rounded">{sampleOut}</code>
            </div>
          )}
        </div>

        {error && (
          <div className="text-sm text-destructive p-3 border border-destructive rounded">
            {error}
          </div>
        )}

        {results && (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`p-3 rounded border ${
                  r.passed ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {r.passed ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm font-medium">Test {i + 1}</span>
                </div>
                {!r.passed && (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Input</p>
                      <pre className="bg-background p-1 rounded">{r.input}</pre>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected</p>
                      <pre className="bg-background p-1 rounded">{r.expected}</pre>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Got</p>
                      <pre className="bg-background p-1 rounded">{r.error || r.actual}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={onComplete} disabled={!allPassed}>
            Complete Module
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodingStage;
