
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, GraduationCap } from "lucide-react";

interface ExamTypeSelectionProps {
  selectedType: "mid-semester" | "final" | null;
  onTypeSelect: (type: "mid-semester" | "final") => void;
}

const ExamTypeSelection = ({ selectedType, onTypeSelect }: ExamTypeSelectionProps) => {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Pick the exam window you wish to schedule</h2>
        <p className="text-muted-foreground">Different exam types may have different availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Mid-Semester */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedType === "mid-semester" ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onTypeSelect("mid-semester")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <BookOpen className="h-8 w-8 text-primary" />
              {selectedType === "mid-semester" && <Badge variant="default">Selected</Badge>}
            </div>
            <CardTitle className="text-xl">Mid-Semester Examination</CardTitle>
            <CardDescription>Continuous assessment exam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Available: March 10-20, 2024</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Exam Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Covers topics from weeks 1-7</li>
                  <li>• 30% of total course grade</li>
                  <li>• Multiple scheduling slots available</li>
                  <li>• Both online and physical options</li>
                </ul>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-medium text-green-800">
                  ✓ High Availability
                </p>
                <p className="text-xs text-green-700">
                  Multiple time slots available throughout the exam period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Exam */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedType === "final" ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onTypeSelect("final")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <GraduationCap className="h-8 w-8 text-primary" />
              {selectedType === "final" && <Badge variant="default">Selected</Badge>}
            </div>
            <CardTitle className="text-xl">Final Examination</CardTitle>
            <CardDescription>Comprehensive semester exam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Available: May 15-25, 2024</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Exam Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Comprehensive course coverage</li>
                  <li>• 70% of total course grade</li>
                  <li>• Limited scheduling flexibility</li>
                  <li>• Preference for physical exams</li>
                </ul>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs font-medium text-orange-800">
                  ⚠ Limited Availability
                </p>
                <p className="text-xs text-orange-700">
                  Book early as slots fill up quickly during final exam period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📋 Exam Policies</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Reschedule fee: ₦25,000 if approved</li>
            <li>• Minimum 24-hour notice for changes</li>
            <li>• Valid documentation required for medical deferrals</li>
          </ul>
        </div>
        
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">🎯 Preparation Tips</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Review course syllabus and learning objectives</li>
            <li>• Check permitted materials list</li>
            <li>• Arrive 15 minutes early for physical exams</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExamTypeSelection;