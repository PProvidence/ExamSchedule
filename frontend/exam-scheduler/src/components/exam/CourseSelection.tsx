
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Users, Calendar } from "lucide-react";
// import { Clock } from "lucide-react";
import CourseScheduleModal from "./CourseScheduleModal";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface CourseSelectionProps {
  selectedCourse: Course | null;
  onCourseSelect: (course: Course) => void;
}

const CourseSelection = ({ selectedCourse, onCourseSelect }: CourseSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [modalCourse, setModalCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock courses data
  const courses: Course[] = [
    {
      id: "1",
      code: "COSC201",
      title: "Data Structures and Algorithms",
      department: "Computer Science",
      credits: 3,
      level: 200,
      difficulty: "Medium",
      enrolled: true,
      prerequisites: ["COSC101", "MATH101"]
    },
    {
      id: "2",
      code: "MATH301",
      title: "Linear Algebra",
      department: "Mathematics",
      credits: 3,
      level: 300,
      difficulty: "Hard",
      enrolled: true,
      prerequisites: ["MATH201"]
    },
    {
      id: "3",
      code: "PHYS201",
      title: "Quantum Mechanics",
      department: "Physics",
      credits: 4,
      level: 200,
      difficulty: "Hard",
      enrolled: true,
      prerequisites: ["PHYS101"]
    },
    {
      id: "4",
      code: "ENGL102",
      title: "Academic Writing",
      department: "English",
      credits: 2,
      level: 100,
      difficulty: "Easy",
      enrolled: true
    },
    {
      id: "5",
      code: "COSC301",
      title: "Database Management Systems",
      department: "Computer Science",
      credits: 3,
      level: 300,
      difficulty: "Medium",
      enrolled: true,
      prerequisites: ["COSC201"]
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || course.department === departmentFilter;
    const matchesLevel = levelFilter === "all" || course.level.toString() === levelFilter;
    
    return matchesSearch && matchesDepartment && matchesLevel && course.enrolled;
  });

  const departments = [...new Set(courses.map(course => course.department))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleScheduleClick = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Your Course</h2>
        <p className="text-muted-foreground">Choose from your enrolled courses for this semester</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by code or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-4">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="100">100 Level</SelectItem>
              <SelectItem value="200">200 Level</SelectItem>
              <SelectItem value="300">300 Level</SelectItem>
              <SelectItem value="400">400 Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course) => (
          <Card 
            key={course.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCourse?.id === course.id ? "ring-2 ring-primary bg-primary/5" : ""
            }`}
            onClick={() => onCourseSelect(course)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {course.code}
                  </CardTitle>
                  <CardDescription className="text-base font-medium mt-1">
                    {course.title}
                  </CardDescription>
                </div>
                {selectedCourse?.id === course.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{course.department}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Credits:</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{course.credits} Units</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Level:</span>
                  <Badge variant="outline">{course.level} Level</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>

                {course.prerequisites && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Prerequisites:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t mt-3">
                  <Button 
                    onClick={(e) => handleScheduleClick(course, e)}
                    className="w-full"
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Exam
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Recently Viewed */}
      {searchTerm === "" && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Recently Viewed Courses</h3>
          <div className="flex gap-2">
            {courses.slice(0, 3).map((course) => (
              <Button
                key={course.id}
                variant="outline"
                size="sm"
                onClick={() => onCourseSelect(course)}
                className="text-xs"
              >
                {course.code}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <CourseScheduleModal 
        course={modalCourse}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalCourse(null);
        }}
      />
    </div>
  );
};

export default CourseSelection;
