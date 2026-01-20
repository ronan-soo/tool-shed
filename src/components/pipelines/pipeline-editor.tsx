'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  type Block,
  type BlockType,
  processPipeline,
} from '@/lib/pipeline';
import { PipelineBlock } from './pipeline-block';
import {
  Case,
  CodeXml,
  Braces,
  Milestone,
  Link,
  Sigma,
  PlusCircle,
  Trash2,
} from 'lucide-react';

const blockTypes: { type: BlockType; name: string; icon: React.ElementType }[] =
  [
    { type: 'case', name: 'Case Transform', icon: Case },
    { type: 'escape', name: 'Escape/Unescape', icon: Link },
    { type: 'minify', name: 'Minify', icon: Sigma },
    { type: 'json_parse', name: 'Parse JSON', icon: Braces },
    { type: 'xml_parse', name: 'Format XML', icon: CodeXml },
    { type: 'select_field', name: 'Select Field', icon: Milestone },
    { type: 'stringify', name: 'Stringify', icon: Braces },
  ];

export function PipelineEditor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [inputText, setInputText] = useState('');

  const processedBlocks = useMemo(
    () => processPipeline(inputText, blocks),
    [inputText, blocks]
  );
  const finalOutput =
    processedBlocks.length > 0
      ? processedBlocks[processedBlocks.length - 1].output ?? ''
      : inputText;

  const handleAddBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      options: {},
      enabled: true,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleBlockChange = useCallback((updatedBlock: Block) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
  }, []);

  const handleRemoveBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleMoveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newBlocks = [...prev];
      const [movedBlock] = newBlocks.splice(index, 1);
      newBlocks.splice(newIndex, 0, movedBlock);
      return newBlocks;
    });
  }, []);

  const clearPipeline = () => {
    setBlocks([]);
    setInputText('');
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1">
      <div className="lg:w-1/4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Add Blocks</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
            {blockTypes.map(({ type, name, icon: Icon }) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => handleAddBlock(type)}
                className="justify-start h-auto"
              >
                <div className="flex items-center gap-2 p-1">
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-sm">{name}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:w-1/2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold font-headline">Pipeline</h2>
            <Button variant="destructive" size="sm" onClick={clearPipeline} disabled={blocks.length === 0}>
                <Trash2 className="mr-2 h-4 w-4"/> Clear All
            </Button>
        </div>
        <div className="space-y-4">
          {processedBlocks.map((block, index) => (
            <PipelineBlock
              key={block.id}
              block={block}
              onBlockChange={handleBlockChange}
              onRemove={handleRemoveBlock}
              onMove={handleMoveBlock}
              isFirst={index === 0}
              isLast={index === processedBlocks.length - 1}
            />
          ))}
          {blocks.length === 0 && (
             <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
                <PlusCircle className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Your pipeline is empty.</p>
                <p className="text-sm text-muted-foreground">Add blocks from the left panel to get started.</p>
             </Card>
          )}
        </div>
      </div>

      <div className="lg:w-1/4 flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Input</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your input string here..."
              className="font-code flex-1"
            />
          </CardContent>
        </Card>
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Output</CardTitle>
            <CardDescription>
              The final result of the pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea
              value={finalOutput}
              readOnly
              placeholder="Output will appear here..."
              className="font-code flex-1 bg-muted/50"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
