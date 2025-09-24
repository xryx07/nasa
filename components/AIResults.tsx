import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ExoplanetData } from '../App';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Brain, Target, AlertTriangle, CheckCircle, FileText, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AIResultsProps {
  results: ExoplanetData[];
  onSelectExoplanet: (exoplanet: ExoplanetData) => void;
}

const planetTypeData = [
  { name: 'Super Earth', value: 35, color: '#3b82f6' },
  { name: 'Rocky Planet', value: 28, color: '#10b981' },
  { name: 'Gas Giant', value: 15, color: '#f59e0b' },
  { name: 'Ice Giant', value: 12, color: '#8b5cf6' },
  { name: 'Terrestrial', value: 10, color: '#ef4444' }
];

const confidenceDistribution = [
  { range: '90-100%', count: 15, color: '#10b981' },
  { range: '80-90%', count: 23, color: '#3b82f6' },
  { range: '70-80%', count: 18, color: '#f59e0b' },
  { range: '60-70%', count: 12, color: '#ef4444' },
  { range: '<60%', count: 8, color: '#6b7280' }
];

export function AIResults({ results, onSelectExoplanet }: AIResultsProps) {
  const [selectedResult, setSelectedResult] = useState<ExoplanetData | null>(null);

  const confirmedPlanets = results.filter(p => p.confidence > 0.8);
  const candidatePlanets = results.filter(p => p.confidence >= 0.6 && p.confidence <= 0.8);
  const falsePositives = results.filter(p => p.confidence < 0.6);

  const exportResults = () => {
    const csvContent = [
      'Planet Name,Confidence,Type,Radius (R⊕),Period (days),Temperature (K),Habitable Zone,Detection Method,Stellar Magnitude',
      ...results.map(r => 
        `${r.name},${r.confidence},${r.planetType},${r.radius},${r.orbitalPeriod},${r.temperature},${r.habitableZone},${r.detectionMethod},${r.stellarMagnitude}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exoplanet_detection_results.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Results exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Detections</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{results.length}</div>
            <p className="text-xs text-gray-400">AI processed signals</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Confirmed Planets</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{confirmedPlanets.length}</div>
            <p className="text-xs text-gray-400">{'>'} 80% confidence</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Planet Candidates</CardTitle>
            <Target className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{candidatePlanets.length}</div>
            <p className="text-xs text-gray-400">60-80% confidence</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">False Positives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{falsePositives.length}</div>
            <p className="text-xs text-gray-400">{'<'} 60% confidence</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planet Type Distribution */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Planet Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planetTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {planetTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Distribution */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Confidence Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="range" 
                    stroke="rgba(255,255,255,0.7)"
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.7)"
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255,255,255,0.7)' } }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[4, 4, 0, 0]}
                  >
                    {confidenceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">AI Detection Results</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={exportResults}
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="confirmed" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="confirmed">Confirmed ({confirmedPlanets.length})</TabsTrigger>
              <TabsTrigger value="candidates">Candidates ({candidatePlanets.length})</TabsTrigger>
              <TabsTrigger value="false-positives">False Positives ({falsePositives.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="confirmed" className="space-y-3">
              {confirmedPlanets.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No confirmed planets yet</p>
                </div>
              ) : (
                confirmedPlanets.map((planet) => (
                  <div 
                    key={planet.id}
                    className="p-4 bg-white/5 rounded-lg border border-green-500/30 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setSelectedResult(planet);
                      onSelectExoplanet(planet);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-white">{planet.name}</h3>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Confirmed
                        </Badge>
                        {planet.habitableZone && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Habitable Zone
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Confidence</div>
                        <div className="text-xl font-bold text-green-400">
                          {(planet.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white ml-2">{planet.planetType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Radius:</span>
                        <span className="text-white ml-2">{planet.radius.toFixed(2)} R⊕</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Period:</span>
                        <span className="text-white ml-2">{planet.orbitalPeriod.toFixed(1)} days</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Temperature:</span>
                        <span className="text-white ml-2">{planet.temperature.toFixed(0)} K</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={planet.confidence * 100} className="h-2" />
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="candidates" className="space-y-3">
              {candidatePlanets.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No planet candidates yet</p>
                </div>
              ) : (
                candidatePlanets.map((planet) => (
                  <div 
                    key={planet.id}
                    className="p-4 bg-white/5 rounded-lg border border-yellow-500/30 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setSelectedResult(planet);
                      onSelectExoplanet(planet);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-white">{planet.name}</h3>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Candidate
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Confidence</div>
                        <div className="text-xl font-bold text-yellow-400">
                          {(planet.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white ml-2">{planet.planetType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Radius:</span>
                        <span className="text-white ml-2">{planet.radius.toFixed(2)} R⊕</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Period:</span>
                        <span className="text-white ml-2">{planet.orbitalPeriod.toFixed(1)} days</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Temperature:</span>
                        <span className="text-white ml-2">{planet.temperature.toFixed(0)} K</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={planet.confidence * 100} className="h-2" />
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="false-positives" className="space-y-3">
              {falsePositives.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No false positives detected</p>
                </div>
              ) : (
                falsePositives.map((planet) => (
                  <div 
                    key={planet.id}
                    className="p-4 bg-white/5 rounded-lg border border-red-500/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-white">{planet.name}</h3>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          False Positive
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Confidence</div>
                        <div className="text-xl font-bold text-red-400">
                          {(planet.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400">
                      Signal likely caused by stellar variability, binary eclipse, or instrumental artifacts
                    </p>

                    <div className="mt-3">
                      <Progress value={planet.confidence * 100} className="h-2" />
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Model Information */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            AI Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Model Architecture</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Primary Model:</span>
                  <span className="text-white">CNN + LSTM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ensemble Models:</span>
                  <span className="text-white">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Training Data:</span>
                  <span className="text-white">200k+ light curves</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-white">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Precision:</span>
                  <span className="text-white">91.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recall:</span>
                  <span className="text-white">89.6%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">F1-Score:</span>
                  <span className="text-white">90.7%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Processing Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Processing Time:</span>
                  <span className="text-white">0.34s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">False Positive Rate:</span>
                  <span className="text-white">2.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Memory Usage:</span>
                  <span className="text-white">1.2 GB</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}