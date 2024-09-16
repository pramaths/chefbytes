'use client';

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const mockOrders = [
  { id: '1', phoneNumber: '1234567890', items: JSON.stringify([{name: 'Pizza', quantity: 2}]), status: 'PAYMENTPENDING' },
  { id: '2', phoneNumber: '0987654321', items: JSON.stringify([{name: 'Burger', quantity: 1}]), status: 'OUTFORDELIVERY' },
  { id: '3', phoneNumber: '5555555555', items: JSON.stringify([{name: 'Salad', quantity: 1}]), status: 'DELIVERED' },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleSaveOrder = (editedOrder) => {
    setOrders(orders.map(order => order.id === editedOrder.id ? editedOrder : order));
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Restaurant Name Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage and view all orders for your restaurant here.</p>
        </CardContent>
      </Card>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.phoneNumber}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={selectedOrder.phoneNumber}
                  onChange={(e) => setSelectedOrder({...selectedOrder, phoneNumber: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="items" className="text-right">
                  Items
                </Label>
                <Input
                  id="items"
                  value={selectedOrder.items}
                  onChange={(e) => setSelectedOrder({...selectedOrder, items: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={(value) => setSelectedOrder({...selectedOrder, status: value})}
                  defaultValue={selectedOrder.status}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYMENTPENDING">Payment Pending</SelectItem>
                    <SelectItem value="OUTFORDELIVERY">Out for Delivery</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <Button onClick={() => handleSaveOrder(selectedOrder)}>Save Changes</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;