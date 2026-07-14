import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Highlighter, Underline, MessageSquare, Trash2, X } from 'lucide-react';

export type AnnType = 'highlight' | 'underline' | 'comment';
export interface Annotation {
  id: string;
  start: number;
  end: number;
  type: AnnType;
  color: string;
  note?: string;
}

interface Props {
  text: string;
  storageKey: string;
  className?: string;
}

const COLORS = ['#fde68a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff'];

const AnnotatableText = ({ text, storageKey, className }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [anns, setAnns] = useState<Annotation[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const [toolbar, setToolbar] = useState<{ x: number; y: number; start: number; end: number } | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [commentDraft, setCommentDraft] = useState<{ start: number; end: number } | null>(null);
  const [commentText, setCommentText] = useState('');
  const [openNote, setOpenNote] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(anns));
  }, [anns, storageKey]);

  const getOffset = (node: Node, offset: number): number | null => {
    const root = containerRef.current;
    if (!root) return null;
    let acc = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = walker.nextNode())) {
      if (n === node) return acc + offset;
      acc += (n.textContent || '').length;
    }
    return null;
  };

  const onMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !containerRef.current) { setToolbar(null); return; }
    const range = sel.getRangeAt(0);
    if (!containerRef.current.contains(range.startContainer) || !containerRef.current.contains(range.endContainer)) return;
    const start = getOffset(range.startContainer, range.startOffset);
    const end = getOffset(range.endContainer, range.endOffset);
    if (start == null || end == null || start === end) return;
    const [s, e] = start < end ? [start, end] : [end, start];
    const rect = range.getBoundingClientRect();
    const parentRect = containerRef.current.getBoundingClientRect();
    setToolbar({ x: rect.left - parentRect.left + rect.width / 2, y: rect.top - parentRect.top - 8, start: s, end: e });
  };

  const addAnn = (type: AnnType, note?: string) => {
    if (!toolbar && !commentDraft) return;
    const src = commentDraft ?? toolbar!;
    setAnns(a => [...a, { id: crypto.randomUUID(), start: src.start, end: src.end, type, color, note }]);
    setToolbar(null); setCommentDraft(null); setCommentText('');
    window.getSelection()?.removeAllRanges();
  };

  const removeAnn = (id: string) => setAnns(a => a.filter(x => x.id !== id));

  // Build segments splitting text by annotation boundaries
  const segments = useMemo(() => {
    const points = new Set<number>([0, text.length]);
    anns.forEach(a => { points.add(Math.max(0, a.start)); points.add(Math.min(text.length, a.end)); });
    const sorted = [...points].sort((a, b) => a - b);
    const segs: { start: number; end: number; anns: Annotation[] }[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const s = sorted[i], e = sorted[i + 1];
      const covering = anns.filter(a => a.start <= s && a.end >= e);
      segs.push({ start: s, end: e, anns: covering });
    }
    return segs;
  }, [text, anns]);

  return (
    <div className={`relative ${className ?? ''}`}>
      <div
        ref={containerRef}
        onMouseUp={onMouseUp}
        className="whitespace-pre-wrap text-sm leading-relaxed select-text"
      >
        {segments.map((seg, i) => {
          const slice = text.slice(seg.start, seg.end);
          if (seg.anns.length === 0) return <span key={i}>{slice}</span>;
          const hl = seg.anns.find(a => a.type === 'highlight' || a.type === 'comment');
          const ul = seg.anns.find(a => a.type === 'underline');
          const cmt = seg.anns.find(a => a.type === 'comment');
          const style: React.CSSProperties = {
            backgroundColor: hl?.color,
            textDecoration: ul ? 'underline' : undefined,
            textDecorationColor: ul?.color,
            textDecorationThickness: ul ? 2 : undefined,
            cursor: cmt ? 'pointer' : undefined,
            borderRadius: hl ? 2 : undefined,
            padding: hl ? '0 2px' : undefined,
          };
          return (
            <span
              key={i}
              style={style}
              onClick={() => cmt && setOpenNote(openNote === cmt.id ? null : cmt.id)}
              title={cmt?.note}
            >
              {slice}
              {cmt && <sup className="text-[10px] text-primary ml-0.5">*</sup>}
            </span>
          );
        })}
      </div>

      {toolbar && (
        <div
          className="absolute z-30 -translate-x-1/2 -translate-y-full bg-popover border rounded-md shadow-lg p-1 flex items-center gap-1"
          style={{ left: toolbar.x, top: toolbar.y }}
        >
          <div className="flex gap-0.5 pr-1 border-r">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-4 h-4 rounded-full border ${color === c ? 'ring-2 ring-primary' : ''}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
          <Button size="sm" variant="ghost" onClick={() => addAnn('highlight')}>
            <Highlighter className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addAnn('underline')}>
            <Underline className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setCommentDraft({ start: toolbar.start, end: toolbar.end }); setToolbar(null); }}>
            <MessageSquare className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setToolbar(null)}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {commentDraft && (
        <div className="absolute inset-x-2 bottom-2 z-30 bg-popover border rounded-md shadow-lg p-2 flex gap-2">
          <input
            autoFocus
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-2 py-1 text-sm bg-background border rounded"
          />
          <Button size="sm" onClick={() => commentText.trim() && addAnn('comment', commentText.trim())}>Save</Button>
          <Button size="sm" variant="ghost" onClick={() => { setCommentDraft(null); setCommentText(''); }}>Cancel</Button>
        </div>
      )}

      {anns.length > 0 && (
        <div className="mt-3 border-t pt-2 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Annotations ({anns.length})</p>
          <div className="space-y-1 max-h-40 overflow-auto">
            {anns.map(a => (
              <div key={a.id} className="flex items-start gap-2 text-xs p-1.5 rounded hover:bg-muted/50">
                <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: a.color }} />
                <div className="flex-1 min-w-0">
                  <span className="text-muted-foreground uppercase text-[10px] mr-1">{a.type}</span>
                  <span className="italic">"{text.slice(a.start, a.end).slice(0, 60)}"</span>
                  {a.note && <div className="text-foreground mt-0.5">{a.note}</div>}
                </div>
                <button onClick={() => removeAnn(a.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnotatableText;
