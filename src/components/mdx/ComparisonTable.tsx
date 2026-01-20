interface ComparisonTableProps {
  headers: string[];
  rows: Array<{
    label: string;
    values: Array<string | { text: string; highlight?: 'good' | 'bad' | 'neutral' }>;
  }>;
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900">
      <table className="w-full text-sm text-slate-800 dark:text-slate-200">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100"></th>
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900">
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-300 dark:border-slate-600">
              <td className="px-4 py-3 font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100">{row.label}</td>
              {row.values.map((value, j) => {
                const isObj = typeof value === 'object';
                const text = isObj ? value.text : value;
                const highlight = isObj ? value.highlight : undefined;

                let cellClass = 'px-4 py-3 ';
                if (highlight === 'good') cellClass += 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
                else if (highlight === 'bad') cellClass += 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
                else cellClass += 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';

                return <td key={j} className={cellClass}>{text}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
