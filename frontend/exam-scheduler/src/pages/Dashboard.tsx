
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  RotateCcw, 
  BarChart3, 
  Clock, 
  BookOpen, 
  Bell,
  GraduationCap,
  LogOut
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const studentName = "John Doe";

  const upcomingExams = [
    { course: "COSC201", title: "Data Structures", date: "March 14, 2024", time: "10:00 AM" },
    { course: "MATH301", title: "Linear Algebra", date: "March 16, 2024", time: "2:00 PM" },
  ];

  const stats = {
    totalExams: 8,
    completed: 3,
    pending: 2,
    available: 12
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Scholar</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Let's schedule your success, {studentName}
          </h2>
          <p className="text-muted-foreground">
            Current Semester: Spring 2024 • 2 pending exams
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Schedule Exam */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/schedule")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Schedule Exam
                  </CardTitle>
                  <CardDescription>Book your next exam slot</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{stats.available} slots available</Badge>
                </CardContent>
              </Card>

              {/* View Exam Summary */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/summary")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    View Exam Summary
                  </CardTitle>
                  <CardDescription>Download your exam details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{stats.pending} summaries ready</Badge>
                </CardContent>
              </Card>

              {/* Reschedule Exam */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/reschedule")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-primary" />
                    Reschedule Exam
                  </CardTitle>
                  <CardDescription>Modify existing bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">Available if needed</Badge>
                </CardContent>
              </Card>

              {/* View Results */}
              <Card className="opacity-60 cursor-not-allowed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    View Results
                  </CardTitle>
                  <CardDescription>Check your grades</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">Coming Soon</Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Exams</span>
                  <span className="font-semibold">{stats.totalExams}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-semibold text-green-600">{stats.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-semibold text-orange-600">{stats.pending}</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Exams */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Upcoming Exams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingExams.map((exam, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">{exam.course}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{exam.title}</p>
                    <p className="text-xs text-muted-foreground">{exam.date} at {exam.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Important Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    Exam Schedule Update
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Mid-semester exams now available for scheduling
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;