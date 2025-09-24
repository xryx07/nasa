import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { ExoplanetData } from '../App';
import { Upload, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface DataUploadProps {
  onDataUploaded: (data: any) => void;
  onAnalysisComplete: (results: ExoplanetData[]) => void;
}

export function DataUpload({ onDataUploaded, onAnalysisComplete }: DataUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [telescopeSource, setTelescopeSource] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
      toast.success(`Uploaded ${files.length} file(s)`);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
      toast.success(`Uploaded ${files.length} file(s)`);
    }
  };

  const simulateAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload files first');
      return;
    }

    if (!telescopeSource) {
      toast.error('Please select telescope source');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const intervals = [10, 25, 40, 60, 75, 90, 100];
    
    for (const progress of intervals) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(progress);
    }

    // Generate mock results
    const mockResults: ExoplanetData[] = [
      {
        id: '1',
        name: 'Kepler-442b',
        confidence: 0.92,
        planetType: 'Super Earth',
        radius: 1.34,
        orbitalPeriod: 112.3,
        temperature: 233,
        habitableZone: true,
        detectionMethod: 'Transit',
        stellarMagnitude: 14.76
      },
      {
        id: '2',
        name: 'TOI-715b',
        confidence: 0.87,
        planetType: 'Rocky Planet',
        radius: 1.55,
        orbitalPeriod: 19.3,
        temperature: 347,
        habitableZone: false,
        detectionMethod: 'Transit',
        stellarMagnitude: 12.43
      },
      {
        id: '3',
        name: 'TRAPPIST-1d',
        confidence: 0.95,
        planetType: 'Terrestrial',
        radius: 0.77,
        orbitalPeriod: 4.05,
        temperature: 288,
        habitableZone: true,
        detectionMethod: 'Transit',
        stellarMagnitude: 18.8
      }
    ];

    onAnalysisComplete(mockResults);
    onDataUploaded({ files: uploadedFiles, source: telescopeSource });
    setIsAnalyzing(false);
    
    toast.success(`Analysis complete! Found ${mockResults.length} exoplanet candidates`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Upload Telescope Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Telescope Source Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Telescope Source</label>
            <Select value={telescopeSource} onValueChange={setTelescopeSource}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select telescope data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tess">TESS (Transiting Exoplanet Survey Satellite)</SelectItem>
                <SelectItem value="kepler">Kepler Space Telescope</SelectItem>
                <SelectItem value="jwst">JWST (James Webb Space Telescope)</SelectItem>
                <SelectItem value="k2">K2 Mission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-400/10' 
                : 'border-white/30 hover:border-white/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept=".fits,.csv,.txt,.dat"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Supported formats: FITS, CSV, TXT, DAT
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="text-gray-400 border-gray-400">
                Light Curves
              </Badge>
              <Badge variant="outline" className="text-gray-400 border-gray-400">
                Spectroscopic Data
              </Badge>
              <Badge variant="outline" className="text-gray-400 border-gray-400">
                Photometric Data
              </Badge>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Uploaded Files</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="text-sm text-white">{file.name}</div>
                        <div className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-white"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
                <span className="text-white">AI Analysis in Progress...</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <div className="text-sm text-gray-400">
                {analysisProgress < 30 && "Preprocessing telescope data..."}
                {analysisProgress >= 30 && analysisProgress < 60 && "Detecting transit signals..."}
                {analysisProgress >= 60 && analysisProgress < 90 && "Running AI classification..."}
                {analysisProgress >= 90 && "Finalizing results..."}
              </div>
            </div>
          )}

          {/* Analysis Button */}
          <Button
            onClick={simulateAnalysis}
            disabled={isAnalyzing || uploadedFiles.length === 0 || !telescopeSource}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isAnalyzing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Start AI Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Data Format Guide */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Supported Data Formats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">FITS Files</span>
              </div>
              <p className="text-sm text-gray-400 ml-6">
                Standard astronomical data format with headers and binary tables
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">CSV/TXT Files</span>
              </div>
              <p className="text-sm text-gray-400 ml-6">
                Time-series data with columns for time, flux, and errors
              </p>
            </div>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Data Requirements</span>
            </div>
            <ul className="text-sm text-gray-400 space-y-1 ml-6">
              <li>• Time column in days (BJD or similar)</li>
              <li>• Flux measurements (normalized preferred)</li>
              <li>• Error estimates for photometric precision</li>
              <li>• Minimum 1000 data points for reliable detection</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}