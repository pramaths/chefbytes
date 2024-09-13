'use client'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MenuIcon, SearchIcon, Edit2Icon } from 'lucide-react'

type FoodItem = {
  id: number
  name: string
  price: number
  status: 'Available' | 'Not Available' 
  description: string
}

const foodItems: FoodItem[] = [
  { id: 1, name: "Margherita Pizza", price: 12.99, status: "Available", description: "Classic pizza with tomato sauce, mozzarella, and basil." },
  { id: 2, name: "Chicken Alfredo", price: 15.99, status: "Available", description: "Creamy pasta dish with grilled chicken and parmesan cheese." },
  { id: 3, name: "Caesar Salad", price: 8.99, status: "Not Available", description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan." },
  { id: 4, name: "Beef Burger", price: 10.99, status: "Available", description: "Juicy beef patty with lettuce, tomato, and special sauce." },
  { id: 5, name: "Vegetable Stir Fry", price: 11.99, status: "Available", description: "Assorted vegetables stir-fried in a savory sauce." },
]

export default function RestaurantAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gourmet Delights</h1>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              // icon={<SearchIcon className="h-4 w-4 text-gray-400" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
                  <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Edit2Icon className="h-4 w-4 mr-2" /> Edit Item
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}