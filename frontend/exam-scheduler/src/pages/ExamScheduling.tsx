
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building, Calendar, Clock, MapPin, Users } from "lucide-react";
import ExamModeSelection from "@/components/exam/ExamModeSelection";
import ExamTypeSelection from "@/components/exam/ExamTypeSelection";
import CourseSelection from "@/components/exam/CourseSelection";
import ScheduledExamsView from "@/components/exam/ScheduledExamsView";

const ExamScheduling = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<"physical" | "online" | null>(null);
  const [selectedType, setSelectedType] = useState<"mid-semester" | "final" | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<any>(null);

  const steps = [
    { id: 1, title: "Exam Mode", completed: !!selectedMode },
    { id: 2, title: "Exam Type", completed: !!selectedType },
    { id: 3, title: "Course Selection", completed: !!selectedCourse },
    { id: 4, title: "Scheduled Exams", completed: false },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedMode;
      case 2: return !!selectedType;
      case 3: return true; // Always allow proceeding from course selection
      case 4: return false; // Final step - no next button
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Schedule Your Exam</h1>
            <p className="text-muted-foreground">Follow the steps to book your exam slot</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step.id === currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : step.completed 
                    ? "bg-green-500 text-white" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step.id}
                </div>
                <span className={`ml-2 text-sm ${
                  step.id === currentStep ? "font-medium" : "text-muted-foreground"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-border mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <ExamModeSelection 
              selectedMode={selectedMode}
              onModeSelect={setSelectedMode}
            />
          )}
          
          {currentStep === 2 && (
            <ExamTypeSelection 
              selectedType={selectedType}
              onTypeSelect={setSelectedType}
            />
          )}
          
          {currentStep === 3 && (
            <CourseSelection 
              selectedCourse={selectedCourse}
              onCourseSelect={setSelectedCourse}
            />
          )}
          
          {currentStep === 4 && (
            <ScheduledExamsView />
          )}
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            {currentStep === 1 ? "Back to Dashboard" : "Previous"}
          </Button>
          
          {currentStep < 4 && (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === 3 ? "View Scheduled Exams" : "Next"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamScheduling;
