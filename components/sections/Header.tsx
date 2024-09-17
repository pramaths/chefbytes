import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const router = useRouter();
  const restaurantName = process.env.NEXT_PUBLIC_RESTAURANT_NAME || 'My Restaurant';

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">{restaurantName}</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button
                variant="ghost"
                onClick={() => router.push('/orders')}
              >
                Orders
              </Button>
            </li>
            <li>
              <Link href="/" passHref>
                <Button variant="ghost">Menu Items</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;