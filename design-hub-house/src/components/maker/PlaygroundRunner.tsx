'use client';

import { useState, useCallback } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { PlaygroundConfig } from '@/types';

interface PlaygroundRunnerProps {
  playground: PlaygroundConfig;
}

function PlaygroundControls({
  onReset,
  initialFiles,
}: {
  onReset: () => void;
  initialFiles: Record<string, string>;
}) {
  const { sandpack } = useSandpack();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const activeFile = sandpack.activeFile;
    const code = sandpack.files[activeFile]?.code || '';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [sandpack]);

  const handleReset = useCallback(() => {
    Object.entries(initialFiles).forEach(([path, code]) => {
      sandpack.updateFile(path, code);
    });
    onReset();
  }, [sandpack, initialFiles, onReset]);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}

export function PlaygroundRunner({ playground }: PlaygroundRunnerProps) {
  const [key, setKey] = useState(0);
  const [view, setView] = useState<'preview' | 'console'>('preview');

  // Convert playground files to Sandpack format
  const files: Record<string, string> = {};
  playground.files.forEach((file) => {
    files[file.path] = file.code;
  });

  // Determine template based on stack
  const template = playground.stack === 'react' ? 'react-ts' : 'vanilla-ts';

  const handleReset = () => {
    setKey((k) => k + 1);
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-background">
      <SandpackProvider
        key={key}
        template={template}
        files={files}
        theme="dark"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium">Code Editor</span>
          <PlaygroundControls onReset={handleReset} initialFiles={files} />
        </div>

        <SandpackLayout>
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            showInlineErrors
            wrapContent
            closableTabs={false}
            style={{ height: 500 }}
          />

          <div className="flex-1 flex flex-col" style={{ minWidth: '40%' }}>
            <Tabs value={view} onValueChange={(v) => setView(v as 'preview' | 'console')}>
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="preview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="console"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Console
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-0 flex-1">
                <SandpackPreview
                  showOpenInCodeSandbox={false}
                  showRefreshButton
                  style={{ height: 460 }}
                />
              </TabsContent>

              <TabsContent value="console" className="mt-0 flex-1">
                <SandpackConsole style={{ height: 460 }} />
              </TabsContent>
            </Tabs>
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
