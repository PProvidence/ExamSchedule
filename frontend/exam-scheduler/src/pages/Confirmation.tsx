import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Printer, Calendar, QrCode, Mail } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    navigate("/dashboard");
    return null;
  }

  const { mode, type, course, dateTime } = bookingData;

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Downloaded",
      description: "Your exam summary has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    toast({
      title: "Calendar Event",
      description: "Exam added to your calendar successfully.",
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Email Sent",
      description: "Exam details have been sent to your email.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Success! Your exam has been scheduled.
          </h1>
          <p className="text-lg text-muted-foreground">
            See you at your scheduled time. Don't forget to bring this summary to the exam hall.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Exam Details</CardTitle>
                <CardDescription>Your confirmed examination information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-2">Course Information</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold">{course.code}</span>
                        <p className="text-sm text-muted-foreground">{course.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{course.department}</Badge>
                        <Badge variant="outline">{course.credits} Credits</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-muted-foreground mb-2">Exam Schedule</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold">
                          {format(dateTime.date, "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {dateTime.timeSlotDetails?.time}
                        </p>
                      </div>
                      <div>
                        <Badge variant={mode === "physical" ? "default" : "secondary"}>
                          {mode === "physical" ? "Physical Exam" : "Online Exam"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-2">Location & Seat</h4>
                      <div className="space-y-1">
                        <p className="font-medium">{dateTime.timeSlotDetails?.location}</p>
                        {mode === "physical" && dateTime.seatNumber && (
                          <p className="text-sm text-muted-foreground">
                            Seat Number: <span className="font-medium">#{dateTime.seatNumber}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-muted-foreground mb-2">Exam Type</h4>
                      <Badge variant="outline" className="capitalize">
                        {type?.replace("-", " ")} Examination
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-muted-foreground mb-2">Special Instructions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {mode === "physical" ? (
                      <>
                        <li>• Bring valid student ID and this exam summary</li>
                        <li>• Arrive 15 minutes before the scheduled time</li>
                        <li>• Calculator and permitted materials only</li>
                        <li>• Mobile phones must be switched off</li>
                      </>
                    ) : (
                      <>
                        <li>• Ensure stable internet connection</li>
                        <li>• Test your camera and microphone beforehand</li>
                        <li>• Close all other applications and browser tabs</li>
                        <li>• Have your student ID ready for verification</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              
              <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print Summary
              </Button>
              
              <Button variant="outline" onClick={handleAddToCalendar} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Add to Calendar
              </Button>
              
              <Button variant="outline" onClick={handleSendEmail} className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Summary
              </Button>
            </div>
          </div>

          {/* QR Code and Quick Info */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exam QR Code</CardTitle>
                <CardDescription>For quick check-in at the exam hall</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                  <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                  <p className="text-xs text-gray-500 mt-2">
                    QR Code will be generated with your booking details
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Present this QR code to the exam invigilator for quick verification
                </p>
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Booking ID:</p>
                  <p className="text-muted-foreground font-mono">EX-{Date.now().toString().slice(-8)}</p>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium">Exam Officer:</p>
                  <p className="text-muted-foreground">Dr. Sarah Johnson</p>
                </div>
                
                <div className="text-sm">
                  <p className="font-medium">Duration:</p>
                  <p className="text-muted-foreground">
                    {mode === "online" ? "20 minutes" : "2-3 hours"}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="font-medium">Reschedule Deadline:</p>
                  <p className="text-muted-foreground">
                    {format(new Date(dateTime.date.getTime() - 24 * 60 * 60 * 1000), "MMM d, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>📧 support@university.edu</p>
                  <p>📞 +234-xxx-xxx-xxxx</p>
                  <p>🕒 Mon-Fri: 8AM-5PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-between">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
          
          <Button onClick={() => navigate("/schedule")}>
            Schedule Another Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
