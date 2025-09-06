import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Download, Calendar, MapPin, Users, CreditCard } from 'lucide-react';

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    type: 'hotel' | 'bus' | 'guide';
    details: any;
    amount: number;
    payment_id: string;
    created_at: string;
  };
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const handleDownloadReceipt = () => {
    // Mock receipt download
    const receiptData = `
SIKKIM TOURISM - BOOKING RECEIPT
================================

Booking ID: ${booking.id}
Booking Type: ${booking.type.toUpperCase()}
Date: ${new Date(booking.created_at).toLocaleDateString()}
Payment ID: ${booking.payment_id}

BOOKING DETAILS:
${booking.type === 'hotel' ? 
  `Hotel: ${booking.details.name}
  Location: ${booking.details.location}
  Check-in: ${booking.details.checkIn}
  Check-out: ${booking.details.checkOut}
  Guests: ${booking.details.guests}
  Rooms: ${booking.details.rooms}` :
  booking.type === 'bus' ?
  `Route: ${booking.details.from} to ${booking.details.to}
  Date: ${booking.details.date}
  Time: ${booking.details.time}
  Passengers: ${booking.details.passengers}
  Seats: ${booking.details.seats}` :
  `Guide: ${booking.details.name}
  Specialization: ${booking.details.specialization}
  Location: ${booking.details.location}
  Date: ${booking.details.date}
  Duration: ${booking.details.duration} day(s)`
}

PAYMENT DETAILS:
Amount Paid: ₹${booking.amount}
Payment Method: UPI/QR Code
Status: CONFIRMED

Thank you for choosing Sikkim Tourism!
    `;

    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-xl">Booking Confirmed!</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Booking Status */}
          <div className="text-center">
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              CONFIRMED
            </Badge>
            <p className="text-muted-foreground mt-2">
              Your {booking.type} booking has been successfully confirmed
            </p>
          </div>

          {/* Booking Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {booking.type === 'hotel' ? <MapPin className="h-5 w-5" /> : 
                 booking.type === 'bus' ? <Calendar className="h-5 w-5" /> : 
                 <Users className="h-5 w-5" />}
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Booking ID:</span>
                  <p className="font-mono text-xs">{booking.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="capitalize">{booking.type}</p>
                </div>
              </div>

              {booking.type === 'hotel' ? (
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground">Hotel:</span>
                    <p className="font-semibold">{booking.details.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Check-in:</span>
                      <p>{new Date(booking.details.checkIn).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Check-out:</span>
                      <p>{new Date(booking.details.checkOut).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Guests:</span>
                      <p>{booking.details.guests}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rooms:</span>
                      <p>{booking.details.rooms}</p>
                    </div>
                  </div>
                </div>
              ) : booking.type === 'bus' ? (
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground">Route:</span>
                    <p className="font-semibold">{booking.details.from} → {booking.details.to}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p>{new Date(booking.details.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <p>{booking.details.time}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Passengers:</span>
                      <p>{booking.details.passengers}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Seats:</span>
                      <p>{booking.details.seats?.join ? booking.details.seats.join(', ') : booking.details.seats}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground">Guide:</span>
                    <p className="font-semibold">{booking.details.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Specialization:</span>
                      <p>{booking.details.specialization}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p>{booking.details.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p>{new Date(booking.details.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p>{booking.details.duration} day{booking.details.duration > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-semibold">₹{booking.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment ID:</span>
                <span className="font-mono text-xs">{booking.payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span>UPI/QR Code</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="default" className="bg-green-500">PAID</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleDownloadReceipt} 
              variant="outline" 
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>

          {/* Contact Info */}
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              For any queries, contact us at{' '}
              <span className="font-medium">support@sikkimtourism.com</span>
              <br />
              or call <span className="font-medium">+91-98765-43210</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmation;