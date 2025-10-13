
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, Users, MapPin, Wifi } from "lucide-react";
import { format } from "date-fns";

interface DateTimeSelectionProps {
  selectedDateTime: any;
  onDateTimeSelect: (dateTime: any) => void;
  examMode: "physical" | "online" | null;
}

const DateTimeSelection = ({ selectedDateTime, onDateTimeSelect, examMode }: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selectedDateTime?.date);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(selectedDateTime?.timeSlot || null);

  // Mock available dates (next 2 weeks)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  // Mock time slots with availability
  const timeSlots = [
    {
      id: "morning-1",
      label: "Morning Session A",
      time: "8:00 AM - 11:00 AM",
      available: 15,
      total: 30,
      location: examMode === "physical" ? "Main Hall A" : "Online Portal"
    },
    {
      id: "morning-2", 
      label: "Morning Session B",
      time: "9:00 AM - 12:00 PM",
      available: 8,
      total: 30,
      location: examMode === "physical" ? "Main Hall B" : "Online Portal"
    },
    {
      id: "afternoon-1",
      label: "Afternoon Session A",
      time: "2:00 PM - 5:00 PM", 
      available: 22,
      total: 30,
      location: examMode === "physical" ? "Science Building" : "Online Portal"
    },
    {
      id: "afternoon-2",
      label: "Afternoon Session B",
      time: "3:00 PM - 6:00 PM",
      available: 0,
      total: 30,
      location: examMode === "physical" ? "Library Hall" : "Online Portal"
    },
    {
      id: "evening-1",
      label: "Evening Session",
      time: "7:00 PM - 10:00 PM",
      available: examMode === "online" ? 25 : 0,
      total: 30,
      location: "Online Portal Only"
    }
  ];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
    onDateTimeSelect({ date, timeSlot: null, seatNumber: null });
  };

  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
    const slot = timeSlots.find(s => s.id === slotId);
    const seatNumber = examMode === "physical" ? `${Math.floor(Math.random() * 50) + 1}` : null;
    
    onDateTimeSelect({
      date: selectedDate,
      timeSlot: slotId,
      timeSlotDetails: slot,
      seatNumber
    });
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return "destructive";
    if (percentage < 20) return "destructive";
    if (percentage < 50) return "secondary";
    return "default";
  };

  const getAvailabilityText = (available: number, total: number) => {
    if (available === 0) return "Fully Booked";
    if (available <= 5) return "Limited Slots";
    return "Available";
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Pick Your Date & Time</h2>
        <p className="text-muted-foreground">
          Select your preferred exam date and time slot
          {examMode && ` for ${examMode} examination`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
            <CardDescription>Available exam dates are highlighted</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || !availableDates.some(d => 
                  d.toDateString() === date.toDateString()
                );
              }}
              className="rounded-md border pointer-events-auto"
            />
            
            {selectedDate && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="font-medium text-primary">
                  Selected Date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Slots Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Available Time Slots
            </CardTitle>
            <CardDescription>
              {selectedDate 
                ? `Time slots for ${format(selectedDate, "MMM d, yyyy")}`
                : "Please select a date first"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a date to view available time slots</p>
              </div>
            ) : (
              <div className="space-y-3">
                {timeSlots.map((slot) => (
                  <Card 
                    key={slot.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTimeSlot === slot.id ? "ring-2 ring-primary bg-primary/5" : ""
                    } ${slot.available === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => slot.available > 0 && handleTimeSlotSelect(slot.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{slot.label}</h4>
                            {selectedTimeSlot === slot.id && (
                              <Badge variant="default" className="text-xs">Selected</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{slot.time}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              {examMode === "physical" ? (
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Wifi className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-muted-foreground">{slot.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={getAvailabilityColor(slot.available, slot.total)}
                            className="mb-2"
                          >
                            {getAvailabilityText(slot.available, slot.total)}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{slot.available}/{slot.total}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      {selectedDate && selectedTimeSlot && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>Review your exam scheduling details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Exam Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{timeSlots.find(s => s.id === selectedTimeSlot)?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="capitalize">{examMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{timeSlots.find(s => s.id === selectedTimeSlot)?.location}</span>
                  </div>
                </div>
              </div>
              
              {examMode === "physical" && selectedDateTime?.seatNumber && (
                <div>
                  <h4 className="font-medium mb-2">Seat Assignment</h4>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800">
                      Seat #{selectedDateTime.seatNumber}
                    </p>
                    <p className="text-sm text-green-700">
                      Assigned automatically upon confirmation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notes */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Time slots are held for 10 minutes after selection</li>
          <li>• Arrive 15 minutes early for physical exams</li>
          <li>• Rescheduling requires approval and may incur fees</li>
          <li>• Online exams require system compatibility check</li>
        </ul>
      </div>
    </div>
  );
};

export default DateTimeSelection;