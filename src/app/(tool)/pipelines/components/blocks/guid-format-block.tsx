'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type GuidFormatOptions = {
  format?: 'hyphen' | 'no-hyphen' | 'braces';
};

type Props = {
  options: GuidFormatOptions;
  onOptionsChange: (options: GuidFormatOptions) => void;
};

export function GuidFormatBlock({ options, onOptionsChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Output Format</Label>
      <Select
        value={options.format || 'hyphen'}
        onValueChange={(value) =>
          onOptionsChange({ format: value as 'hyphen' | 'no-hyphen' | 'braces' })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hyphen">With Hyphens</SelectItem>
          <SelectItem value="no-hyphen">No Hyphens</SelectItem>
          <SelectItem value="braces">With Braces</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
