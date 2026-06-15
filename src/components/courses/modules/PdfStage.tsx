import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import type { PdfContent } from '../courseData';

interface Props {
  content: PdfContent;
  onComplete: () => void;
}

const PdfStage = ({ content, onComplete }: Props) => {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Read the material</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review the document below. When done, mark as read to continue.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-[70vh] border rounded-lg overflow-hidden bg-muted">
          <iframe
            src={content.url}
            title="Module PDF"
            className="w-full h-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={e => setAcknowledged(e.target.checked)}
              className="w-4 h-4"
            />
            I have read this document
          </label>
          <Button onClick={onComplete} disabled={!acknowledged}>
            Continue to Assessment
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfStage;
