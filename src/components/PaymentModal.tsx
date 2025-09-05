import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Smartphone, CreditCard, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingDetails: any;
  onPaymentSuccess: (paymentId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  bookingDetails,
  onPaymentSuccess,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qr');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { toast } = useToast();

  // Mock QR code data
  const mockQRData = `upi://pay?pa=merchant@razorpay&pn=Sikkim Tourism&am=${amount}&cu=INR&tn=Booking Payment`;

  const handlePayment = async (method: string) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock success
    const mockPaymentId = `rzp_test_${Date.now()}`;
    setPaymentCompleted(true);
    setIsProcessing(false);
    
    toast({
      title: "Payment Successful!",
      description: `Payment ID: ${mockPaymentId}`,
    });
    
    setTimeout(() => {
      onPaymentSuccess(mockPaymentId);
      setPaymentCompleted(false);
      onClose();
    }, 2000);
  };

  const handleUPIPayment = async () => {
    if (!upiId.trim()) {
      toast({
        title: "UPI ID Required",
        description: "Please enter a valid UPI ID",
        variant: "destructive",
      });
      return;
    }
    await handlePayment('upi');
  };

  if (paymentCompleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-green-700">Payment Successful!</h3>
            <p className="text-muted-foreground text-center mt-2">
              Your booking has been confirmed. Redirecting...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">{bookingDetails.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{bookingDetails.name}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="upi" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                UPI ID
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Mock QR Code */}
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-muted-foreground">
                      <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center rounded">
                        <QrCode className="h-24 w-24 text-primary" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Scan this QR code with any UPI app
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">Google Pay</span>
                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">PhonePe</span>
                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">Paytm</span>
                        <span className="px-2 py-1 bg-primary/10 rounded text-xs">BHIM</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handlePayment('qr')} 
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? 'Processing...' : 'I have paid via QR Code'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upi" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upiId">Enter UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="example@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: username@bankname or mobile@upi
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Payment Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Merchant:</span>
                          <span>Sikkim Tourism</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>₹{amount}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleUPIPayment} 
                      disabled={isProcessing || !upiId.trim()}
                      className="w-full"
                    >
                      {isProcessing ? 'Processing Payment...' : 'Pay Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Test Mode Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Test Mode:</strong> This is a simulated payment. No actual transaction will occur.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;