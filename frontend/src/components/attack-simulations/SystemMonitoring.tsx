import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Monitor, AlertTriangle, Activity, Cpu, HardDrive, Wifi, Zap, Bell, Maximize, Clock, ChevronUp, ChevronDown, Database } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// Types for system metrics
interface SystemMetric {
  timestamp: Date;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  temperature: number;
}

// Types for system events
interface SystemEvent {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'critical';
  message: string;
  details?: string;
  source: string;
}

// Types for process data
interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  user: string;
  status: 'running' | 'sleeping' | 'stopped' | 'zombie';
  suspicious: boolean;
}

const SystemMonitoring = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [currentCPU, setCurrentCPU] = useState(0);
  const [currentMemory, setCurrentMemory] = useState(0);
  const [currentDisk, setCurrentDisk] = useState(0);
  const [currentNetwork, setCurrentNetwork] = useState(0);
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [expanded, setExpanded] = useState(true);
  
  // Generate sample metrics
  const generateMetrics = () => {
    const now = new Date();
    let cpu = Math.floor(Math.random() * 40) + 10; // 10-50% CPU usage
    let memory = Math.floor(Math.random() * 30) + 40; // 40-70% memory usage
    const disk = Math.floor(Math.random() * 20) + 30; // 30-50% disk usage
    const network = Math.floor(Math.random() * 60) + 20; // 20-80% network usage
    const temperature = Math.floor(Math.random() * 15) + 45; // 45-60°C
    
    // Occasionally generate spikes
    if (Math.random() > 0.9) {
      cpu += 30; // CPU spike
      if (cpu > 100) cpu = 100;
    }
    
    if (Math.random() > 0.95) {
      memory += 20; // Memory spike
      if (memory > 100) memory = 100;
    }
    
    return {
      timestamp: now,
      cpu,
      memory,
      disk,
      network,
      temperature
    };
  };
  
  // Generate a system event based on metrics
  const generateEvent = (currentMetrics: SystemMetric): SystemEvent | null => {
    // Check for high CPU
    if (currentMetrics.cpu > 80) {
      return {
        id: `event-${Date.now()}-cpu`,
        timestamp: new Date(),
        type: currentMetrics.cpu > 90 ? 'critical' : 'warning',
        message: `High CPU Usage: ${currentMetrics.cpu}%`,
        details: 'System experiencing unusually high CPU load',
        source: 'CPU Monitor'
      };
    }
    
    // Check for high memory
    if (currentMetrics.memory > 85) {
      return {
        id: `event-${Date.now()}-memory`,
        timestamp: new Date(),
        type: currentMetrics.memory > 95 ? 'critical' : 'warning',
        message: `Low Memory: ${100 - currentMetrics.memory}% Free`,
        details: 'System memory resources are running low',
        source: 'Memory Monitor'
      };
    }
    
    // Check for high temperature
    if (currentMetrics.temperature > 58) {
      return {
        id: `event-${Date.now()}-temp`,
        timestamp: new Date(),
        type: currentMetrics.temperature > 65 ? 'critical' : 'warning',
        message: `High CPU Temperature: ${currentMetrics.temperature}°C`,
        details: 'CPU operating above recommended temperature range',
        source: 'Thermal Monitor'
      };
    }
    
    // Random events occasionally
    if (Math.random() > 0.9) {
      const events = [
        {
          type: 'info',
          message: 'System update available',
          details: 'New security patches are available for installation',
          source: 'Update Service'
        },
        {
          type: 'warning',
          message: 'Network anomaly detected',
          details: 'Unusual outbound connection pattern detected',
          source: 'Network Monitor'
        },
        {
          type: 'info',
          message: 'Backup completed',
          details: 'Scheduled system backup completed successfully',
          source: 'Backup Service'
        }
      ];
      
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      return {
        id: `event-${Date.now()}-random`,
        timestamp: new Date(),
        type: randomEvent.type as 'info' | 'warning' | 'critical',
        message: randomEvent.message,
        details: randomEvent.details,
        source: randomEvent.source
      };
    }
    
    return null;
  };
  
  // Generate sample processes
  const generateProcesses = () => {
    const processList: ProcessInfo[] = [
      {
        pid: 1,
        name: 'systemd',
        cpu: Math.floor(Math.random() * 5),
        memory: Math.floor(Math.random() * 2) + 1,
        disk: 0,
        network: 0,
        user: 'root',
        status: 'running',
        suspicious: false
      },
      {
        pid: 432,
        name: 'sshd',
        cpu: Math.floor(Math.random() * 2),
        memory: Math.floor(Math.random() * 1) + 0.5,
        disk: 0,
        network: Math.floor(Math.random() * 2),
        user: 'root',
        status: 'running',
        suspicious: false
      },
      {
        pid: 845,
        name: 'nginx',
        cpu: Math.floor(Math.random() * 10) + 5,
        memory: Math.floor(Math.random() * 5) + 3,
        disk: Math.floor(Math.random() * 1),
        network: Math.floor(Math.random() * 20) + 10,
        user: 'www-data',
        status: 'running',
        suspicious: false
      },
      {
        pid: 1289,
        name: 'mysql',
        cpu: Math.floor(Math.random() * 15) + 5,
        memory: Math.floor(Math.random() * 20) + 10,
        disk: Math.floor(Math.random() * 10) + 5,
        network: Math.floor(Math.random() * 5),
        user: 'mysql',
        status: 'running',
        suspicious: false
      },
      {
        pid: 2567,
        name: 'java',
        cpu: Math.floor(Math.random() * 25) + 15,
        memory: Math.floor(Math.random() * 30) + 15,
        disk: Math.floor(Math.random() * 5),
        network: Math.floor(Math.random() * 10),
        user: 'tomcat',
        status: 'running',
        suspicious: false
      },
      {
        pid: 3421,
        name: 'python3',
        cpu: Math.floor(Math.random() * 10) + 2,
        memory: Math.floor(Math.random() * 8) + 2,
        disk: Math.floor(Math.random() * 3),
        network: Math.floor(Math.random() * 5),
        user: 'www-data',
        status: 'running',
        suspicious: false
      },
      {
        pid: 4532,
        name: 'node',
        cpu: Math.floor(Math.random() * 12) + 3,
        memory: Math.floor(Math.random() * 15) + 5,
        disk: Math.floor(Math.random() * 2),
        network: Math.floor(Math.random() * 8) + 2,
        user: 'nodejs',
        status: 'running',
        suspicious: false
      },
    ];
    
    // Occasionally add a suspicious process (10% chance)
    if (Math.random() > 0.9) {
      const suspiciousProcesses = [
        {
          name: 'crypto_miner',
          cpu: Math.floor(Math.random() * 40) + 60,
          memory: Math.floor(Math.random() * 10) + 5,
          user: 'unknown'
        },
        {
          name: 'backdoor.sh',
          cpu: Math.floor(Math.random() * 5) + 1,
          memory: Math.floor(Math.random() * 2) + 1,
          user: 'root'
        },
        {
          name: 'data_exfil.py',
          cpu: Math.floor(Math.random() * 10) + 5,
          memory: Math.floor(Math.random() * 5) + 2,
          user: 'www-data'
        }
      ];
      
      const randomSuspicious = suspiciousProcesses[Math.floor(Math.random() * suspiciousProcesses.length)];
      
      processList.push({
        pid: 9000 + Math.floor(Math.random() * 1000),
        name: randomSuspicious.name,
        cpu: randomSuspicious.cpu,
        memory: randomSuspicious.memory,
        disk: Math.floor(Math.random() * 5),
        network: Math.floor(Math.random() * 30) + 10,
        user: randomSuspicious.user,
        status: 'running',
        suspicious: true
      });
      
      // Create an event for the suspicious process
      const newEvent: SystemEvent = {
        id: `event-${Date.now()}-suspicious`,
        timestamp: new Date(),
        type: 'critical',
        message: `Suspicious Process Detected: ${randomSuspicious.name}`,
        details: `Process running as ${randomSuspicious.user} with high resource usage`,
        source: 'Process Monitor'
      };
      
      setEvents(prev => [newEvent, ...prev]);
      
      toast({
        title: "Suspicious Process Detected",
        description: `Process ${randomSuspicious.name} is showing unusual behavior`,
        variant: "destructive"
      });
    }
    
    return processList;
  };
  
  // Format metrics for chart display
  const formatMetricsForChart = (metricsData: SystemMetric[]) => {
    return metricsData.map(metric => ({
      time: metric.timestamp.toLocaleTimeString(),
      cpu: metric.cpu,
      memory: metric.memory,
      disk: metric.disk,
      network: metric.network,
      temperature: metric.temperature,
    }));
  };
  
  // Simulate real-time monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate new metrics
      const newMetrics = generateMetrics();
      
      // Update current values
      setCurrentCPU(newMetrics.cpu);
      setCurrentMemory(newMetrics.memory);
      setCurrentDisk(newMetrics.disk);
      setCurrentNetwork(newMetrics.network);
      setCurrentTemperature(newMetrics.temperature);
      
      // Update metrics history (keep last 20 points)
      setMetrics(prev => {
        const updated = [...prev, newMetrics];
        return updated.slice(-20);
      });
      
      // Check if we should generate an event
      const newEvent = generateEvent(newMetrics);
      if (newEvent) {
        setEvents(prev => [newEvent, ...prev].slice(0, 100));
        
        // Show toast for critical events
        if (newEvent.type === 'critical') {
          toast({
            title: "Critical System Event",
            description: newEvent.message,
            variant: "destructive"
          });
        }
      }
      
      // Update processes occasionally
      if (Math.random() > 0.7) {
        setProcesses(generateProcesses());
      }
      
    }, 3000);
    
    return () => clearInterval(interval);
  }, [toast]);
  
  // Get color for metric based on value
  const getMetricColor = (value: number) => {
    if (value < 60) return 'text-green-500';
    if (value < 80) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Format event type badge
  const getEventTypeBadge = (type: 'info' | 'warning' | 'critical') => {
    switch (type) {
      case 'critical':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500">Critical</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500">Warning</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">Info</Badge>;
    }
  };
  
  // Sort processes by CPU usage
  const sortedProcesses = [...processes].sort((a, b) => b.cpu - a.cpu);

  return (
    <Card className="overflow-hidden shadow-lg border-isimbi-purple/20">
      <CardHeader className="p-4 border-b border-border flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-isimbi-purple" />
            Live System Monitoring
          </CardTitle>
          <CardDescription>Real-time monitoring of system metrics and behaviors</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      
      {expanded && (
        <>
          <div className="p-4 border-b border-border bg-muted/30">
            <Tabs defaultValue="overview" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="processes">Processes</TabsTrigger>
                <TabsTrigger value="events">Events Log</TabsTrigger>
                <TabsTrigger value="resources">Resource Usage</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <CardContent className="p-0">
            <TabsContent value="overview" className="p-4 mt-0">
              <div className="space-y-6">
                {/* Current Metrics */}
                <div className="grid grid-cols-5 gap-3">
                  <div className="border rounded-md p-3">
                    <div className="text-xs text-muted-foreground mb-1">CPU Usage</div>
                    <div className="flex justify-between items-center">
                      <Cpu className="h-4 w-4 text-blue-500" />
                      <div className={`text-xl font-bold ${getMetricColor(currentCPU)}`}>
                        {currentCPU}%
                      </div>
                    </div>
                    <Progress value={currentCPU} className="h-1 mt-2" />
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="text-xs text-muted-foreground mb-1">Memory Usage</div>
                    <div className="flex justify-between items-center">
                      <Database className="h-4 w-4 text-purple-500" />
                      <div className={`text-xl font-bold ${getMetricColor(currentMemory)}`}>
                        {currentMemory}%
                      </div>
                    </div>
                    <Progress value={currentMemory} className="h-1 mt-2" />
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="text-xs text-muted-foreground mb-1">Disk I/O</div>
                    <div className="flex justify-between items-center">
                      <HardDrive className="h-4 w-4 text-green-500" />
                      <div className={`text-xl font-bold ${getMetricColor(currentDisk)}`}>
                        {currentDisk}%
                      </div>
                    </div>
                    <Progress value={currentDisk} className="h-1 mt-2" />
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="text-xs text-muted-foreground mb-1">Network</div>
                    <div className="flex justify-between items-center">
                      <Wifi className="h-4 w-4 text-amber-500" />
                      <div className={`text-xl font-bold ${getMetricColor(currentNetwork)}`}>
                        {currentNetwork}%
                      </div>
                    </div>
                    <Progress value={currentNetwork} className="h-1 mt-2" />
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="text-xs text-muted-foreground mb-1">Temperature</div>
                    <div className="flex justify-between items-center">
                      <Zap className="h-4 w-4 text-red-500" />
                      <div className={`text-xl font-bold ${getMetricColor(currentTemperature)}`}>
                        {currentTemperature}°C
                      </div>
                    </div>
                    <Progress value={currentTemperature} max={100} className="h-1 mt-2" />
                  </div>
                </div>
                
                {/* System Resource Chart */}
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-4">Resource Utilization Trend</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={formatMetricsForChart(metrics)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(155, 155, 155, 0.1)" />
                        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="cpu" 
                          name="CPU" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="memory" 
                          name="Memory" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="network" 
                          name="Network" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Recent Events */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Recent Events</h3>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">View All Events</Button>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <ScrollArea className="h-[200px]">
                      {events.length > 0 ? (
                        <div className="divide-y">
                          {events.slice(0, 5).map((event) => (
                            <div key={event.id} className="p-3 hover:bg-muted/50">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-sm">
                                  {event.message}
                                </div>
                                <div className="flex items-center gap-2">
                                  {getEventTypeBadge(event.type)}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {event.timestamp.toLocaleTimeString()} | Source: {event.source}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                          No system events recorded
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="processes" className="p-4 mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Active Processes ({processes.length})</h3>
                  <Button size="sm" variant="outline" className="text-xs">Refresh</Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-8 gap-2 py-2 px-3 bg-muted text-xs font-medium">
                    <div className="col-span-1">PID</div>
                    <div className="col-span-2">Name</div>
                    <div className="col-span-1">CPU %</div>
                    <div className="col-span-1">Memory %</div>
                    <div className="col-span-1">User</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Action</div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    <div className="divide-y">
                      {sortedProcesses.map((process) => (
                        <div 
                          key={process.pid}
                          className={`grid grid-cols-8 gap-2 py-2 px-3 text-xs ${
                            process.suspicious ? 'bg-red-500/5' : ''
                          } hover:bg-muted/50`}
                        >
                          <div className="col-span-1 font-mono">{process.pid}</div>
                          <div className="col-span-2 flex items-center">
                            {process.suspicious && <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />}
                            <span className={process.suspicious ? 'font-medium text-red-500' : ''}>
                              {process.name}
                            </span>
                          </div>
                          <div 
                            className={`col-span-1 ${
                              process.cpu > 50 ? 'text-red-500 font-medium' : 
                              process.cpu > 20 ? 'text-amber-500' : ''
                            }`}
                          >
                            {process.cpu}%
                          </div>
                          <div 
                            className={`col-span-1 ${
                              process.memory > 50 ? 'text-red-500 font-medium' : 
                              process.memory > 20 ? 'text-amber-500' : ''
                            }`}
                          >
                            {process.memory}%
                          </div>
                          <div className="col-span-1">{process.user}</div>
                          <div className="col-span-1">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">
                              {process.status}
                            </Badge>
                          </div>
                          <div className="col-span-1">
                            <Button 
                              variant={process.suspicious ? "destructive" : "ghost"} 
                              size="sm" 
                              className="h-6 text-[10px]"
                            >
                              {process.suspicious ? "Terminate" : "Details"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="p-4 mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">System Events ({events.length})</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500">
                      {events.filter(e => e.type === 'critical').length} Critical
                    </Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500">
                      {events.filter(e => e.type === 'warning').length} Warnings
                    </Badge>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <ScrollArea className="h-[450px]">
                    {events.length > 0 ? (
                      <div className="divide-y">
                        {events.map((event) => (
                          <div 
                            key={event.id} 
                            className={`p-3 hover:bg-muted/50 ${
                              event.type === 'critical' ? 'bg-red-500/5' :
                              event.type === 'warning' ? 'bg-amber-500/5' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">
                                {event.message}
                              </div>
                              <div className="flex items-center gap-2">
                                {getEventTypeBadge(event.type)}
                                <span className="text-xs text-muted-foreground">
                                  {event.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {event.details}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              Source: {event.source}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        No system events recorded
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="p-4 mt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* CPU Usage Chart */}
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-4 flex items-center">
                      <Cpu className="h-4 w-4 text-blue-500 mr-2" />
                      CPU Usage
                    </h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={formatMetricsForChart(metrics)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(155, 155, 155, 0.1)" />
                          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <defs>
                            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="cpu" 
                            name="CPU" 
                            stroke="#3b82f6" 
                            fill="url(#cpuGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Memory Usage Chart */}
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-4 flex items-center">
                      <Database className="h-4 w-4 text-purple-500 mr-2" />
                      Memory Usage
                    </h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={formatMetricsForChart(metrics)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(155, 155, 155, 0.1)" />
                          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <defs>
                            <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="memory" 
                            name="Memory" 
                            stroke="#8b5cf6" 
                            fill="url(#memGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Disk I/O Chart */}
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-4 flex items-center">
                      <HardDrive className="h-4 w-4 text-green-500 mr-2" />
                      Disk I/O
                    </h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={formatMetricsForChart(metrics)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(155, 155, 155, 0.1)" />
                          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <defs>
                            <linearGradient id="diskGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="disk" 
                            name="Disk I/O" 
                            stroke="#22c55e" 
                            fill="url(#diskGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Network Usage Chart */}
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-4 flex items-center">
                      <Wifi className="h-4 w-4 text-amber-500 mr-2" />
                      Network Usage
                    </h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={formatMetricsForChart(metrics)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(155, 155, 155, 0.1)" />
                          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <defs>
                            <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="network" 
                            name="Network" 
                            stroke="#f59e0b" 
                            fill="url(#netGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Resource Usage Summary</h3>
                  <div className="text-sm space-y-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">CPU Cores</span>
                            <span>8 cores / 16 threads</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">CPU Model</span>
                            <span>Intel Core i7-10700K @ 3.80GHz</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Total Memory</span>
                            <span>32.0 GB DDR4</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Used Memory</span>
                            <span>{(32 * currentMemory / 100).toFixed(1)} GB ({currentMemory}%)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Total Disk Space</span>
                            <span>1.0 TB SSD</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Used Space</span>
                            <span>{(1000 * currentDisk / 100).toFixed(1)} GB ({currentDisk}%)</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Network Interface</span>
                            <span>eth0 (1000 Mbps)</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Current Usage</span>
                            <span>{(1000 * currentNetwork / 100).toFixed(1)} Mbps ({currentNetwork}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="bg-card/50 border-t border-border/50 flex justify-between p-4">
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock size={14} className="mr-1" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-muted">
                System Status: Active
              </Badge>
              <Button variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1">
                <Maximize size={14} className="mr-1" />
                Expand View
              </Button>
            </div>
          </CardFooter>
        </>
      )}
      
      {!expanded && (
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Cpu className="h-4 w-4 text-blue-500 mr-1" />
              <span className={`font-medium ${getMetricColor(currentCPU)}`}>
                {currentCPU}%
              </span>
            </div>
            <div className="flex items-center">
              <Database className="h-4 w-4 text-purple-500 mr-1" />
              <span className={`font-medium ${getMetricColor(currentMemory)}`}>
                {currentMemory}%
              </span>
            </div>
            <div className="flex items-center">
              <HardDrive className="h-4 w-4 text-green-500 mr-1" />
              <span className={`font-medium ${getMetricColor(currentDisk)}`}>
                {currentDisk}%
              </span>
            </div>
            {events.filter(e => e.type === 'critical').length > 0 && (
              <Badge variant="destructive">
                {events.filter(e => e.type === 'critical').length} Critical Alerts
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            Click to expand
          </span>
        </div>
      )}
    </Card>
  );
};

export default SystemMonitoring;
