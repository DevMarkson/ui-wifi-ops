export type HotspotStatus = 'up' | 'slow' | 'down' | 'unknown';

export interface Hotspot {
    id: number;
    name: string;
    ssid: string;
    icon: string;
    category: string;
    location: string;
    status: HotspotStatus;
    speed: string;
    coverage: string;
    note: string;
    steps: string[];
    lastUpdated: string;
}

export interface NightPlan {
    provider: string;
    price: string;
    volume: string;
    time: string;
    code: string;
}
