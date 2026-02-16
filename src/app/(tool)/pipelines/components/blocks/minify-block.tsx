'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type MinifyOptions = {
  type?: 'json' | 'text';
};

type Props = {
  options: MinifyOptions;
  onOptionsChange: (options: MinifyOptions) => void;
};

export function MinifyBlock({ options, onOptionsChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Minify Type</Label>
      <Select
        value={options.type || 'json'}
        onValueChange={(value) =>
          onOptionsChange({ type: value as 'json' | 'text' })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select minify type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="json">JSON (removes whitespace)</SelectItem>
          <SelectItem value="text">Text (removes extra whitespace)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
