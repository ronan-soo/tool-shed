'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type CaseTransformOptions = {
  transform?: 'uppercase' | 'lowercase';
};

type Props = {
  options: CaseTransformOptions;
  onOptionsChange: (options: CaseTransformOptions) => void;
};

export function CaseTransformBlock({ options, onOptionsChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Transformation</Label>
      <Select
        value={options.transform || 'uppercase'}
        onValueChange={(value) =>
          onOptionsChange({ transform: value as 'uppercase' | 'lowercase' })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select transformation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="uppercase">UPPERCASE</SelectItem>
          <SelectItem value="lowercase">lowercase</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
