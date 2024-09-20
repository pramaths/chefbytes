import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ButtonIcon, PersonIcon } from '@radix-ui/react-icons';

const Header: React.FC = () => {
  const router = useRouter();
  const restaurantName = process.env.NEXT_PUBLIC_RESTAURANT_NAME || 'Chef Bytes';

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">{restaurantName}</div>
        <div className="items-center">
          <Button variant='destructive'> Inactive</Button>
        </div>
        <div className="items-end">
          <Button className="w-12 h-12 p-2 rounded-full flex justify-center items-center">
            <PersonIcon width='30' height='30'></PersonIcon>
          </Button>
        </div>
        {/* <nav>
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
        </nav> */}
      </div>
    </header>
  );
};

export default Header;