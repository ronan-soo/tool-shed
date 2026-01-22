'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SelectFieldOptions = {
  path?: string;
};

type Props = {
  options: SelectFieldOptions;
  onOptionsChange: (options: SelectFieldOptions) => void;
};

export function SelectFieldBlock({ options, onOptionsChange }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="path-input">Field Path</Label>
      <Input
        id="path-input"
        value={options.path || ''}
        onChange={(e) => onOptionsChange({ path: e.target.value })}
        placeholder="e.g., user.data[0].id"
        className="font-code"
      />
    </div>
  );
}
