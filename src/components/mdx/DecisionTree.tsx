import React from 'react';

interface DecisionNode {
  question: string;
  yes?: string | DecisionNode;
  no?: string | DecisionNode;
}

interface DecisionTreeProps {
  title?: string;
  tree: DecisionNode;
}

function renderOutcome(outcome: string) {
  const isPositive = outcome.toLowerCase().includes('proceed') ||
                     outcome.toLowerCase().includes('good') ||
                     outcome.toLowerCase().includes('ready') ||
                     outcome.toLowerCase().includes('appropriate') ||
                     outcome.toLowerCase().includes('consider ai');
  const isNegative = outcome.toLowerCase().includes('stop') ||
                     outcome.toLowerCase().includes('pause') ||
                     outcome.toLowerCase().includes('reconsider') ||
                     outcome.toLowerCase().includes('skip') ||
                     outcome.toLowerCase().includes('start with');

  let classes = 'rounded px-3 py-2 text-sm ';
  if (isPositive) {
    classes += 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
  } else if (isNegative) {
    classes += 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200';
  } else {
    classes += 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
  }

  return (
    <div className={classes}>
      {outcome}
    </div>
  );
}

function TreeNode({ node, depth = 0 }: { node: DecisionNode; depth?: number }) {
  return (
    <div className={`${depth > 0 ? 'ml-4 border-l-2 border-slate-300 dark:border-slate-600 pl-4' : ''}`}>
      <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-lg px-4 py-3 mb-3 font-medium text-sm text-indigo-900 dark:text-indigo-100">
        {node.question}
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-green-600 dark:text-green-400 font-semibold mb-1 text-xs uppercase">
            ✓ Yes
          </div>
          {typeof node.yes === 'string' ? (
            renderOutcome(node.yes)
          ) : node.yes ? (
            <TreeNode node={node.yes} depth={depth + 1} />
          ) : null}
        </div>
        <div>
          <div className="text-red-600 dark:text-red-400 font-semibold mb-1 text-xs uppercase">
            ✗ No
          </div>
          {typeof node.no === 'string' ? (
            renderOutcome(node.no)
          ) : node.no ? (
            <TreeNode node={node.no} depth={depth + 1} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function DecisionTree({ title, tree }: DecisionTreeProps) {
  return (
    <div className="my-6 rounded-lg border border-slate-300 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-900">
      {title && (
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <span>🧭</span> {title}
        </div>
      )}
      <TreeNode node={tree} />
    </div>
  );
}
