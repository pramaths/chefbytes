'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from 'axios';

const cuisines = ['ITALIAN', 'CHINESE', 'NORTHINDIAN', 'SOUTHINDIAN', 'AMERICAN'];
const categories = ['SNACK', 'MAINCOURSE', 'DESSERT', 'BEVERAGE'];

const API_BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL || '';
const RESTAURANT_ID = process.env.NEXT_PUBLIC_REACT_APP_RESTAURANT_ID || '';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  cuisine: string;
  category: string;
  isAvailable: boolean;
}

const RestaurantMenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    price: 0,
    cuisine: '',
    category: '',
    isAvailable: true,
  });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get<MenuItem[]>(`${API_BASE_URL}/${RESTAURANT_ID}/menu-items`);
      console.log(response);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post(`${API_BASE_URL}/${RESTAURANT_ID}/menu-items`, newItem);
      fetchMenuItems();
      setNewItem({ name: '', price: 0, cuisine: '', category: '', isAvailable: true });
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleUpdateItem = async () => {
    if (editingItem) {
      try {
        await axios.put(`${API_BASE_URL}/${RESTAURANT_ID}/menu-items/${editingItem.id}`, editingItem);
        fetchMenuItems();
        setEditingItem(null);
      } catch (error) {
        console.error('Error updating menu item:', error);
      }
    }
  };

  const groupedItems = menuItems.reduce((acc: Record<string, Record<string, MenuItem[]>>, item) => {
    if (!acc[item.cuisine]) acc[item.cuisine] = {};
    if (!acc[item.cuisine][item.category]) acc[item.cuisine][item.category] = [];
    acc[item.cuisine][item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white">
      <h1 className="text-2xl text-black font-bold mb-4">Restaurant Menu Manager</h1>

      {/* Add New Item Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            {/* Price Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            {/* Cuisine Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cuisine" className="text-right">
                Cuisine
              </Label>
              <Select
                value={newItem.cuisine}
                onValueChange={(value) => setNewItem({ ...newItem, cuisine: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Category Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Availability Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isAvailable" className="text-right">
                Availability
              </Label>
              <Switch
                checked={newItem.isAvailable}
                onCheckedChange={(checked) => setNewItem({ ...newItem, isAvailable: checked })}
                id="isAvailable"
              />
            </div>
          </div>
          <Button onClick={handleAddItem}>Add Item</Button>
        </DialogContent>
      </Dialog>

      {/* Display Menu Items */}
      {Object.entries(groupedItems).map(([cuisine, categories]) => (
        <Card key={cuisine} className="mb-6">
          <CardHeader>
            <CardTitle>{cuisine}</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(categories).map(([category, items]) => (
              <div key={category} className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-sm text-gray-600">Price: ${item.price}</p>
                        <Badge variant={item.isAvailable ? 'default' : 'destructive'}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setEditingItem(item)}
                        >
                          Edit
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Edit Item Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Name Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              {/* Price Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              {/* Cuisine Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cuisine" className="text-right">
                  Cuisine
                </Label>
                <Select
                  value={editingItem.cuisine}
                  onValueChange={(value) => setEditingItem({ ...editingItem, cuisine: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisines.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Category Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={editingItem.category}
                  onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Availability Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isAvailable" className="text-right">
                  Availability
                </Label>
                <Switch
                  checked={editingItem.isAvailable}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, isAvailable: checked })}
                  id="edit-isAvailable"
                />
              </div>
              <Button onClick={handleUpdateItem}>Update Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RestaurantMenuManager;
