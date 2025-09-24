import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { ExoplanetData } from '../App';
import { Play, Pause, RotateCcw, Orbit, Zap } from 'lucide-react';

interface OrbitSimulationProps {
  exoplanet: ExoplanetData | null;
}

export function OrbitSimulation({ exoplanet }: OrbitSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([1]);
  const [time, setTime] = useState(0);

  const drawOrbit = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (!exoplanet) return;

    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with space background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5;
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;

    // Calculate orbit parameters
    const semiMajorAxis = Math.min(width, height) * 0.3;
    const eccentricity = 0.05; // Assume low eccentricity
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

    // Draw orbit path
    ctx.strokeStyle = 'rgba(100, 149, 237, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, semiMajorAxis, semiMinorAxis, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw star
    const starRadius = 20;
    const starGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, starRadius);
    starGradient.addColorStop(0, '#ffff99');
    starGradient.addColorStop(0.7, '#ffcc00');
    starGradient.addColorStop(1, '#ff9900');
    ctx.fillStyle = starGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, starRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Add star corona
    ctx.strokeStyle = 'rgba(255, 255, 153, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, starRadius + 5, 0, 2 * Math.PI);
    ctx.stroke();

    // Calculate planet position
    const angle = (time * speed[0] * 0.01) % (2 * Math.PI);
    const planetX = centerX + semiMajorAxis * Math.cos(angle);
    const planetY = centerY + semiMinorAxis * Math.sin(angle);

    // Draw planet
    const planetRadius = Math.max(5, (exoplanet.radius * 8));
    let planetColor = '#4f46e5'; // Default blue

    // Color based on planet type
    switch (exoplanet.planetType) {
      case 'Rocky Planet':
      case 'Terrestrial':
        planetColor = '#ef4444'; // Red-brown
        break;
      case 'Super Earth':
        planetColor = '#10b981'; // Green
        break;
      case 'Gas Giant':
        planetColor = '#f59e0b'; // Orange
        break;
      case 'Ice Giant':
        planetColor = '#06b6d4'; // Cyan
        break;
    }

    const planetGradient = ctx.createRadialGradient(planetX, planetY, 0, planetX, planetY, planetRadius);
    planetGradient.addColorStop(0, planetColor);
    planetGradient.addColorStop(1, planetColor + '80');
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw planet atmosphere if in habitable zone
    if (exoplanet.habitableZone) {
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius + 3, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw orbital trail
    ctx.strokeStyle = 'rgba(100, 149, 237, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 50; i++) {
      const trailAngle = angle - (i * 0.1);
      const trailX = centerX + semiMajorAxis * Math.cos(trailAngle);
      const trailY = centerY + semiMinorAxis * Math.sin(trailAngle);
      if (i === 0) {
        ctx.moveTo(trailX, trailY);
      } else {
        ctx.lineTo(trailX, trailY);
      }
    }
    ctx.stroke();

    // Draw information labels
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`${exoplanet.name}`, planetX + planetRadius + 10, planetY - 10);
    ctx.fillText(`Period: ${exoplanet.orbitalPeriod.toFixed(1)} days`, 10, height - 60);
    ctx.fillText(`Distance: ${(semiMajorAxis / 100).toFixed(2)} AU`, 10, height - 40);
    ctx.fillText(`Temperature: ${exoplanet.temperature}K`, 10, height - 20);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    drawOrbit(ctx, centerX, centerY);
    setTime(prev => prev + speed[0]);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  useEffect(() => {
    // Initial draw
    const canvas = canvasRef.current;
    if (canvas && exoplanet) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawOrbit(ctx, canvas.width / 2, canvas.height / 2);
      }
    }
  }, [exoplanet]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSimulation = () => {
    setTime(0);
    setIsPlaying(false);
    const canvas = canvasRef.current;
    if (canvas && exoplanet) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawOrbit(ctx, canvas.width / 2, canvas.height / 2);
      }
    }
  };

  if (!exoplanet) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="py-12">
            <div className="text-center">
              <Orbit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No Exoplanet Selected</h3>
              <p className="text-gray-400">
                Select an exoplanet from the AI Results or Dashboard to view its orbital simulation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Planet Information */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Orbit className="h-5 w-5" />
              {exoplanet.name} - Orbital Simulation
            </CardTitle>
            <div className="flex gap-2">
              <Badge 
                variant={exoplanet.confidence > 0.8 ? "default" : "secondary"}
                className={
                  exoplanet.confidence > 0.8 
                    ? "bg-green-500/20 text-green-400 border-green-500/30" 
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }
              >
                {(exoplanet.confidence * 100).toFixed(0)}% Confidence
              </Badge>
              {exoplanet.habitableZone && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Habitable Zone
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="text-white ml-2">{exoplanet.planetType}</span>
            </div>
            <div>
              <span className="text-gray-400">Radius:</span>
              <span className="text-white ml-2">{exoplanet.radius.toFixed(2)} R⊕</span>
            </div>
            <div>
              <span className="text-gray-400">Period:</span>
              <span className="text-white ml-2">{exoplanet.orbitalPeriod.toFixed(1)} days</span>
            </div>
            <div>
              <span className="text-gray-400">Temperature:</span>
              <span className="text-white ml-2">{exoplanet.temperature.toFixed(0)} K</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orbital Simulation */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">3D Orbital Visualization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-96 bg-black rounded-lg border border-white/20"
              style={{ imageRendering: 'crisp-edges' }}
            />
            
            {/* Overlay information */}
            <div className="absolute top-4 right-4 bg-black/80 p-3 rounded-lg border border-white/20">
              <div className="text-xs text-gray-400 space-y-1">
                <div>Phase: {((time * speed[0] * 0.01) % (2 * Math.PI) / (2 * Math.PI) * 100).toFixed(1)}%</div>
                <div>Speed: {speed[0]}x</div>
                <div>Detection: {exoplanet.detectionMethod}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={togglePlayPause}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                onClick={resetSimulation}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-white">Speed:</span>
              <div className="w-32">
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-gray-400">{speed[0]}x</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orbital Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Orbital Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Semi-major axis:</span>
                <span className="text-white">0.85 AU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Eccentricity:</span>
                <span className="text-white">0.05</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Inclination:</span>
                <span className="text-white">89.2°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Orbital velocity:</span>
                <span className="text-white">24.3 km/s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Physical Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Mass:</span>
                <span className="text-white">{(exoplanet.radius ** 3 * 1.2).toFixed(2)} M⊕</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Density:</span>
                <span className="text-white">4.8 g/cm³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Surface gravity:</span>
                <span className="text-white">{(exoplanet.radius * 9.8).toFixed(1)} m/s²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Escape velocity:</span>
                <span className="text-white">{(exoplanet.radius * 11.2).toFixed(1)} km/s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Host Star</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Stellar type:</span>
                <span className="text-white">G2V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Magnitude:</span>
                <span className="text-white">{exoplanet.stellarMagnitude.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Distance:</span>
                <span className="text-white">156.7 ly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Age:</span>
                <span className="text-white">4.2 Gyr</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analysis */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Advanced Orbital Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Transit Geometry</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Impact parameter:</span>
                  <span className="text-white">0.23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transit depth:</span>
                  <span className="text-white">1.02%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transit duration:</span>
                  <span className="text-white">4.2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ingress/Egress:</span>
                  <span className="text-white">23 minutes</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Habitability Factors</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Stellar flux:</span>
                  <span className="text-white">1.4 S⊕</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Equilibrium temp:</span>
                  <span className="text-white">{exoplanet.temperature}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tidal locking:</span>
                  <span className="text-white">Likely</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Atmosphere retention:</span>
                  <span className="text-white">Possible</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-purple-500 hover:bg-purple-600">
              Export Animation
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Share Simulation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}