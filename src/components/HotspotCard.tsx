import React from 'react';
import type { Hotspot } from '../types';
import StatusBadge from './StatusBadge';

interface HotspotCardProps {
    hotspot: Hotspot;
    onConnect: (hotspot: Hotspot) => void;
}

const HotspotCard: React.FC<HotspotCardProps> = ({ hotspot, onConnect }) => {
    const isOffline = hotspot.status === 'down';

    return (
        <div className={`hotspot-card ${isOffline ? 'offline' : ''}`}>
            <div className="card-header">
                <div className="location-info">
                    <span className="loc-icon">{hotspot.icon}</span>
                    <div>
                        <div className="loc-name">{hotspot.name}</div>
                        <div className="loc-sub">{hotspot.location}</div>
                    </div>
                </div>
                <StatusBadge status={hotspot.status} />
            </div>
            <div className="card-body">
                <span className="ssid-tag">📶 {hotspot.ssid}</span>
                <div className="card-details">
                    <div className="detail-item">
                        <span className="detail-label">Speed</span>
                        <span className="detail-value">{hotspot.speed}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Coverage</span>
                        <span className="detail-value">{hotspot.coverage}</span>
                    </div>
                </div>
            </div>
            <button 
                className="btn-connect" 
                disabled={isOffline}
                onClick={() => !isOffline && onConnect(hotspot)}
            >
                {isOffline ? 'OFFLINE' : 'HOW TO CONNECT'}
            </button>
            <div className="card-footer">
                <span className="detail-label">Last Report: {hotspot.lastUpdated}</span>
            </div>
        </div>
    );
};

export default HotspotCard;
