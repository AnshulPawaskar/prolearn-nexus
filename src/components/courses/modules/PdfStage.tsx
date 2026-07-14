import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Highlighter, MessageSquare, Underline, Trash2, Plus, StickyNote } from 'lucide-react';
import type { PdfContent } from '../courseData';

interface Props {
  content: PdfContent;
  onComplete: () => void;
}

type NoteType = 'highlight' | 'underline' | 'comment';
interface Note {
  id: string; type: NoteType; color: string; page?: string; quote: string; comment?: string; ts: number;
}

const COLORS = ['#fde68a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff'];
const TYPES: { key: NoteType; label: string; icon: typeof Highlighter }[] = [
  { key: 'highlight', label: 'Highlight', icon: Highlighter },
  { key: 'underline', label: 'Underline', icon: Underline },
  { key: 'comment', label: 'Comment', icon: MessageSquare },
];

const PdfStage = ({ content, onComplete }: Props) => {
  const key = `pdf-notes-${content.url}`;
  const [acknowledged, setAcknowledged] = useState(false);
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });
  const [type, setType] = useState<NoteType>('highlight');
  const [color, setColor] = useState(COLORS[0]);
  const [page, setPage] = useState('');
  const [quote, setQuote] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => { localStorage.setItem(key, JSON.stringify(notes)); }, [notes, key]);

  const addNote = () => {
    if (!quote.trim()) return;
    setNotes(n => [{ id: crypto.randomUUID(), type, color, page: page.trim() || undefined, quote: quote.trim(), comment: comment.trim() || undefined, ts: Date.now() }, ...n]);
    setQuote(''); setComment(''); setPage('');
  };

  const remove = (id: string) => setNotes(n => n.filter(x => x.id !== id));

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[70vh]">
        {/* PDF viewer */}
        <div className="lg:col-span-2 border-r bg-muted flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b bg-card">
            <h3 className="text-sm font-semibold">Reading Material</h3>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} className="w-3.5 h-3.5" />
              I have read this
            </label>
          </div>
          <iframe src={content.url} title="Module PDF" className="w-full flex-1 min-h-[65vh]" />
        </div>

        {/* Notes sidebar */}
        <div className="flex flex-col bg-card">
          <div className="px-3 py-2 border-b flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Notes & Annotations</h3>
            <Badge variant="outline" className="ml-auto text-[10px]">{notes.length}</Badge>
          </div>

          {/* Composer */}
          <div className="p-3 border-b space-y-2 bg-muted/20">
            <div className="flex gap-1">
              {TYPES.map(t => {
                const Icon = t.icon;
                return (
                  <Button key={t.key} size="sm" variant={type === t.key ? 'default' : 'outline'}
                    className="h-7 text-xs flex-1" onClick={() => setType(t.key)}>
                    <Icon className="w-3 h-3 mr-1" /> {t.label}
                  </Button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Color:</span>
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border ${color === c ? 'ring-2 ring-primary' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
              <input value={page} onChange={e => setPage(e.target.value)} placeholder="Pg"
                className="ml-auto w-14 px-2 py-1 text-xs border rounded bg-background" />
            </div>
            <textarea value={quote} onChange={e => setQuote(e.target.value)}
              placeholder="Quote or passage from the document..."
              className="w-full px-2 py-1.5 text-xs border rounded bg-background min-h-[60px] resize-none" />
            {type === 'comment' && (
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Your comment..."
                className="w-full px-2 py-1.5 text-xs border rounded bg-background min-h-[50px] resize-none" />
            )}
            <Button size="sm" onClick={addNote} disabled={!quote.trim()} className="w-full h-7 text-xs">
              <Plus className="w-3 h-3 mr-1" /> Add Note
            </Button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-auto p-2 space-y-2 max-h-[45vh]">
            {notes.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">
                No notes yet. Highlight passages as you read.
              </p>
            )}
            {notes.map(n => {
              const T = TYPES.find(t => t.key === n.type)!;
              const Icon = T.icon;
              return (
                <div key={n.id} className="border rounded p-2 text-xs bg-background group">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: n.color }} />
                    <Icon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] uppercase text-muted-foreground">{n.type}</span>
                    {n.page && <Badge variant="outline" className="text-[9px] h-4 px-1">p.{n.page}</Badge>}
                    <button onClick={() => remove(n.id)}
                      className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p style={{
                    backgroundColor: n.type === 'highlight' ? n.color : undefined,
                    textDecoration: n.type === 'underline' ? 'underline' : undefined,
                    textDecorationColor: n.color,
                    textDecorationThickness: n.type === 'underline' ? 2 : undefined,
                    padding: n.type === 'highlight' ? '2px 4px' : undefined,
                    borderRadius: 3,
                  }} className="italic">"{n.quote}"</p>
                  {n.comment && <p className="mt-1 text-foreground border-l-2 pl-2" style={{ borderColor: n.color }}>{n.comment}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CardContent className="p-3 border-t flex justify-end bg-muted/20">
        <Button onClick={onComplete} disabled={!acknowledged}>
          Continue to Assessment <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default PdfStage;
