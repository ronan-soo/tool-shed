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
import {
  type Block,
  type BlockType,
  processPipeline,
} from '@/lib/pipeline';
import { PipelineBlock } from './pipeline-block';
import {
  CaseSensitive,
  CodeXml,
  Braces,
  Milestone,
  Link,
  Sigma,
  PlusCircle,
  Trash2,
  ChevronDown,
  LogIn,
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const blockTypes: { type: BlockType; name: string; icon: React.ElementType }[] =
  [
    { type: 'case', name: 'Case Transform', icon: CaseSensitive },
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
    processedBlocks.length > 0 &&
    processedBlocks[processedBlocks.length - 1].enabled &&
    !processedBlocks[processedBlocks.length - 1].error
      ? processedBlocks[processedBlocks.length - 1].output ?? ''
      : processedBlocks.length === 0
      ? inputText
      : '';
  
  const finalOutputString = typeof finalOutput === 'string'
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
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="destructive"
            size="sm"
            onClick={clearPipeline}
            disabled={blocks.length === 0 && !inputText}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        </div>

        <div className="space-y-4">
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

          <div className="flex justify-center text-muted-foreground">
            <ChevronDown className="h-8 w-8" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Card className="border-dashed hover:border-primary hover:bg-accent transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                    <PlusCircle className="h-10 w-10" />
                    <p className="font-semibold mt-2">Add a new block</p>
                    <p className="text-sm">
                      Select a transformation to add to your pipeline.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Choose a block to add</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {blockTypes.map(({ type, name, icon: Icon }) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => handleAddBlock(type)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(inputText || blocks.length > 0) && (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
