import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

const Index = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleEnrich = () => {
    if (!file) {
      alert("Please upload a CSV file first.");
      return;
    }
    setIsProcessing(true);
    // Simulating progress for now
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 500);
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
          <p className="mt-2">Processing: {progress}% complete</p>
        </div>
      )}
    </div>
  );
};

export default Index;
