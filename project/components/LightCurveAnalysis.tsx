import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExoplanetData } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, Zap, Target } from 'lucide-react';

interface LightCurveAnalysisProps {
  data: any;
  results: ExoplanetData[];
}

// Generate mock light curve data
const generateLightCurveData = (hasTransit = true) => {
  const data = [];
  const totalPoints = 1000;
  const transitDepth = 0.01; // 1% transit depth
  const transitDuration = 30; // points
  const transitCenter = totalPoints / 2;
  const noiseLevel = 0.001;

  for (let i = 0; i < totalPoints; i++) {
    let flux = 1.0;
    
    // Add noise
    flux += (Math.random() - 0.5) * noiseLevel;
    
    // Add transit if specified
    if (hasTransit && Math.abs(i - transitCenter) < transitDuration / 2) {
      const transitPhase = (i - transitCenter) / (transitDuration / 2);
      const transitShape = Math.sqrt(1 - transitPhase * transitPhase);
      flux -= transitDepth * transitShape;
    }
    
    data.push({
      time: i * 0.02, // 20 minute cadence
      flux: flux,
      error: noiseLevel
    });
  }
  
  return data;
};

const mockLightCurveData = generateLightCurveData(true);
const mockNoisyData = generateLightCurveData(false);

export function LightCurveAnalysis({ data, results }: LightCurveAnalysisProps) {
  const detectedTransits = results.filter(r => r.detectionMethod === 'Transit');
  
  return (
    <div className="space-y-6">
      {/* Light Curve Visualization */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Light Curve Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockLightCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.7)"
                  label={{ value: 'Time (days)', position: 'insideBottom', offset: -5, style: { fill: 'rgba(255,255,255,0.7)' } }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  label={{ value: 'Normalized Flux', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255,255,255,0.7)' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: number) => [value.toFixed(6), 'Flux']}
                  labelFormatter={(label) => `Time: ${Number(label).toFixed(3)} days`}
                />
                <Line 
                  type="monotone" 
                  dataKey="flux" 
                  stroke="#60a5fa" 
                  strokeWidth={1}
                  dot={false}
                />
                <ReferenceLine y={0.99} stroke="#ef4444" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Transit Detected
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              SNR: 12.4
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Period: 112.3 days
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Detection Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Transit Depth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1.02%</div>
            <p className="text-sm text-gray-400">Relative flux decrease</p>
            <div className="mt-2">
              <div className="text-xs text-gray-400">Planet/Star radius ratio</div>
              <div className="text-sm text-white">Rp/Rs = 0.101</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Transit Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4.2 hrs</div>
            <p className="text-sm text-gray-400">Full transit time</p>
            <div className="mt-2">
              <div className="text-xs text-gray-400">Ingress/Egress</div>
              <div className="text-sm text-white">23 minutes each</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Signal-to-Noise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12.4</div>
            <p className="text-sm text-gray-400">Detection significance</p>
            <div className="mt-2">
              <div className="text-xs text-gray-400">Confidence Level</div>
              <div className="text-sm text-white">99.99%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase-Folded Light Curve */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Phase-Folded Transit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockLightCurveData.slice(450, 550)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.7)"
                  label={{ value: 'Phase', position: 'insideBottom', offset: -5, style: { fill: 'rgba(255,255,255,0.7)' } }}
                />
                <YAxis 
                  domain={[0.985, 1.005]}
                  stroke="rgba(255,255,255,0.7)"
                  label={{ value: 'Relative Flux', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255,255,255,0.7)' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="flux" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-400">
            Phase-folded light curve showing the transit signature with period P = 112.3 days
          </p>
        </CardContent>
      </Card>

      {/* AI Detection Results */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            AI Detection Algorithm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Detection Pipeline</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/30">
                  <span className="text-sm text-white">Data Preprocessing</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✓</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/30">
                  <span className="text-sm text-white">Transit Search</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✓</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/30">
                  <span className="text-sm text-white">Signal Validation</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✓</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/30">
                  <span className="text-sm text-white">False Positive Test</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">✓</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Model Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Model Type:</span>
                  <span className="text-white">CNN + LSTM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Training Accuracy:</span>
                  <span className="text-white">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">False Positive Rate:</span>
                  <span className="text-white">2.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Time:</span>
                  <span className="text-white">0.34s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Export Results
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Download Light Curve
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}