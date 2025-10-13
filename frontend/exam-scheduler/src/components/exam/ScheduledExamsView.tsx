import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Monitor, Building, Download, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduledExam {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  timeSlot: string;
  mode: "physical" | "online";
  location?: string;
  status: "scheduled" | "completed" | "missed";
  seatNumber?: string;
}

const ScheduledExamsView = () => {
  const { toast } = useToast();

  // Mock scheduled exams data
  const scheduledExams: ScheduledExam[] = [
    {
      id: "1",
      courseCode: "COSC201",
      courseTitle: "Data Structures and Algorithms",
      date: "March 15, 2024",
      timeSlot: "8:00 AM - 10:00 AM",
      mode: "physical",
      location: "Main Hall 3",
      status: "scheduled",
      seatNumber: "A-21"
    },
    {
      id: "2",
      courseCode: "MATH301",
      courseTitle: "Linear Algebra",
      date: "March 18, 2024",
      timeSlot: "2:00 PM - 4:00 PM",
      mode: "online",
      status: "scheduled"
    },
    {
      id: "3",
      courseCode: "PHYS201",
      courseTitle: "Quantum Mechanics",
      date: "March 12, 2024",
      timeSlot: "10:30 AM - 12:30 PM",
      mode: "physical",
      location: "Science Block Hall 1",
      status: "completed",
      seatNumber: "B-15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "missed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (mode: string) => {
    return mode === "physical" ? Building : Monitor;
  };

  const handleDownloadSummary = (exam: ScheduledExam) => {
    toast({
      title: "Download Started",
      description: `Downloading exam summary for ${exam.courseCode}`,
    });
  };

  const handleEmailSummary = (exam: ScheduledExam) => {
    toast({
      title: "Email Sent",
      description: `Exam summary for ${exam.courseCode} sent to your email`,
    });
  };

  const upcomingExams = scheduledExams.filter(exam => exam.status === "scheduled");
  const pastExams = scheduledExams.filter(exam => exam.status !== "scheduled");

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Scheduled Exams</h2>
        <p className="text-muted-foreground">Manage and view all your exam schedules</p>
      </div>

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Exams ({upcomingExams.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {upcomingExams.map((exam) => {
              const StatusIcon = getStatusIcon(exam.mode);
              return (
                <Card key={exam.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <StatusIcon className="h-5 w-5 text-primary" />
                          {exam.courseCode}
                        </CardTitle>
                        <CardDescription className="text-base font-medium mt-1">
                          {exam.courseTitle}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{exam.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{exam.timeSlot}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {exam.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{exam.location}</span>
                          </div>
                        )}
                        {exam.seatNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Seat:</span>
                            <Badge variant="outline">{exam.seatNumber}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadSummary(exam)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download Summary
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEmailSummary(exam)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email Summary
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Exams */}
      {pastExams.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Past Exams ({pastExams.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {pastExams.map((exam) => {
              const StatusIcon = getStatusIcon(exam.mode);
              return (
                <Card key={exam.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-muted-foreground">
                          <StatusIcon className="h-5 w-5" />
                          {exam.courseCode}
                        </CardTitle>
                        <CardDescription className="text-base font-medium mt-1">
                          {exam.courseTitle}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{exam.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{exam.timeSlot}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {exam.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{exam.location}</span>
                          </div>
                        )}
                        {exam.seatNumber && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">Seat:</span>
                            <Badge variant="outline">{exam.seatNumber}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {scheduledExams.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Exams Scheduled</h3>
          <p className="text-muted-foreground mb-4">
            You haven't scheduled any exams yet. Go back to course selection to schedule your first exam.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduledExamsView;