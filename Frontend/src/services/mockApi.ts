export interface RiskEvent {
    event_id: number;
    sensor_id: number;
    distance_m: number;
    object_type: "VEHICLE" | "UNKNOWN"; // 적외선 센서로 차량(Vehicle) 여부만 식별 가능
    risk_label: "위험" | "경고" | "안전";
    detected_at: string;
}

export interface SensorHealth {
    sensor_id: number;
    consecutive_timeout_count: number;
    is_faulty: 0 | 1; // 0=Faulty, 1=Normal
    updated_at: string;
}

// Mock Data
const initialRiskEvents: RiskEvent[] = [
    {
        event_id: 101,
        sensor_id: 3,
        distance_m: 8.5,
        object_type: "UNKNOWN",
        risk_label: "위험",
        detected_at: "2025-11-19 12:45:33",
    },
    {
        event_id: 102,
        sensor_id: 5,
        distance_m: 15.2,
        object_type: "VEHICLE",
        risk_label: "경고",
        detected_at: "2025-11-19 12:46:10",
    },
    {
        event_id: 103,
        sensor_id: 1,
        distance_m: 45.0,
        object_type: "VEHICLE",
        risk_label: "안전",
        detected_at: "2025-11-19 12:47:05",
    },
    {
        event_id: 104,
        sensor_id: 3,
        distance_m: 5.1,
        object_type: "UNKNOWN",
        risk_label: "위험",
        detected_at: "2025-11-19 12:48:22",
    },
    {
        event_id: 105,
        sensor_id: 2,
        distance_m: 22.8,
        object_type: "UNKNOWN",
        risk_label: "안전",
        detected_at: "2025-11-19 12:49:15",
    },
];

const initialSensorHealth: SensorHealth[] = [
    {
        sensor_id: 1,
        consecutive_timeout_count: 0,
        is_faulty: 1,
        updated_at: "2025-11-19 12:50:00",
    },
    {
        sensor_id: 2,
        consecutive_timeout_count: 0,
        is_faulty: 1,
        updated_at: "2025-11-19 12:50:00",
    },
    {
        sensor_id: 3,
        consecutive_timeout_count: 2,
        is_faulty: 1,
        updated_at: "2025-11-19 12:49:55",
    },
    {
        sensor_id: 4,
        consecutive_timeout_count: 15,
        is_faulty: 0,
        updated_at: "2025-11-19 12:30:00",
    },
    {
        sensor_id: 5,
        consecutive_timeout_count: 0,
        is_faulty: 1,
        updated_at: "2025-11-19 12:50:00",
    },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
    getRiskEvents: async (): Promise<RiskEvent[]> => {
        await delay(800); // Simulate 800ms network latency
        return [...initialRiskEvents];
    },

    getSensorHealth: async (): Promise<SensorHealth[]> => {
        await delay(800); // Simulate 600ms network latency
        return [...initialSensorHealth];
    },

    // Optional: Function to add a new event (simulating real-time updates)
    addRiskEvent: async (event: Omit<RiskEvent, "event_id">): Promise<RiskEvent> => {
        await delay(1000);
        const newEvent = {
            ...event,
            event_id: Math.floor(Math.random() * 10000) + 200,
        };
        initialRiskEvents.unshift(newEvent); // Add to beginning
        if (initialRiskEvents.length > 50) initialRiskEvents.pop(); // Keep list size manageable
        return newEvent;
    },
};
