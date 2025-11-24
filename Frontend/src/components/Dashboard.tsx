import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity, AlertTriangle, CheckCircle, ShieldAlert, Loader2 } from "lucide-react";
import { mockApi, RiskEvent, SensorHealth } from "../services/mockApi";

export function Dashboard() {
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [sensorHealthRegistry, setSensorHealthRegistry] = useState<SensorHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [events, health] = await Promise.all([
          mockApi.getRiskEvents(),
          mockApi.getSensorHealth(),
        ]);
        setRiskEvents(events);
        setSensorHealthRegistry(health);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Autonomic Monitoring Logic
  const totalSensors = sensorHealthRegistry.length;
  const faultySensors = sensorHealthRegistry.filter((s) => s.is_faulty === 0).length;
  const activeSensors = totalSensors - faultySensors;

  const recentHighRisks = riskEvents.filter(e => e.risk_label === "위험").length;
  const currentRiskLevel = recentHighRisks > 0 ? "CRITICAL" : "NORMAL";

  const getRiskColor = (label: string) => {
    switch (label) {
      case "위험": return "destructive"; // Red
      case "경고": return "default";     // Orange/Primary
      case "안전": return "secondary";   // Green/Gray
      default: return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-400">시스템 데이터 동기화 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Section 1: Autonomic System Monitor */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              시스템 상태
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activeSensors} / {totalSensors} 가동 중
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {faultySensors > 0
                ? `${faultySensors}개 센서 점검 필요`
                : "모든 시스템 정상 가동 중"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              위험 분석
            </CardTitle>
            <ShieldAlert className={`h-4 w-4 ${currentRiskLevel === 'CRITICAL' ? 'text-red-500' : 'text-blue-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentRiskLevel === 'CRITICAL' ? 'text-red-400' : 'text-blue-400'}`}>
              {currentRiskLevel === 'CRITICAL' ? '위험' : '정상'}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              최근 {recentHighRisks}건의 고위험 이벤트 감지
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Risk Event Log */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            위험 이벤트 로그
          </h2>
          <Badge variant="outline" className="text-gray-400">risk_event table</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableHead className="text-gray-400">이벤트 ID</TableHead>
                <TableHead className="text-gray-400">센서 ID</TableHead>
                <TableHead className="text-gray-400">객체 유형</TableHead>
                <TableHead className="text-gray-400">거리 (m)</TableHead>
                <TableHead className="text-gray-400">위험도</TableHead>
                <TableHead className="text-gray-400">감지 시간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskEvents.map((event) => (
                <TableRow key={event.event_id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell className="font-mono text-gray-300">{event.event_id}</TableCell>
                  <TableCell className="text-gray-300">{event.sensor_id}</TableCell>
                  <TableCell className="text-gray-300">{event.object_type}</TableCell>
                  <TableCell className="text-gray-300 font-medium">
                    {event.distance_m}m
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskColor(event.risk_label) as any}>
                      {event.risk_label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">{event.detected_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Section 3: Sensor Health Registry */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            센서 상태 레지스트리
          </h2>
          <Badge variant="outline" className="text-gray-400">sensor_health table</Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableHead className="text-gray-400">센서 ID</TableHead>
                <TableHead className="text-gray-400">상태</TableHead>
                <TableHead className="text-gray-400">연속 타임아웃</TableHead>
                <TableHead className="text-gray-400">마지막 업데이트</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensorHealthRegistry.map((sensor) => (
                <TableRow key={sensor.sensor_id} className="border-gray-700 hover:bg-gray-700/50">
                  <TableCell className="text-gray-300 font-medium">Sensor #{sensor.sensor_id}</TableCell>
                  <TableCell>
                    {sensor.is_faulty === 1 ? (
                      <Badge className="bg-green-900 text-green-300 hover:bg-green-900">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Faulty</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {sensor.consecutive_timeout_count > 0 ? (
                      <span className="text-yellow-500 font-bold">{sensor.consecutive_timeout_count}</span>
                    ) : (
                      <span className="text-gray-500">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">{sensor.updated_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}
