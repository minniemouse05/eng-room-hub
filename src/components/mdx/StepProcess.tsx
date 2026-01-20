interface Step {
  title: string;
  description: string;
  action?: string;
}

interface StepProcessProps {
  title?: string;
  steps: Step[];
}

export function StepProcess({ title, steps }: StepProcessProps) {
  return (
    <div className="my-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
      {title && (
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wide">
          {title}
        </div>
      )}
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center text-sm font-bold">
              {i + 1}
            </div>
            <div className="flex-1 pt-1">
              <div className="font-semibold mb-1 text-slate-900 dark:text-slate-100">{step.title}</div>
              <div className="text-sm text-slate-700 dark:text-slate-300 mb-2">{step.description}</div>
              {step.action && (
                <div className="text-sm bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded px-3 py-2 inline-block">
                  → {step.action}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
