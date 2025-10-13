import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Monitor, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { MapPin } from "lucide-react";

interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  credits: number;
  level: number;
  difficulty: "Easy" | "Medium" | "Hard";
  enrolled: boolean;
  prerequisites?: string[];
}

interface CourseScheduleModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

const CourseScheduleModal = ({ course, isOpen, onClose }: CourseScheduleModalProps) => {
  const [selectedMode, setSelectedMode] = useState<"physical" | "online" | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  // Fixed date for this example - March 15, 2024
  const examDate = "March 15, 2024";

  const timeSlots = [
    { id: "morning", time: "8:00 AM - 10:00 AM", available: 25, total: 30 },
    { id: "midmorning", time: "10:30 AM - 12:30 PM", available: 18, total: 30 },
    { id: "afternoon", time: "2:00 PM - 4:00 PM", available: 12, total: 30 },
    { id: "evening", time: "4:30 PM - 6:30 PM", available: 5, total: 30 },
  ];

  const handleSchedule = () => {
    if (!selectedMode || !selectedTime) {
      toast({
        title: "Incomplete Selection",
        description: "Please select both exam mode and time slot.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Exam Scheduled Successfully!",
      description: `${course?.code} scheduled for ${examDate} at ${timeSlots.find(slot => slot.id === selectedTime)?.time} (${selectedMode} mode)`,
    });
    
    // Reset and close
    setSelectedMode(null);
    setSelectedTime(null);
    onClose();
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-yellow-600";
    return "text-red-600";
  };

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Exam: {course.code}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription>
                {course.department} • {course.credits} Credits • Level {course.level}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Fixed Date */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">Exam Date (Fixed)</span>
            </div>
            <p className="text-lg font-semibold text-primary">{examDate}</p>
            <p className="text-sm text-muted-foreground">This date is set by the academic calendar</p>
          </div>

          {/* Exam Mode Selection */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Select Exam Mode
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMode === "physical" ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedMode("physical")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Physical Exam</p>
                      <p className="text-sm text-muted-foreground">In examination hall</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMode === "online" ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedMode("online")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Online Exam</p>
                      <p className="text-sm text-muted-foreground">Digital portal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Select Time Slot
            </h3>
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <Card 
                  key={slot.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTime === slot.id ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedTime(slot.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getAvailabilityColor(slot.available, slot.total)}`}>
                          {slot.available}/{slot.total} available
                        </span>
                        <Badge variant={slot.available > 10 ? "default" : slot.available > 0 ? "secondary" : "destructive"}>
                          {slot.available > 10 ? "Available" : slot.available > 0 ? "Limited" : "Full"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSchedule} 
              disabled={!selectedMode || !selectedTime}
              className="flex-1"
            >
              Schedule Exam
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseScheduleModal;