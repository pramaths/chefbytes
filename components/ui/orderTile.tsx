import React from 'react';
import { Button } from "@/components/ui/button"; // Adjust the import based on your project structure

interface OrderTileProps {
    orderTitle: string;
    orderDescription: string;
}

const OrderTile: React.FC<OrderTileProps> = ({ orderTitle, orderDescription }) => {
    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
            {/* Left Side: Text Sections and View Details Button */}
            <div className="flex flex-col mb-4 md:mb-0">
                <p className="text-sm font-black ">{orderTitle}</p>
                <p className="text-sm ">{orderDescription}</p>
                <Button size='sm' variant='outline' className="mt-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 w-full md:w-auto">
                    View Details
                </Button>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex flex-col space-y-1">
                <Button
                    variant='outline'
                    size='sm'
                    className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition duration-300"
                >
                    Mark Delivered
                </Button>
                <Button
                    variant='outline'
                    size='sm'
                    className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition duration-300"
                >
                    Cancel Delivery
                </Button>
            </div>
        </div>
    );
};

export default OrderTile;
