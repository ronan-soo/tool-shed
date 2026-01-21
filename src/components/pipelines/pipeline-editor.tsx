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
import { type Block, type BlockType, processPipeline } from '@/lib/pipeline';
import { PipelineBlock } from './pipeline-block';
import {
  CaseSensitive,
  CodeXml,
  Braces,
  Milestone,
  Link,
  Sigma,
  Trash2,
  ChevronDown,
  LogIn,
  LogOut,
  Fingerprint,
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const blockTypes: {
  type: BlockType;
  name: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    type: 'case',
    name: 'Case Transform',
    icon: CaseSensitive,
    description: 'Convert text to uppercase or lowercase.',
  },
  {
    type: 'escape',
    name: 'Escape/Unescape',
    icon: Link,
    description: 'Escape or unescape HTML or URI components.',
  },
  {
    type: 'minify',
    name: 'Minify',
    icon: Sigma,
    description: 'Remove extra whitespace from text or JSON.',
  },
  {
    type: 'json_parse',
    name: 'Parse JSON',
    icon: Braces,
    description: 'Convert a JSON string into an object.',
  },
  {
    type: 'xml_parse',
    name: 'Format XML',
    icon: CodeXml,
    description: 'Pretty-print an XML string with indentation.',
  },
  {
    type: 'select_field',
    name: 'Select Field',
    icon: Milestone,
    description: 'Extract a value from a JSON object using a path.',
  },
  {
    type: 'stringify',
    name: 'Stringify',
    icon: Braces,
    description: 'Convert a JSON object back into a string.',
  },
  {
    type: 'guid_format',
    name: 'GUID Format',
    icon: Fingerprint,
    description: 'Convert GUIDs between different string formats.',
  },
];

export function PipelineEditor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [inputText, setInputText] = useState('');

  const processedBlocks = useMemo(
    () => processPipeline(inputText, blocks),
    [inputText, blocks]
  );
  const finalOutput =
    processedBlocks.length > 0 &&
    processedBlocks[processedBlocks.length - 1].enabled &&
    !processedBlocks[processedBlocks.length - 1].error
      ? processedBlocks[processedBlocks.length - 1].output ?? ''
      : processedBlocks.length === 0
      ? inputText
      : '';

  const finalOutputString =
    typeof finalOutput === 'string'
      ? finalOutput
      : JSON.stringify(finalOutput, null, 2);

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

  const handleMoveBlock = useCallback(
    (id: string, direction: 'up' | 'down') => {
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
    },
    []
  );

  const clearPipeline = () => {
    setBlocks([]);
    setInputText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full">
      <ScrollArea className="h-full lg:col-span-2">
        <div className="space-y-4 pr-4 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold font-headline">
                Processing Pipeline
              </h2>
              <p className="text-muted-foreground">
                Chain transformations to process your input string.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearPipeline}
              disabled={blocks.length === 0 && !inputText}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <LogIn className="h-5 w-5 text-primary" /> Input
              </CardTitle>
              <CardDescription>
                Start the pipeline by providing an initial text input.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your input string here..."
                className="font-code min-h-[150px] text-base"
              />
            </CardContent>
          </Card>

          {processedBlocks.map((block, index) => (
            <React.Fragment key={block.id}>
              <div className="flex justify-center text-muted-foreground">
                <ChevronDown className="h-8 w-8" />
              </div>
              <PipelineBlock
                key={block.id}
                block={block}
                index={index}
                onBlockChange={handleBlockChange}
                onRemove={handleRemoveBlock}
                onMove={handleMoveBlock}
                isFirst={index === 0}
                isLast={index === processedBlocks.length - 1}
              />
            </React.Fragment>
          ))}

          {(inputText || blocks.length > 0) && (
            <>
              <div className="flex justify-center text-muted-foreground">
                <ChevronDown className="h-8 w-8" />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <LogOut className="h-5 w-5 text-primary" /> Final Output
                  </CardTitle>
                  <CardDescription>
                    This is the final result after all pipeline blocks have been
                    processed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={finalOutputString}
                    readOnly
                    placeholder="Output will appear here..."
                    className="font-code min-h-[150px] bg-muted/50 text-base"
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="lg:col-span-1 lg:sticky lg:top-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Transformations</CardTitle>
            <CardDescription>
              Click a transformation to add it to the pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blockTypes.map(({ type, name, icon: Icon, description }) => (
                <button
                  key={type}
                  onClick={() => handleAddBlock(type)}
                  className="w-full text-left p-3 rounded-lg border hover:border-primary hover:bg-accent transition-colors flex items-start gap-4"
                >
                  <div className="p-2 bg-primary/10 text-primary rounded-md mt-1">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
