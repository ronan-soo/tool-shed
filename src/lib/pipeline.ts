export type BlockType =
  | 'case'
  | 'escape'
  | 'minify'
  | 'json_parse'
  | 'xml_parse'
  | 'select_field'
  | 'stringify';

export interface Block {
  id: string;
  type: BlockType;
  options: any;
  enabled: boolean;
  output?: any;
  error?: string;
}

// Helper functions for transformations

function transformCase(input: string, options: any): string {
  const { transform = 'uppercase' } = options;
  if (transform === 'lowercase') return input.toLowerCase();
  return input.toUpperCase();
}

function transformEscape(input: string, options: any): string {
  const { mode = 'escape', format = 'html' } = options;
  if (format === 'uri') {
    return mode === 'escape'
      ? encodeURIComponent(input)
      : decodeURIComponent(input);
  }
  // Basic HTML escaping
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  if (mode === 'escape') {
    return input.replace(/[&<>"']/g, (char) => htmlEntities[char]);
  }
  const reversedEntities = Object.fromEntries(
    Object.entries(htmlEntities).map(([key, value]) => [value, key])
  );
  return input.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (entity) => reversedEntities[entity]);
}

function transformMinify(input: string, options: any): string {
  const { type = 'json' } = options;
  if (type === 'json') {
    return JSON.stringify(JSON.parse(input));
  }
  return input.replace(/\s+/g, ' ').trim();
}

function parseJson(input: string): object {
  return JSON.parse(input);
}

function formatXml(xml: string, options: any) {
  const { indent = '2s' } = options;
  const indentChar = { '2s': '  ', '4s': '    ', tab: '\t' }[indent];
  
  let formatted = '';
  let indentLevel = 0;
  const xml_header = xml.match(/^<\?xml.*?\?>\s*/);
  xml = xml_header ? xml.substring(xml_header[0].length) : xml;

  // Add a newline between tags
  const reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');

  // For each line, add indentation
  xml.split('\r\n').forEach(function(node) {
    let shouldIndent = true;
    let trimmedNode = node.trim();

    if (!trimmedNode) {
      return;
    }

    if (trimmedNode.match(/<\w[^>]*>.*<\/\w>/)) {
      // Node has open and closing tags on the same line, like <tag>text</tag>
      shouldIndent = false;
    } else if (trimmedNode.match(/^<\/\w/)) {
      // Node is a closing tag
      if (indentLevel > 0) {
        indentLevel--;
      }
    } else if (trimmedNode.match(/^<\w/) && trimmedNode.endsWith('/>')) {
      // Node is a self-closing tag
      shouldIndent = false;
    }

    formatted += indentChar.repeat(indentLevel) + trimmedNode + '\r\n';

    if (shouldIndent && trimmedNode.match(/^<\w/) && !trimmedNode.endsWith('/>')) {
      // Node is an opening tag
      indentLevel++;
    }
  });

  return (xml_header ? xml_header[0] : '') + formatted.trim();
}


function selectField(input: object, options: any): any {
  const { path = '' } = options;
  if (!path) throw new Error('Path is not specified.');
  // Simple path resolver, handles dot notation and array access
  return path.split(/[.[\]]+/).filter(Boolean).reduce((obj: any, key: string) => {
    if (obj === null || obj === undefined) return undefined;
    return obj[key];
  }, input);
}

function stringify(input: object): string {
  return JSON.stringify(input, null, 2);
}

// Main pipeline processor
export function processPipeline(
  initialInput: string,
  blocks: Block[]
): Block[] {
  let currentInput: any = initialInput;
  const processedBlocks: Block[] = [];

  for (const block of blocks) {
    const newBlock = { ...block };
    if (!block.enabled) {
      newBlock.output = currentInput;
      processedBlocks.push(newBlock);
      continue;
    }

    try {
      let output: any;
      switch (block.type) {
        case 'case':
          if(typeof currentInput !== 'string') throw new Error('Input must be a string.');
          output = transformCase(currentInput, block.options);
          break;
        case 'escape':
          if(typeof currentInput !== 'string') throw new Error('Input must be a string.');
          output = transformEscape(currentInput, block.options);
          break;
        case 'minify':
          if(typeof currentInput !== 'string') throw new Error('Input must be a string.');
          output = transformMinify(currentInput, block.options);
          break;
        case 'json_parse':
          if(typeof currentInput !== 'string') throw new Error('Input must be a string.');
          output = parseJson(currentInput);
          break;
        case 'xml_parse':
          if(typeof currentInput !== 'string') throw new Error('Input must be a string.');
          output = formatXml(currentInput, block.options);
          break;
        case 'select_field':
          if(typeof currentInput !== 'object' || currentInput === null) throw new Error('Input must be a JSON object.');
          output = selectField(currentInput, block.options);
          break;
        case 'stringify':
          if(typeof currentInput !== 'object' || currentInput === null) throw new Error('Input must be a JSON object.');
          output = stringify(currentInput);
          break;
        default:
          throw new Error('Unknown block type');
      }
      newBlock.output = output;
      currentInput = output;
    } catch (error) {
      newBlock.error = error instanceof Error ? error.message : String(error);
      newBlock.output = undefined; // Clear output on error
      processedBlocks.push(newBlock);
      // Stop processing the rest of the pipeline
      const remainingBlocks = blocks.slice(processedBlocks.length);
      return [
          ...processedBlocks,
          ...remainingBlocks.map(b => ({...b, error: 'Skipped due to previous error.'}))
      ];
    }
    processedBlocks.push(newBlock);
  }

  return processedBlocks;
}
