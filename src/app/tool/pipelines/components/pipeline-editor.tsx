'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  Link as LinkIcon,
  Sigma,
  Trash2,
  ChevronDown,
  LogIn,
  LogOut,
  Fingerprint,
  Bookmark,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
    icon: LinkIcon,
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
  type SavedPipeline = {
    name: string;
    blocks: Block[];
    inputText: string;
  };

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [inputText, setInputText] = useState('');
  const [savedPipelines, setSavedPipelines] = useState<SavedPipeline[]>([]);
  const [pipelineName, setPipelineName] = useState('');
  const [isSaveAlertOpen, setIsSaveAlertOpen] = useState(false);
  const { toast } = useToast();

  // Load pipelines from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('string-pipelines');
      if (saved) {
        setSavedPipelines(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load pipelines from localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error loading saved pipelines',
        description: 'Your saved pipelines data might be corrupted.',
      });
    }
  }, [toast]);

  // Function to update localStorage
  const updateLocalStorage = (pipelines: SavedPipeline[]) => {
    try {
      localStorage.setItem('string-pipelines', JSON.stringify(pipelines));
    } catch (error) {
      console.error('Failed to save pipelines to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error saving pipeline',
        description: 'Could not save pipeline to local storage.',
      });
    }
  };

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

  const handleSavePipeline = () => {
    if (!pipelineName) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a name for the pipeline.',
      });
      return;
    }

    const newPipelines = [...savedPipelines];
    const existingIndex = newPipelines.findIndex((p) => p.name === pipelineName);
    const pipelineData = { name: pipelineName, blocks, inputText };

    if (existingIndex > -1) {
      // Update existing pipeline
      newPipelines[existingIndex] = pipelineData;
    } else {
      // Add new pipeline
      newPipelines.push(pipelineData);
    }

    setSavedPipelines(newPipelines);
    updateLocalStorage(newPipelines);
    toast({
      title: 'Pipeline Saved',
      description: `Pipeline "${pipelineName}" has been saved.`,
    });
    setPipelineName('');
    setIsSaveAlertOpen(false);
  };

  const handleLoadPipeline = useCallback(
    (name: string) => {
      const pipeline = savedPipelines.find((p) => p.name === name);
      if (pipeline) {
        setBlocks(pipeline.blocks);
        setInputText(pipeline.inputText);
        toast({
          title: 'Pipeline Loaded',
          description: `Pipeline "${name}" has been loaded.`,
        });
      }
    },
    [savedPipelines, toast]
  );

  const handleDeletePipeline = (name: string) => {
    const newPipelines = savedPipelines.filter((p) => p.name !== name);
    setSavedPipelines(newPipelines);
    updateLocalStorage(newPipelines);
    toast({
      variant: 'destructive',
      title: 'Pipeline Deleted',
      description: `Pipeline "${name}" has been deleted.`,
    });
  };

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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold font-headline">
                Processing Pipeline
              </h2>
              <p className="text-muted-foreground">
                Chain transformations to process your input string.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Saved Pipelines
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Load a Pipeline</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {savedPipelines.length === 0 ? (
                    <p className="px-2 py-1.5 text-sm text-muted-foreground">
                      No saved pipelines.
                    </p>
                  ) : (
                    savedPipelines.map((pipeline) => (
                      <DropdownMenuItem
                        key={pipeline.name}
                        onSelect={(e) => e.preventDefault()}
                        className="flex items-center justify-between"
                      >
                        <button
                          onClick={() => handleLoadPipeline(pipeline.name)}
                          className="flex-1 text-left pr-2"
                        >
                          {pipeline.name}
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => handleDeletePipeline(pipeline.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog
                open={isSaveAlertOpen}
                onOpenChange={setIsSaveAlertOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button>
                    <Bookmark className="mr-2 h-4 w-4" /> Save
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Save Pipeline</AlertDialogTitle>
                    <AlertDialogDescription>
                      Enter a name for your current pipeline to save it for
                      later use. If the name already exists, it will be
                      overwritten.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Label htmlFor="pipeline-name" className="sr-only">
                      Pipeline Name
                    </Label>
                    <Input
                      id="pipeline-name"
                      value={pipelineName}
                      onChange={(e) => setPipelineName(e.target.value)}
                      placeholder="e.g., My JSON Parser"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSavePipeline}>
                      Save
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="destructive"
                size="sm"
                onClick={clearPipeline}
                disabled={blocks.length === 0 && !inputText}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear All
              </Button>
            </div>
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
