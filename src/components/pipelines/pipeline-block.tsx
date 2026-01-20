'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Case,
  CodeXml,
  Braces,
  Milestone,
  Link,
  Sigma,
  AlertTriangle,
} from 'lucide-react';
import type { Block, BlockType } from '@/lib/pipeline';
import { CaseTransformBlock } from './blocks/case-transform-block';
import { EscapeUnescapeBlock } from './blocks/escape-unescape-block';
import { MinifyBlock } from './blocks/minify-block';
import { ParseJsonBlock } from './blocks/parse-json-block';
import { ParseXmlBlock } from './blocks/parse-xml-block';
import { SelectFieldBlock } from './blocks/select-field-block';
import { StringifyBlock } from './blocks/stringify-block';
import { Textarea } from '../ui/textarea';

const blockMeta: Record<
  BlockType,
  { name: string; icon: React.ElementType }
> = {
  case: { name: 'Case Transform', icon: Case },
  escape: { name: 'Escape/Unescape', icon: Link },
  minify: { name: 'Minify', icon: Sigma },
  json_parse: { name: 'Parse JSON', icon: Braces },
  xml_parse: { name: 'Format XML', icon: CodeXml },
  select_field: { name: 'Select Field', icon: Milestone },
  stringify: { name: 'Stringify', icon: Braces },
};

type PipelineBlockProps = {
  block: Block;
  onBlockChange: (block: Block) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
};

export function PipelineBlock({
  block,
  onBlockChange,
  onRemove,
  onMove,
  isFirst,
  isLast,
}: PipelineBlockProps) {
  const { name, icon: Icon } = blockMeta[block.type];

  const handleOptionsChange = (newOptions: any) => {
    onBlockChange({ ...block, options: newOptions });
  };

  const handleToggle = (enabled: boolean) => {
    onBlockChange({ ...block, enabled });
  };

  const renderBlockOptions = () => {
    switch (block.type) {
      case 'case':
        return (
          <CaseTransformBlock
            options={block.options}
            onOptionsChange={handleOptionsChange}
          />
        );
      case 'escape':
        return (
          <EscapeUnescapeBlock
            options={block.options}
            onOptionsChange={handleOptionsChange}
          />
        );
      case 'minify':
        return (
          <MinifyBlock
            options={block.options}
            onOptionsChange={handleOptionsChange}
          />
        );
      case 'json_parse':
        return <ParseJsonBlock />;
      case 'xml_parse':
        return (
          <ParseXmlBlock
            options={block.options}
            onOptionsChange={handleOptionsChange}
          />
        );
      case 'select_field':
        return (
          <SelectFieldBlock
            options={block.options}
            onOptionsChange={handleOptionsChange}
          />
        );
      case 'stringify':
        return <StringifyBlock />;
      default:
        return null;
    }
  };

  const outputPreview =
    typeof block.output === 'string'
      ? block.output
      : JSON.stringify(block.output, null, 2);

  return (
    <Card className={!block.enabled ? 'bg-muted/50' : ''}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6" />
          <CardTitle className="font-headline text-lg">{name}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={block.enabled} onCheckedChange={handleToggle} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMove(block.id, 'up')}
            disabled={isFirst}
            aria-label="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMove(block.id, 'down')}
            disabled={isLast}
            aria-label="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(block.id)}
            className="text-destructive hover:text-destructive"
            aria-label="Remove block"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {renderBlockOptions()}
        {block.error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{block.error}</span>
          </div>
        )}
        {block.output !== undefined && !block.error && (
            <div>
                 <CardDescription className="mb-2 text-xs uppercase font-semibold">Output Preview</CardDescription>
                 <Textarea value={outputPreview} readOnly rows={2} className="font-code text-xs h-auto bg-muted/30" />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
