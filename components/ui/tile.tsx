import React from 'react';

interface TileProps {
    title: string;
    description: string;
    variant?: 'fullWidth' | 'default'; // Variant prop for full width or default tiles
}

const Tile: React.FC<TileProps> = ({ title, description, variant = 'default' }) => {
    return (
        <div className="bg-white shadow-md p-4 rounded-lg hover:shadow-xl hover:scale-105 transition-transform transform duration-300 ease-in-out flex flex-col items-center justify-center text-center">
            {variant === 'fullWidth' ? (
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
            ) : (
                <h3 className="text-xl font-bold mb-2">{title}</h3>
            )}
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default Tile;    