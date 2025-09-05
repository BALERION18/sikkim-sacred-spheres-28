import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bus, Calendar as CalendarIcon, Clock, MapPin, CreditCard, Users, Route, Hotel, Star, Wifi, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import PaymentModal from "@/components/PaymentModal";
import BookingConfirmation from "@/components/BookingConfirmation";

interface BusRoute {
  id: string;
  route_name: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  price: number;
  available_seats: number;
  bus_type: string;
  operating_days: string[];
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price_per_night: number;
  available_rooms: number;
  amenities: string[];
  room_type: string;
  image_url?: string;
}

interface BookingForm {
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  seats_booked: number;
  travel_date: Date | undefined;
  check_in_date?: Date | undefined;
  check_out_date?: Date | undefined;
  rooms_booked?: number;
}

export const BusScheduling = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingType, setBookingType] = useState<'bus' | 'hotel'>('bus');
  const [showBooking, setShowBooking] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const [bookingForm, setBookingForm] = useState<BookingForm>({
    passenger_name: '',
    passenger_email: '',
    passenger_phone: '',
    seats_booked: 1,
    travel_date: undefined,
    check_in_date: undefined,
    check_out_date: undefined,
    rooms_booked: 1,
  });

  useEffect(() => {
    // Use dummy data instead of fetching from database
    setRoutes(dummyRoutes);
    setHotels(dummyHotels);
    setLoading(false);
  }, []);

  // Dummy data for bus routes
  const dummyRoutes: BusRoute[] = [
    {
      id: '1',
      route_name: 'Gangtok to Rumtek Monastery',
      origin: 'Gangtok',
      destination: 'Rumtek Monastery',
      departure_time: '08:00:00',
      arrival_time: '08:45:00',
      duration_minutes: 45,
      price: 150,
      available_seats: 25,
      bus_type: 'regular',
      operating_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    {
      id: '2',
      route_name: 'Gangtok to Pemayangtse Monastery',
      origin: 'Gangtok',
      destination: 'Pemayangtse Monastery',
      departure_time: '07:30:00',
      arrival_time: '10:15:00',
      duration_minutes: 165,
      price: 300,
      available_seats: 18,
      bus_type: 'deluxe',
      operating_days: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday']
    },
    {
      id: '3',
      route_name: 'Gangtok to Tashiding Monastery',
      origin: 'Gangtok',
      destination: 'Tashiding Monastery',
      departure_time: '06:45:00',
      arrival_time: '09:30:00',
      duration_minutes: 165,
      price: 280,
      available_seats: 20,
      bus_type: 'ac',
      operating_days: ['Tuesday', 'Thursday', 'Saturday', 'Sunday']
    }
  ];

  // Dummy data for hotels in Sikkim
  const dummyHotels: Hotel[] = [
    {
      id: '1',
      name: 'The Elgin Nor-Khill',
      location: 'Gangtok',
      rating: 4.5,
      price_per_night: 8500,
      available_rooms: 12,
      amenities: ['WiFi', 'Restaurant', 'Spa', 'Mountain View', 'Room Service'],
      room_type: 'Deluxe Suite'
    },
    {
      id: '2',
      name: 'Mayfair Spa Resort & Casino',
      location: 'Gangtok',
      rating: 4.8,
      price_per_night: 12000,
      available_rooms: 8,
      amenities: ['WiFi', 'Casino', 'Spa', 'Pool', 'Mountain View', 'Gym'],
      room_type: 'Premium Suite'
    },
    {
      id: '3',
      name: 'Hotel Tibet',
      location: 'Gangtok',
      rating: 4.2,
      price_per_night: 4500,
      available_rooms: 15,
      amenities: ['WiFi', 'Restaurant', 'Mountain View', 'Parking'],
      room_type: 'Standard Room'
    },
    {
      id: '4',
      name: 'Norkhil Boutique Hotel',
      location: 'Pelling',
      rating: 4.3,
      price_per_night: 6500,
      available_rooms: 10,
      amenities: ['WiFi', 'Restaurant', 'Kanchenjunga View', 'Garden'],
      room_type: 'Heritage Room'
    },
    {
      id: '5',
      name: 'Bamboo Retreat',
      location: 'Namchi',
      rating: 4.1,
      price_per_night: 3500,
      available_rooms: 20,
      amenities: ['WiFi', 'Restaurant', 'Organic Garden', 'Nature Walks'],
      room_type: 'Eco Room'
    }
  ];

  const fetchRoutes = async () => {
    // Simulate API call with dummy data
    setRoutes(dummyRoutes);
    setLoading(false);
  };

  const handleBookRoute = (route: BusRoute) => {
    setSelectedRoute(route);
    setBookingType('bus');
    setShowBooking(true);
    
    // Pre-fill user email if logged in
    if (user?.email) {
      setBookingForm(prev => ({
        ...prev,
        passenger_email: user.email!,
      }));
    }
  };

  const handleBookHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setBookingType('hotel');
    setShowBooking(true);
    
    // Pre-fill user email if logged in
    if (user?.email) {
      setBookingForm(prev => ({
        ...prev,
        passenger_email: user.email!,
      }));
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with your booking.",
        variant: "destructive",
      });
      return;
    }

    if (bookingType === 'bus') {
      if (!selectedRoute || !bookingForm.travel_date) {
        toast({
          title: "Missing Information",
          description: "Please select a travel date",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!selectedHotel || !bookingForm.check_in_date || !bookingForm.check_out_date) {
        toast({
          title: "Missing Information",
          description: "Please select check-in and check-out dates",
          variant: "destructive",
        });
        return;
      }
    }

    // Show payment modal instead of confirming booking
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      let bookingDetails, totalAmount;

      if (bookingType === 'bus' && selectedRoute) {
        totalAmount = selectedRoute.price * bookingForm.seats_booked;
        bookingDetails = {
          type: 'bus',
          name: selectedRoute.route_name,
          from: selectedRoute.origin,
          to: selectedRoute.destination,
          date: bookingForm.travel_date!.toISOString(),
          time: formatTime(selectedRoute.departure_time),
          passengers: bookingForm.seats_booked,
          seats: Array.from({ length: bookingForm.seats_booked }, (_, i) => `${i + 1}`),
          passengerName: bookingForm.passenger_name,
          email: bookingForm.passenger_email,
          phone: bookingForm.passenger_phone,
        };
      } else if (selectedHotel) {
        const nights = Math.ceil((bookingForm.check_out_date!.getTime() - bookingForm.check_in_date!.getTime()) / (1000 * 60 * 60 * 24));
        totalAmount = selectedHotel.price_per_night * nights * (bookingForm.rooms_booked || 1);
        bookingDetails = {
          type: 'hotel',
          name: selectedHotel.name,
          location: selectedHotel.location,
          checkIn: bookingForm.check_in_date!.toISOString(),
          checkOut: bookingForm.check_out_date!.toISOString(),
          guests: bookingForm.rooms_booked || 1,
          rooms: bookingForm.rooms_booked || 1,
          nights: nights,
          passengerName: bookingForm.passenger_name,
          email: bookingForm.passenger_email,
          phone: bookingForm.passenger_phone,
        };
      } else {
        return;
      }

      // Save booking to database
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          booking_type: bookingType,
          details: bookingDetails,
          amount: totalAmount,
          payment_status: 'success',
          payment_id: paymentId,
        })
        .select()
        .single();

      if (error) {
        console.error('Booking save error:', error);
        toast({
          title: "Booking Error",
          description: "Failed to save booking. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      setConfirmedBooking(data);
      setShowPaymentModal(false);
      setShowConfirmation(true);
      
      // Reset form
      setShowBooking(false);
      setSelectedRoute(null);
      setSelectedHotel(null);
      setBookingForm({
        passenger_name: '',
        passenger_email: user?.email || '',
        passenger_phone: '',
        seats_booked: 1,
        travel_date: undefined,
        check_in_date: undefined,
        check_out_date: undefined,
        rooms_booked: 1,
      });

    } catch (error) {
      console.error('Payment success handler error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getBusTypeIcon = (type: string) => {
    switch (type) {
      case 'ac':
        return '❄️ AC';
      case 'deluxe':
        return '⭐ Deluxe';
      default:
        return '🚌 Regular';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <Button variant="outline" disabled className="text-foreground border-foreground/20">
        <Bus className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-foreground border-primary/20 hover:bg-primary/10">
          <Bus className="w-4 h-4 mr-1" />
          <span>/</span>
          <Hotel className="w-4 h-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center space-x-2">
            <Bus className="w-5 h-5" />
            <span>/</span>
            <Hotel className="w-5 h-5" />
            <span>Bus & Hotel Booking</span>
          </DialogTitle>
        </DialogHeader>

        {!showBooking ? (
          <div className="space-y-4">
            <div className="flex border-b border-foreground/20">
              <button
                onClick={() => setBookingType('bus')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  bookingType === 'bus' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Bus className="w-4 h-4 inline mr-2" />
                Bus Booking
              </button>
              <button
                onClick={() => setBookingType('hotel')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  bookingType === 'hotel' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Hotel className="w-4 h-4 inline mr-2" />
                Hotel Booking
              </button>
            </div>

            {bookingType === 'bus' ? (
              <>
                <div className="text-sm text-foreground/70 mb-4">
                  Book your bus tickets to visit monasteries and explore Sikkim
                </div>

                <div className="grid gap-4">
                  {routes.map((route) => (
                    <Card key={route.id} className="hover:shadow-md transition-shadow bg-card/80 backdrop-blur-sm border-foreground/20">
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">{route.route_name}</h4>
                        <div className="text-sm text-foreground/70">
                          {getBusTypeIcon(route.bus_type)}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          {route.origin}
                        </div>
                        <div className="text-xs text-foreground/70">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatTime(route.departure_time)}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          {route.destination}
                        </div>
                        <div className="text-xs text-foreground/70">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatTime(route.arrival_time)}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">₹{route.price}</div>
                          <div className="text-xs text-foreground/70">
                            <Users className="w-3 h-3 inline mr-1" />
                            {route.available_seats} seats
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleBookRoute(route)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-foreground/70 mb-4">
              Book hotels in Sikkim for your monastery visits and exploration
            </div>

            <div className="grid gap-4">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="hover:shadow-md transition-shadow bg-card/80 backdrop-blur-sm border-foreground/20">
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">{hotel.name}</h4>
                        <div className="flex items-center text-sm text-foreground/70">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {hotel.rating} Rating
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          {hotel.location}
                        </div>
                        <div className="text-xs text-foreground/70">
                          {hotel.room_type}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-foreground/70">
                          Amenities: {hotel.amenities.slice(0, 3).join(', ')}
                          {hotel.amenities.length > 3 && '...'}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">₹{hotel.price_per_night}</div>
                          <div className="text-xs text-foreground/70">per night</div>
                          <div className="text-xs text-foreground/70">
                            <Hotel className="w-3 h-3 inline mr-1" />
                            {hotel.available_rooms} rooms
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleBookHotel(hotel)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/20 p-4 rounded-lg">
              {bookingType === 'bus' ? (
                <>
                  <h3 className="font-semibold text-foreground mb-2">
                    {selectedRoute?.route_name}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/70">
                    <div>
                      <Route className="w-4 h-4 inline mr-2" />
                      {selectedRoute?.origin} → {selectedRoute?.destination}
                    </div>
                    <div>
                      <Clock className="w-4 h-4 inline mr-2" />
                      {selectedRoute && formatTime(selectedRoute.departure_time)} - {selectedRoute && formatTime(selectedRoute.arrival_time)}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-foreground mb-2">
                    {selectedHotel?.name}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/70">
                    <div>
                      <MapPin className="w-4 h-4 inline mr-2" />
                      {selectedHotel?.location}
                    </div>
                    <div>
                      <Star className="w-4 h-4 inline mr-2 fill-yellow-400 text-yellow-400" />
                      {selectedHotel?.rating} Rating - {selectedHotel?.room_type}
                    </div>
                  </div>
                </>
              )}
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                  <Input
                    value={bookingForm.passenger_name}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, passenger_name: e.target.value }))}
                    placeholder="Enter passenger name"
                    required
                    className="bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={bookingForm.passenger_email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, passenger_email: e.target.value }))}
                    placeholder="Enter email address"
                    required
                    className="bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                  <Input
                    value={bookingForm.passenger_phone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, passenger_phone: e.target.value }))}
                    placeholder="Enter phone number"
                    required
                    className="bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {bookingType === 'bus' ? 'Number of Seats' : 'Number of Rooms'}
                  </label>
                  <Select
                    value={bookingType === 'bus' ? bookingForm.seats_booked.toString() : (bookingForm.rooms_booked || 1).toString()}
                    onValueChange={(value) => setBookingForm(prev => ({ 
                      ...prev, 
                      [bookingType === 'bus' ? 'seats_booked' : 'rooms_booked']: parseInt(value) 
                    }))}
                  >
                    <SelectTrigger className="bg-background text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {bookingType === 'bus' ? `seat${num > 1 ? 's' : ''}` : `room${num > 1 ? 's' : ''}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {bookingType === 'bus' ? (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Travel Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-background text-foreground border-foreground/20"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingForm.travel_date ? format(bookingForm.travel_date, "PPP") : "Select travel date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={bookingForm.travel_date}
                        onSelect={(date) => setBookingForm(prev => ({ ...prev, travel_date: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Check-in Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-background text-foreground border-foreground/20"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingForm.check_in_date ? format(bookingForm.check_in_date, "PPP") : "Select check-in date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bookingForm.check_in_date}
                          onSelect={(date) => setBookingForm(prev => ({ ...prev, check_in_date: date }))}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Check-out Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-background text-foreground border-foreground/20"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingForm.check_out_date ? format(bookingForm.check_out_date, "PPP") : "Select check-out date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bookingForm.check_out_date}
                          onSelect={(date) => setBookingForm(prev => ({ ...prev, check_out_date: date }))}
                          disabled={(date) => date < new Date() || (bookingForm.check_in_date && date <= bookingForm.check_in_date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              {bookingType === 'bus' ? (
                selectedRoute && bookingForm.seats_booked > 0 && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-foreground">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-xl font-bold">₹{selectedRoute.price * bookingForm.seats_booked}</span>
                    </div>
                    <div className="text-sm text-foreground/70 mt-1">
                      {bookingForm.seats_booked} seat{bookingForm.seats_booked > 1 ? 's' : ''} × ₹{selectedRoute.price}
                    </div>
                  </div>
                )
              ) : (
                selectedHotel && bookingForm.rooms_booked && bookingForm.check_in_date && bookingForm.check_out_date && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-foreground">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-xl font-bold">
                        ₹{selectedHotel.price_per_night * (bookingForm.rooms_booked || 1) * 
                          Math.ceil((bookingForm.check_out_date.getTime() - bookingForm.check_in_date.getTime()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                    <div className="text-sm text-foreground/70 mt-1">
                      {bookingForm.rooms_booked} room{(bookingForm.rooms_booked || 1) > 1 ? 's' : ''} × ₹{selectedHotel.price_per_night} × {
                        Math.ceil((bookingForm.check_out_date.getTime() - bookingForm.check_in_date.getTime()) / (1000 * 60 * 60 * 24))
                      } night{Math.ceil((bookingForm.check_out_date.getTime() - bookingForm.check_in_date.getTime()) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}
                    </div>
                  </div>
                )
              )}

              <div className="flex space-x-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Confirm Booking
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowBooking(false);
                    setSelectedRoute(null);
                    setSelectedHotel(null);
                  }}
                  className="flex-1 border-foreground/20 text-foreground hover:bg-foreground/10"
                >
                  {bookingType === 'bus' ? 'Back to Routes' : 'Back to Hotels'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={bookingType === 'bus' && selectedRoute 
          ? selectedRoute.price * bookingForm.seats_booked
          : bookingType === 'hotel' && selectedHotel && bookingForm.check_in_date && bookingForm.check_out_date
          ? selectedHotel.price_per_night * (bookingForm.rooms_booked || 1) * 
            Math.ceil((bookingForm.check_out_date.getTime() - bookingForm.check_in_date.getTime()) / (1000 * 60 * 60 * 24))
          : 0
        }
        bookingDetails={bookingType === 'bus' && selectedRoute ? {
          type: 'bus',
          name: selectedRoute.route_name,
        } : bookingType === 'hotel' && selectedHotel ? {
          type: 'hotel',
          name: selectedHotel.name,
        } : { type: 'unknown', name: 'Unknown' }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Booking Confirmation */}
      {confirmedBooking && (
        <BookingConfirmation
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          booking={confirmedBooking}
        />
      )}
    </Dialog>
  );
};