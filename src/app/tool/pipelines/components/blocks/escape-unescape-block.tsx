'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type EscapeUnescapeOptions = {
  mode?: 'escape' | 'unescape';
  format?: 'html' | 'uri';
};

type Props = {
  options: EscapeUnescapeOptions;
  onOptionsChange: (options: EscapeUnescapeOptions) => void;
};

export function EscapeUnescapeBlock({ options, onOptionsChange }: Props) {
  const handleModeChange = (value: string) => {
    onOptionsChange({ ...options, mode: value as 'escape' | 'unescape' });
  };

  const handleFormatChange = (value: string) => {
    onOptionsChange({ ...options, format: value as 'html' | 'uri' });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Mode</Label>
        <Select
          value={options.mode || 'escape'}
          onValueChange={handleModeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="escape">Escape</SelectItem>
            <SelectItem value="unescape">Unescape</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Format</Label>
        <Select
          value={options.format || 'html'}
          onValueChange={handleFormatChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html">HTML Entities</SelectItem>
            <SelectItem value="uri">URI Component</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
