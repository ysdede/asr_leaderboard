// CSV parsing utilities
const CSVParser = {
  parseCSV: function(csvText, setDebugInfo) {
    // Parse CSV with quotes
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];
    
    const headers = this.parseCsvLine(lines[0]);
    const result = [];
    const uniqueEntries = new Set(); // Track unique model+dataset+wer combinations
    let duplicatesRemoved = 0;
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = this.parseCsvLine(lines[i]);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        
        // Create a unique key based on model name, dataset name, and WER score
        const uniqueKey = `${row.asr_model_name}|${row.dataset_name}|${row.wer}`;
        
        // Skip if we've already seen this combination
        if (uniqueEntries.has(uniqueKey)) {
          duplicatesRemoved++;
          continue;
        }
        
        uniqueEntries.add(uniqueKey);
        result.push(row);
      }
    }
    
    if (setDebugInfo) {
      setDebugInfo(prev => `${prev}\nRemoved ${duplicatesRemoved} duplicate entries based on model, dataset, and WER.`);
    }
    return result;
  },
  
  parseCsvLine: function(line) {
    const result = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    result.push(currentValue);
    return result;
  }
}; 