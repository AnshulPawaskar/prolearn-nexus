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

const LANG_IDS: Record<Lang, number> = {
  python: 71, // Python 3
  c: 50, // C (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13)
};

const MONACO_LANG: Record<Lang, string> = {
  python: 'python',
  c: 'c',
  java: 'java',
};

const JUDGE0_URL = 'https://ce.judge0.com';

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

const toB64 = (s: string) => btoa(unescape(encodeURIComponent(s)));
const fromB64 = (s: string | null | undefined) =>
  s ? decodeURIComponent(escape(atob(s))) : '';

async function runOnJudge0(
  sourceCode: string,
  langId: number,
  stdin: string,
): Promise<{ stdout: string; stderr: string; status: string }> {
  const res = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: toB64(sourceCode),
        language_id: langId,
        stdin: toB64(stdin),
      }),
    },
  );
  if (!res.ok) throw new Error(`Judge0 error: ${res.status}`);
  const data = await res.json();
  return {
    stdout: fromB64(data.stdout),
    stderr: fromB64(data.stderr) || fromB64(data.compile_output),
    status: data.status?.description ?? 'Unknown',
  };
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

  const runSample = async () => {
    setRunning(true);
    setError(null);
    setSampleOut('');
    try {
      const r = await runOnJudge0(code, LANG_IDS[lang], problem.sample.input);
      setSampleOut(r.stderr ? `[${r.status}]\n${r.stderr}` : r.stdout.trim());
    } catch (e: any) {
      setError(e.message ?? 'Failed to run');
    } finally {
      setRunning(false);
    }
  };

  const submit = async () => {
    setRunning(true);
    setError(null);
    setResults(null);
    setAllPassed(false);
    try {
      const out: TestResult[] = [];
      for (const t of problem.tests) {
        const r = await runOnJudge0(code, LANG_IDS[lang], t.input);
        const actual = r.stdout.trim();
        const expected = t.expected.trim();
        out.push({
          input: t.input,
          expected,
          actual,
          passed: actual === expected && !r.stderr,
          error: r.stderr || undefined,
        });
      }
      setResults(out);
      setAllPassed(out.every(r => r.passed));
    } catch (e: any) {
      setError(e.message ?? 'Failed to submit');
    } finally {
      setRunning(false);
    }
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
          <Badge variant="outline">Powered by Judge0</Badge>
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
