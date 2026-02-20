export interface CsvData {
  headers: string[];
  rows: string[][];
}

function parseCsvRow(row: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current.trim());
  return fields;
}

export function parseCsv(content: string): CsvData {
  const lines = content
    .trim()
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvRow(lines[0]);
  const rows = lines.slice(1).map(parseCsvRow);

  return { headers, rows };
}

export function isValidCsv(content: string): boolean {
  if (!content || content.trim().length === 0) {
    return false;
  }

  const lines = content
    .trim()
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return false;
  }

  return parseCsvRow(lines[0]).length > 0;
}

export function csvContainsValue(csvData: CsvData, value: string): boolean {
  const lowerValue = value.toLowerCase();
  return csvData.rows.some((row) => row.some((cell) => cell.toLowerCase().includes(lowerValue)));
}
