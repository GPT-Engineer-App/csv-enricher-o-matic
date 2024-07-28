import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import Papa from 'papaparse';

const API_KEY = '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';

const Index = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enrichedData, setEnrichedData] = useState(null);

  const enrichRow = async (row) => {
    const prompt = `Given this CSV row data: ${JSON.stringify(row)}\n\nProvide a brief description of this data:`;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid CSV file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    } else {
      alert("Please drop a valid CSV file.");
    }
  };

  const handleEnrich = async () => {
    if (!file) {
      alert("Please upload a CSV file first.");
      return;
    }
    setIsProcessing(true);
    setProgress(0);

    Papa.parse(file, {
      complete: async (results) => {
        const { data } = results;
        const headers = data[0];
        const enrichedData = [headers.concat('Enriched Description')];

        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          try {
            const description = await enrichRow(row);
            enrichedData.push(row.concat(description));
            setProgress((i / (data.length - 1)) * 100);
          } catch (error) {
            console.error(`Error enriching row ${i}:`, error);
            enrichedData.push(row.concat('Error: Failed to enrich'));
          }
        }

        setEnrichedData(enrichedData);
        setIsProcessing(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please try again.');
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Enrichment Application</h1>
      
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="mb-2">Drag and drop your CSV file here, or</p>
        <Input type="file" accept=".csv" onChange={handleFileChange} className="mb-2" />
        {file && <p className="text-green-600">File selected: {file.name}</p>}
      </div>

      <Button onClick={handleEnrich} disabled={!file || isProcessing}>
        {isProcessing ? 'Enriching...' : 'Enrich CSV'}
      </Button>

      {isProcessing && (
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="mt-2">Processing: {progress.toFixed(2)}% complete</p>
        </div>
      )}

      {enrichedData && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Enriched Data:</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  {enrichedData[0].map((header, index) => (
                    <th key={index} className="py-2 px-4 border-b">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enrichedData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-2 px-4 border-b">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
