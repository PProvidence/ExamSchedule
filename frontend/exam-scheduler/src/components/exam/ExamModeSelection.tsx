
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Building, Clock, Users, Shield, Wifi } from "lucide-react";

interface ExamModeSelectionProps {
  selectedMode: "physical" | "online" | null;
  onModeSelect: (mode: "physical" | "online") => void;
}

const ExamModeSelection = ({ selectedMode, onModeSelect }: ExamModeSelectionProps) => {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Your Exam Experience</h2>
        <p className="text-muted-foreground">Select the format that works best for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Physical Exam */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedMode === "physical" ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onModeSelect("physical")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <Building className="h-8 w-8 text-primary" />
              {selectedMode === "physical" && <Badge variant="default">Selected</Badge>}
            </div>
            <CardTitle className="text-xl">🏫 In-Person Examination</CardTitle>
            <CardDescription>Traditional exam hall experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Supervised environment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Paper-based examination</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>Standard duration (2-3 hours)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-purple-600" />
                <span>Designated exam hall</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Requirements:</strong> Bring valid ID, exam summary, and permitted materials. 
                Arrive 15 minutes before scheduled time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Online Exam */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedMode === "online" ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onModeSelect("online")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <Monitor className="h-8 w-8 text-primary" />
              {selectedMode === "online" && <Badge variant="default">Selected</Badge>}
            </div>
            <CardTitle className="text-xl">💻 Digital Examination</CardTitle>
            <CardDescription>Take your exam from anywhere</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-green-600" />
                <span>20-minute duration</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Monitor className="h-4 w-4 text-blue-600" />
                <span>60 multiple-choice questions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-orange-600" />
                <span>Browser lockdown security</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wifi className="h-4 w-4 text-purple-600" />
                <span>Live monitoring & proctoring</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Requirements:</strong> Stable internet connection, webcam, and microphone. 
                System compatibility check required before exam.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Section */}
      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-4">Quick Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Duration:</strong>
            <p>Physical: 2-3 hours</p>
            <p>Online: 20 minutes</p>
          </div>
          <div>
            <strong>Question Format:</strong>
            <p>Physical: Mixed format</p>
            <p>Online: MCQ only</p>
          </div>
          <div>
            <strong>Flexibility:</strong>
            <p>Physical: Fixed location</p>
            <p>Online: Any location</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamModeSelection;