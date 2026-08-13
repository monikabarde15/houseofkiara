// components/StatTiles.tsx
import React from 'react';
import './styles/StatTiles.css';

export interface StatTile {
  label: string;
  number: string | number;
  numberColor: 'charcoal' | 'sage' | 'gold';
  caption: string;
  onClick?: () => void;
}

interface StatTilesProps {
  tiles: StatTile[];
}

export const StatTiles: React.FC<StatTilesProps> = ({ tiles }) => {
  return (
    <div className="msg-stat-tiles">
      {tiles.map((tile, index) => (
        <div 
          key={index} 
          className="msg-stat-tile"
          onClick={tile.onClick}
          role={tile.onClick ? 'button' : undefined}
        >
          <div className="msg-stat-tile-label">{tile.label}</div>
          <div className={`msg-stat-tile-number msg-stat-tile-number--${tile.numberColor}`}>
            {tile.number}
          </div>
          <div className="msg-stat-tile-caption">{tile.caption}</div>
        </div>
      ))}
    </div>
  );
};