'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderItem {
  name: string;
  price: number;
}

interface Order {
  id: string;
  phoneNumber: string;
  items: OrderItem[];
  isComplete: boolean;
  status: 'PAYMENTPENDING' | 'OUTFORDELIVERY' | 'DELIVERED';
}

const restaurantId = process.env.NEXT_PUBLIC_REACT_APP_RESTAURANT_ID || '';
const API_BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL || '';

const OrderManagement: React.FC = () => {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState({ phoneNumber: '', items: '' });
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      fetchOrders();
    }
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${restaurantId}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/${restaurantId}/orders`, {
        ...newOrder,
        items: JSON.parse(newOrder.items)
      });
      setNewOrder({ phoneNumber: '', items: '' });
      setIsAddDialogOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      await axios.put(`${API_BASE_URL}/${restaurantId}/orders/${editingOrder.id}`, editingOrder);
      setEditingOrder(null);
      setIsEditDialogOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${restaurantId}/orders/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-black sm:text-xl">Order Management</h1>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Order</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOrder} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={newOrder.phoneNumber}
                onChange={(e) => setNewOrder({ ...newOrder, phoneNumber: e.target.value })}
                placeholder="Phone Number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="items">Items (JSON format)</Label>
              <Textarea
                id="items"
                value={newOrder.items}
                onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
                placeholder="Items (JSON format)"
              />
            </div>
            <Button type="submit">Add Order</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order {order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Phone: {order.phoneNumber}</p>
              <p>Items:</p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>{item.name} - ₹{item.price}</li>
                ))}
              </ul>
              <p>Status: {order.status}</p>
              <p>Complete: {order.isComplete ? 'Yes' : 'No'}</p>
            </CardContent>
            <CardFooter className="space-x-2">
              <Button variant="outline" onClick={() => { setEditingOrder(order); setIsEditDialogOpen(true); }}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteOrder(order.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editPhoneNumber">Phone Number</Label>
                <Input
                  id="editPhoneNumber"
                  value={editingOrder.phoneNumber}
                  // onChange={(e) => setEditingOrder({ ...editingOrder, phoneNumber: e.target.value })}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editItems">Items</Label>
                {editingOrder.items.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...editingOrder.items];
                        newItems[index].name = e.target.value;
                        setEditingOrder({ ...editingOrder, items: newItems });
                      }}
                      placeholder="Item name"
                    />
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...editingOrder.items];
                        newItems[index].price = Number(e.target.value);
                        setEditingOrder({ ...editingOrder, items: newItems });
                      }}
                      placeholder="Price"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={editingOrder.status}
                  onValueChange={(value) => setEditingOrder({ ...editingOrder, status: value as Order['status'] })}
                >
                  <SelectTrigger id="editStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYMENTPENDING">Payment Pending</SelectItem>
                    <SelectItem value="OUTFORDELIVERY">Out for Delivery</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="editIsComplete"
                  checked={editingOrder.isComplete}
                  onCheckedChange={(checked) => setEditingOrder({ ...editingOrder, isComplete: checked as boolean })}
                />
                <Label htmlFor="editIsComplete">Complete</Label>
              </div>
              <Button type="submit">Update Order</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;