
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResume } from "@/contexts/ResumeContext";

const AdditionalForm = () => {
  const { resumeData, updateCertifications, updateHobbies } = useResume();
  const [certifications, setCertifications] = useState(resumeData.certifications.filter(Boolean).length ? resumeData.certifications : ['']);
  const [hobbies, setHobbies] = useState(resumeData.hobbies.filter(Boolean).length ? resumeData.hobbies : ['']);
  const [newCertification, setNewCertification] = useState('');
  const [newHobby, setNewHobby] = useState('');

  const addCertification = () => {
    if (newCertification.trim()) {
      const updatedCerts = [...certifications, newCertification.trim()];
      setCertifications(updatedCerts);
      updateCertifications(updatedCerts);
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    const updatedCerts = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCerts.length ? updatedCerts : ['']);
    updateCertifications(updatedCerts.length ? updatedCerts : ['']);
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      const updatedHobbies = [...hobbies, newHobby.trim()];
      setHobbies(updatedHobbies);
      updateHobbies(updatedHobbies);
      setNewHobby('');
    }
  };

  const removeHobby = (index: number) => {
    const updatedHobbies = hobbies.filter((_, i) => i !== index);
    setHobbies(updatedHobbies.length ? updatedHobbies : ['']);
    updateHobbies(updatedHobbies.length ? updatedHobbies : ['']);
  };

  const handleCertificationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCertification();
    }
  };

  const handleHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHobby();
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="certifications" className="text-lg">Certifications</Label>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {certifications.filter(Boolean).map((cert, index) => (
            <div 
              key={index} 
              className="bg-resume-muted px-3 py-1 rounded-full flex items-center text-sm"
            >
              <span>{cert}</span>
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            id="newCertification"
            placeholder="Add a certification (e.g. AWS Certified Solutions Architect)"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyDown={handleCertificationKeyDown}
          />
          <Button
            type="button"
            onClick={addCertification}
            disabled={!newCertification.trim()}
          >
            Add
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="hobbies" className="text-lg">Hobbies & Interests</Label>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {hobbies.filter(Boolean).map((hobby, index) => (
            <div 
              key={index} 
              className="bg-resume-muted px-3 py-1 rounded-full flex items-center text-sm"
            >
              <span>{hobby}</span>
              <button
                type="button"
                onClick={() => removeHobby(index)}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            id="newHobby"
            placeholder="Add a hobby (e.g. Photography)"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyDown={handleHobbyKeyDown}
          />
          <Button
            type="button"
            onClick={addHobby}
            disabled={!newHobby.trim()}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalForm;
