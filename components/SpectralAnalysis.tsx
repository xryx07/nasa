import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ExoplanetData } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Atom, Droplets, Wind, Thermometer } from 'lucide-react';

interface SpectralAnalysisProps {
  data: any;
  results: ExoplanetData[];
}

// Generate mock spectral data
const generateSpectralData = () => {
  const wavelengths = [];
  for (let i = 1; i <= 5; i += 0.05) {
    const wavelength = i;
    let flux = 1.0;
    
    // Add spectral lines for different molecules
    if (Math.abs(wavelength - 1.4) < 0.02) flux *= 0.85; // H2O
    if (Math.abs(wavelength - 2.0) < 0.015) flux *= 0.90; // CO2
    if (Math.abs(wavelength - 3.3) < 0.01) flux *= 0.92; // CH4
    if (Math.abs(wavelength - 4.3) < 0.02) flux *= 0.88; // CO2
    
    // Add noise
    flux += (Math.random() - 0.5) * 0.02;
    
    wavelengths.push({
      wavelength: wavelength,
      flux: flux,
      transmission: flux * 100
    });
  }
  return wavelengths;
};

const mockSpectralData = generateSpectralData();

const atmosphericComposition = [
  { molecule: 'H2O', percentage: 15.2, color: '#3b82f6' },
  { molecule: 'CO2', percentage: 8.7, color: '#ef4444' },
  { molecule: 'CH4', percentage: 3.1, color: '#10b981' },
  { molecule: 'N2', percentage: 45.3, color: '#f59e0b' },
  { molecule: 'O2', percentage: 0.8, color: '#8b5cf6' },
  { molecule: 'Others', percentage: 26.9, color: '#6b7280' }
];

export function SpectralAnalysis({ data, results }: SpectralAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Transmission Spectrum */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Atom className="h-5 w-5" />
            Transmission Spectrum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSpectralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="wavelength" 
                  stroke="rgba(255,255,255,0.7)"
                  label={{ value: 'Wavelength (μm)', position: 'insideBottom', offset: -5, style: { fill: 'rgba(255,255,255,0.7)' } }}
                />
                <YAxis 
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
                  formatter={(value: number, name: string) => [
                    name === 'flux' ? value.toFixed(4) : `${value.toFixed(1)}%`,
                    name === 'flux' ? 'Flux' : 'Transmission'
                  ]}
                  labelFormatter={(label) => `λ = ${Number(label).toFixed(2)} μm`}
                />
                <Line 
                  type="monotone" 
                  dataKey="flux" 
                  stroke="#60a5fa" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-white">H₂O (1.4 μm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-sm text-white">CO₂ (2.0, 4.3 μm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-white">CH₄ (3.3 μm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-sm text-white">O₂ (0.76 μm)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Atmospheric Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Atmospheric Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={atmosphericComposition}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="molecule" 
                    stroke="rgba(255,255,255,0.7)"
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.7)"
                    label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255,255,255,0.7)' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Abundance']}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill={(entry: any) => entry.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Molecule Detection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className="text-white">Water Vapor (H₂O)</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Confirmed
                </Badge>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-gray-400">Confidence: 92% | Strong absorption at 1.4 μm</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-red-400" />
                  <span className="text-white">Carbon Dioxide (CO₂)</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Confirmed
                </Badge>
              </div>
              <Progress value={87} className="h-2" />
              <p className="text-xs text-gray-400">Confidence: 87% | Multiple bands detected</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Atom className="h-4 w-4 text-green-400" />
                  <span className="text-white">Methane (CH₄)</span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Tentative
                </Badge>
              </div>
              <Progress value={64} className="h-2" />
              <p className="text-xs text-gray-400">Confidence: 64% | Weak signal at 3.3 μm</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Atom className="h-4 w-4 text-purple-400" />
                  <span className="text-white">Oxygen (O₂)</span>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  Not Detected
                </Badge>
              </div>
              <Progress value={23} className="h-2" />
              <p className="text-xs text-gray-400">Confidence: 23% | Below detection threshold</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planetary Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-400" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-white">647 K</div>
              <div className="text-sm text-gray-400">374°C | 705°F</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Day Side</span>
                  <span className="text-white">723 K</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Night Side</span>
                  <span className="text-white">571 K</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Equilibrium</span>
                  <span className="text-white">647 K</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Atmospheric Pressure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-white">2.3 bar</div>
              <div className="text-sm text-gray-400">2.3× Earth pressure</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Scale Height</span>
                  <span className="text-white">12.4 km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Surface Gravity</span>
                  <span className="text-white">11.2 m/s²</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Cloud Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-white">34%</div>
              <div className="text-sm text-gray-400">Partial cloud cover</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Cloud Top</span>
                  <span className="text-white">45 km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Composition</span>
                  <span className="text-white">H₂O + CO₂</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Summary */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Spectroscopic Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Key Findings</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white">Strong water vapor detection indicates possible past or present liquid water</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white">Substantial CO₂ atmosphere suggests active geological processes</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-white">Methane traces could indicate biological or geological activity</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white">No oxygen detected - unlikely to support aerobic life</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Habitability Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Temperature Range:</span>
                  <span className="text-red-400">Too Hot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Atmospheric Pressure:</span>
                  <span className="text-green-400">Suitable</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Water Presence:</span>
                  <span className="text-green-400">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Biosignature Potential:</span>
                  <span className="text-yellow-400">Low</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-1">Overall Habitability Score</div>
                <Progress value={35} className="h-3" />
                <div className="text-xs text-gray-400 mt-1">35/100 - Challenging conditions for life</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-purple-500 hover:bg-purple-600">
              Export Spectrum
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Generate Report
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Compare with Database
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}