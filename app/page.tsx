'use client'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MenuIcon, SearchIcon, Edit2Icon, PlusIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type FoodItem = {
  id: number
  name: string
  price: number
  status: 'Available' | 'Not Available' 
  description: string
  category: string
}

const initialFoodItems: FoodItem[] = [
  { id: 1, name: "Margherita Pizza", price: 12.99, status: "Available", description: "Classic pizza with tomato sauce, mozzarella, and basil.", category: "Italian" },
  { id: 2, name: "Chicken Alfredo", price: 15.99, status: "Available", description: "Creamy pasta dish with grilled chicken and parmesan cheese.", category: "Italian" },
  { id: 3, name: "Caesar Salad", price: 8.99, status: "Not Available", description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan.", category: "American" },
  { id: 4, name: "Beef Burger", price: 10.99, status: "Available", description: "Juicy beef patty with lettuce, tomato, and special sauce.", category: "American" },
  { id: 5, name: "Vegetable Stir Fry", price: 11.99, status: "Available", description: "Assorted vegetables stir-fried in a savory sauce.", category: "Chinese" },
]

const categories = ["All", "Italian", "American", "Chinese", "North Indian", "South Indian"]

export default function RestaurantAdminDashboard() {
  const [foodItems, setFoodItems] = useState(initialFoodItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [newItem, setNewItem] = useState<Omit<FoodItem, 'id'>>({
    name: '',
    price: 0,
    status: 'Available',
    description: '',
    category: ''
  })

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || item.category === selectedCategory)
  )

  const handleAddItem = () => {
    setFoodItems(prev => [...prev, { ...newItem, id: prev.length + 1 }])
    setNewItem({
      name: '',
      price: 0,
      status: 'Available',
      description: '',
      category: ''
    })
  }

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
          <div className="mb-6 flex space-x-4">
            <Input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Food Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price</Label>
                    <Input id="price" type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select value={newItem.status} onValueChange={(value) => setNewItem({...newItem, status: value as 'Available' | 'Not Available'})}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== 'All').map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea id="description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="col-span-3" />
                  </div>
                </div>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogContent>
            </Dialog>
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
                  <Badge variant="outline" className="ml-2">{item.category}</Badge>
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