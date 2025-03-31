
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";

const EducationForm = () => {
  const { resumeData, updateEducation } = useResume();
  const [education, setEducation] = useState(resumeData.education);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [name]: value,
    };
    setEducation(updatedEducation);
    updateEducation(updatedEducation);
  };

  const addEducation = () => {
    const newEducation = {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    setEducation([...education, newEducation]);
    updateEducation([...education, newEducation]);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      const updatedEducation = education.filter((_, i) => i !== index);
      setEducation(updatedEducation);
      updateEducation(updatedEducation);
    }
  };

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <Card key={index} className="relative">
          {education.length > 1 && (
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
            >
              <Trash size={16} />
            </button>
          )}
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`school-${index}`}>School / University</Label>
                <Input
                  id={`school-${index}`}
                  name="school"
                  placeholder="University of California"
                  value={edu.school}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Degree</Label>
                <Input
                  id={`degree-${index}`}
                  name="degree"
                  placeholder="Bachelor's, Master's, etc."
                  value={edu.degree}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`field-${index}`}>Field of Study</Label>
                <Input
                  id={`field-${index}`}
                  name="field"
                  placeholder="Computer Science"
                  value={edu.field}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    name="startDate"
                    placeholder="MM/YYYY"
                    value={edu.startDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`}>End Date</Label>
                  <Input
                    id={`endDate-${index}`}
                    name="endDate"
                    placeholder="MM/YYYY or Present"
                    value={edu.endDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add Another Education
      </Button>
    </div>
  );
};

export default EducationForm;
