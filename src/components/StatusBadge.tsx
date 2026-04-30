import React from 'react';
import type { HotspotStatus } from '../types';

interface StatusBadgeProps {
    status: HotspotStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const labels: Record<HotspotStatus, string> = {
        up: 'Working',
        slow: 'Slow',
        down: 'Down',
        unknown: 'Unknown'
    };

    const classes: Record<HotspotStatus, string> = {
        up: 'badge-up',
        slow: 'badge-slow',
        down: 'badge-down',
        unknown: 'badge-down'
    };

    return (
        <div className={`status-badge ${classes[status]}`}>
            <span className="dot"></span>
            {labels[status]}
        </div>
    );
};

export default StatusBadge;
