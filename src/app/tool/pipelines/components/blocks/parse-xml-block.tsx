'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ParseXmlOptions = {
  indent?: '2s' | '4s' | 'tab';
};

type Props = {
  options: ParseXmlOptions;
  onOptionsChange: (options: ParseXmlOptions) => void;
};

export function ParseXmlBlock({ options, onOptionsChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Indentation</Label>
      <Select
        value={options.indent || '2s'}
        onValueChange={(value) =>
          onOptionsChange({ indent: value as '2s' | '4s' | 'tab' })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select indentation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2s">2 Spaces</SelectItem>
          <SelectItem value="4s">4 Spaces</SelectItem>
          <SelectItem value="tab">Tab</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
