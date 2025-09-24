import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ExoplanetData } from '../App';
import { Telescope, Zap, Target, Globe } from 'lucide-react';

interface DashboardProps {
  analysisResults: ExoplanetData[];
  onSelectExoplanet: (exoplanet: ExoplanetData) => void;
}

export function Dashboard({ analysisResults, onSelectExoplanet }: DashboardProps) {
  const totalAnalyzed = analysisResults.length;
  const confirmedPlanets = analysisResults.filter(p => p.confidence > 0.8).length;
  const habitablePlanets = analysisResults.filter(p => p.habitableZone).length;
  const avgConfidence = analysisResults.length > 0 
    ? analysisResults.reduce((sum, p) => sum + p.confidence, 0) / analysisResults.length 
    : 0;

  const recentDiscoveries = analysisResults
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Analyzed</CardTitle>
            <Telescope className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalAnalyzed}</div>
            <p className="text-xs text-gray-400">
              Stellar objects processed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Confirmed Planets</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{confirmedPlanets}</div>
            <p className="text-xs text-gray-400">
              High confidence detections
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Habitable Zone</CardTitle>
            <Globe className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{habitablePlanets}</div>
            <p className="text-xs text-gray-400">
              Potentially habitable worlds
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg Confidence</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {(avgConfidence * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-400">
              Detection accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Discoveries */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Discoveries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentDiscoveries.length === 0 ? (
            <div className="text-center py-8">
              <Telescope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No exoplanets detected yet</p>
              <p className="text-sm text-gray-500">Upload telescope data to begin analysis</p>
            </div>
          ) : (
            recentDiscoveries.map((planet) => (
              <div 
                key={planet.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => onSelectExoplanet(planet)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-white">{planet.name}</h3>
                    <Badge 
                      variant={planet.confidence > 0.8 ? "default" : "secondary"}
                      className={
                        planet.confidence > 0.8 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }
                    >
                      {planet.confidence > 0.8 ? "Confirmed" : "Candidate"}
                    </Badge>
                    {planet.habitableZone && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Habitable Zone
                      </Badge>
                    )}
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
                      <span className="text-gray-400">Temp:</span>
                      <span className="text-white ml-2">{planet.temperature.toFixed(0)} K</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Confidence</div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={planet.confidence * 100} 
                      className="w-20 h-2"
                    />
                    <span className="text-sm text-white">
                      {(planet.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Mission Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              TESS Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Transiting Exoplanet Survey Satellite operational
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Data Quality</span>
                <span>98%</span>
              </div>
              <Progress value={98} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              JWST Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              James Webb Space Telescope active
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Spectral Data</span>
                <span>94%</span>
              </div>
              <Progress value={94} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              Kepler Archive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Historical data processing complete
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Archive Access</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}