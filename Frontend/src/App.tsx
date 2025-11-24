import { SensorSimulation } from './components/SensorSimulation';
import { Dashboard } from './components/Dashboard';

/**
 * 메인 앱 컴포넌트
 * 보행자 안전 센서 시스템 시뮬레이션
 */
export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            교내 보행자 안전 시스템
          </h1>
          <p className="text-gray-400">자율 적외선 센서 네트워크 및 위험 분석</p>
        </header>

        <SensorSimulation />

        <div className="mt-12">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
