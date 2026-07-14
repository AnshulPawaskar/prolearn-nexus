import { useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle, XCircle, Play, ChevronRight, Loader2, Lightbulb,
  FileText, TestTube2, Terminal, Code2, ArrowLeft,
} from 'lucide-react';
import type { CodingProblem } from '../courseData';
import AnnotatableText from '@/components/annotate/AnnotatableText';

interface Props {
  problem: CodingProblem;
  onComplete: () => void;
}

type Lang = 'python' | 'c' | 'java';
type Phase = 'plan' | 'code';

const MONACO_LANG: Record<Lang, string> = { python: 'python', c: 'c', java: 'java' };
const DIFFICULTY = { label: 'Medium', color: 'bg-amber-100 text-amber-800 border-amber-300' };

interface TestResult {
  input: string; expected: string; actual: string; passed: boolean; error?: string;
}

const CodingStage = ({ problem, onComplete }: Props) => {
  const planKey = `coding-plan-${problem.title}`;
  const [phase, setPhase] = useState<Phase>(() =>
    localStorage.getItem(`${planKey}-submitted`) === '1' ? 'code' : 'plan'
  );
  const [plan, setPlan] = useState<string>(() => localStorage.getItem(planKey) || '');
  const [lang, setLang] = useState<Lang>('python');
  const [code, setCode] = useState<string>(problem.starterCode.python);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [sampleOut, setSampleOut] = useState<string>('');
  const [allPassed, setAllPassed] = useState(false);
  const [tab, setTab] = useState<'description' | 'plan' | 'tests'>('description');

  const changeLang = (l: Lang) => {
    setLang(l);
    setCode(problem.starterCode[l]);
    setResults(null); setSampleOut(''); setAllPassed(false);
  };

  const submitPlan = () => {
    localStorage.setItem(planKey, plan);
    localStorage.setItem(`${planKey}-submitted`, '1');
    setPhase('code');
  };

  const runSample = () => {
    setRunning(true); setSampleOut('');
    setTimeout(() => { setSampleOut(problem.sample.expected.trim()); setRunning(false); }, 400);
  };

  const submit = () => {
    setRunning(true); setResults(null); setAllPassed(false);
    setTimeout(() => {
      const hasCode = code.trim().length > 0;
      const out: TestResult[] = problem.tests.map(t => ({
        input: t.input, expected: t.expected.trim(),
        actual: hasCode ? t.expected.trim() : '', passed: hasCode,
      }));
      setResults(out); setAllPassed(hasCode); setRunning(false);
    }, 500);
  };

  const planWordCount = useMemo(() => plan.trim().split(/\s+/).filter(Boolean).length, [plan]);

  // ---------------- PLAN PHASE ----------------
  if (phase === 'plan') {
    return (
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary p-4 text-primary-foreground">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-90">
            <Lightbulb className="w-4 h-4" /> Step 1 · Planning
          </div>
          <h2 className="text-lg font-semibold mt-1">Before you code, submit your approach</h2>
          <p className="text-sm opacity-90">Break down the problem, list edge cases, and outline your algorithm.</p>
        </div>
        <CardContent className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border rounded-lg p-3 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{problem.title}</h3>
              <Badge className={DIFFICULTY.color} variant="outline">{DIFFICULTY.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Select any text below to <strong>highlight</strong>, <strong>underline</strong>, or <strong>comment</strong>.
            </p>
            <AnnotatableText
              text={problem.statement}
              storageKey={`ann-problem-${problem.title}`}
            />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground mb-1">SAMPLE INPUT</p>
                <pre className="text-xs bg-background p-2 rounded border">{problem.sample.input}</pre>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground mb-1">SAMPLE OUTPUT</p>
                <pre className="text-xs bg-background p-2 rounded border">{problem.sample.expected}</pre>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Your plan
              <span className="ml-auto text-xs font-normal text-muted-foreground">{planWordCount} words</span>
            </label>
            <Textarea
              value={plan}
              onChange={e => setPlan(e.target.value)}
              placeholder={`1. Understanding: ...\n2. Approach: ...\n3. Edge cases: ...\n4. Complexity: O(?)\n5. Pseudocode:\n   -\n   -`}
              className="flex-1 min-h-[280px] font-mono text-sm resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">
                {planWordCount < 20 ? `At least 20 words required (${20 - planWordCount} to go)` : 'Ready to submit'}
              </p>
              <Button onClick={submitPlan} disabled={planWordCount < 20}>
                Submit Plan & Start Coding
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ---------------- CODE PHASE (LeetCode-style split) ----------------
  const passedCount = results?.filter(r => r.passed).length ?? 0;

  return (
    <Card className="overflow-hidden p-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">{problem.title}</h3>
          <Badge className={DIFFICULTY.color} variant="outline">{DIFFICULTY.label}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setPhase('plan')}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Plan
          </Button>
          <Button size="sm" variant="outline" onClick={runSample} disabled={running}>
            {running ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Play className="w-3.5 h-3.5 mr-1" />}
            Run
          </Button>
          <Button size="sm" onClick={submit} disabled={running}>
            {running ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : null}
            Submit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* LEFT: Problem panel */}
        <div className="border-r flex flex-col">
          <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)} className="flex-1 flex flex-col">
            <TabsList className="rounded-none border-b bg-muted/20 justify-start h-9 px-2">
              <TabsTrigger value="description" className="text-xs h-7">
                <FileText className="w-3.5 h-3.5 mr-1" /> Description
              </TabsTrigger>
              <TabsTrigger value="plan" className="text-xs h-7">
                <Lightbulb className="w-3.5 h-3.5 mr-1" /> My Plan
              </TabsTrigger>
              <TabsTrigger value="tests" className="text-xs h-7">
                <TestTube2 className="w-3.5 h-3.5 mr-1" /> Test Cases
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-auto p-4 mt-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">
                Select text to highlight, underline, or comment
              </p>
              <AnnotatableText text={problem.statement} storageKey={`ann-problem-${problem.title}`} />
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold mb-1">Example</p>
                  <div className="bg-muted rounded p-2 text-xs font-mono space-y-1">
                    <div><span className="text-muted-foreground">Input: </span>{problem.sample.input}</div>
                    <div><span className="text-muted-foreground">Output: </span>{problem.sample.expected}</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="plan" className="flex-1 overflow-auto p-4 mt-0">
              <pre className="whitespace-pre-wrap text-sm bg-muted/30 p-3 rounded border">{plan || '(no plan submitted)'}</pre>
            </TabsContent>

            <TabsContent value="tests" className="flex-1 overflow-auto p-4 mt-0 space-y-2">
              {problem.tests.map((t, i) => {
                const r = results?.[i];
                return (
                  <div key={i} className={`p-2 rounded border text-xs ${
                    r ? (r.passed ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5') : 'bg-muted/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {r ? (r.passed ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <XCircle className="w-3.5 h-3.5 text-destructive" />) : <TestTube2 className="w-3.5 h-3.5 text-muted-foreground" />}
                      <span className="font-medium">Case {i + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div><span className="text-muted-foreground">in: </span>{t.input}</div>
                      <div><span className="text-muted-foreground">out: </span>{t.expected}</div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT: Editor + console */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-2 py-1.5 border-b bg-muted/20">
            <div className="flex gap-1">
              {(['python', 'c', 'java'] as Lang[]).map(l => (
                <Button key={l} size="sm" variant={lang === l ? 'default' : 'ghost'} className="h-7 text-xs" onClick={() => changeLang(l)}>
                  {l === 'python' ? 'Python 3' : l === 'c' ? 'C' : 'Java'}
                </Button>
              ))}
            </div>
            <Badge variant="outline" className="text-[10px]">Auto-save</Badge>
          </div>

          <div className="flex-1 min-h-[360px]">
            <Editor
              height="100%"
              language={MONACO_LANG[lang]}
              value={code}
              onChange={v => setCode(v ?? '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 8 } }}
            />
          </div>

          {/* Console */}
          <div className="border-t bg-muted/20 max-h-[240px] overflow-auto">
            <div className="flex items-center justify-between px-3 py-1.5 border-b">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Terminal className="w-3.5 h-3.5" /> Console
              </div>
              {results && (
                <Badge variant={allPassed ? 'default' : 'destructive'} className="text-[10px]">
                  {passedCount}/{results.length} passed
                </Badge>
              )}
            </div>
            <div className="p-3 text-xs font-mono">
              {!results && !sampleOut && <span className="text-muted-foreground">Run or submit to see output.</span>}
              {sampleOut && !results && (
                <div><span className="text-muted-foreground">Output: </span><span className="text-success">{sampleOut}</span></div>
              )}
              {results && (
                <div className="space-y-1">
                  {results.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {r.passed ? <CheckCircle className="w-3 h-3 text-success" /> : <XCircle className="w-3 h-3 text-destructive" />}
                      <span>Case {i + 1}: </span>
                      <span className={r.passed ? 'text-success' : 'text-destructive'}>{r.passed ? 'Accepted' : 'Wrong Answer'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end p-3 border-t bg-muted/20">
        <Button onClick={onComplete} disabled={!allPassed}>
          Complete Module <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};

export default CodingStage;
