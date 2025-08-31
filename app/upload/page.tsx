"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Brain, Upload, FileText, ArrowLeft, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const courseData = {
    Accountancy: {
        industries: [
            "Financial Accounting",
            "Auditing & Assurance",
            "Taxation",
            "Forensic Accounting",
            "Corporate Finance",
            "Cost & Management Accounting",
            "Accounting Information Systems",
            "Government & Nonprofit Accounting",
            "Investment & Wealth Management",
            "Business Valuation & Risk Analysis",
        ],
    },
    "Business Administration": {
        industries: [
            "Finance & Banking",
            "Accounting & Auditing",
            "Marketing & Advertising",
            "Human Resources",
            "Supply Chain & Logistics",
            "Entrepreneurship & Startups",
            "Business Consulting",
            "Real Estate & Property Management",
            "E-commerce & Digital Business",
            "Project Management",
            "Retail & Consumer Goods",
            "Corporate Strategy",
            "Hospitality & Tourism Management",
        ],
    },
    Education: {
        industries: [
            "Primary & Secondary Teaching",
            "Higher Education & Academia",
            "Curriculum Development",
            "Special Education",
            "Educational Technology (EdTech)",
            "School Administration & Leadership",
            "Early Childhood Education",
            "Adult & Continuing Education",
            "Training & Development",
        ],
    },
    Engineering: {
        industries: [
            "Civil Engineering",
            "Mechanical Engineering",
            "Electrical & Electronics Engineering",
            "Computer Engineering",
            "Chemical Engineering",
            "Industrial Engineering",
            "Aerospace Engineering",
            "Environmental Engineering",
            "Biomedical Engineering",
            "Automotive Engineering",
            "Robotics & Automation",
            "Structural Engineering",
            "Marine & Naval Engineering",
            "Renewable Energy & Sustainability",
        ],
    },
    "Hospitality & Tourism": {
        industries: [
            "Hotel & Resort Management",
            "Travel & Tour Operations",
            "Event Planning & Management",
            "Food & Beverage Management",
            "Cruise Line & Airline Services",
            "Sustainable Tourism",
            "Recreational Services",
        ],
    },
    "Information Technology": {
        industries: [
            "Web Development",
            "Mobile App Development",
            "Software Engineering",
            "Cybersecurity",
            "Cloud Computing",
            "Data Science & Analytics",
            "Artificial Intelligence & Machine Learning",
            "UI/UX Design",
            "Game Development",
            "DevOps & Infrastructure",
            "IT Project Management",
            "Networking & Systems Administration",
            "Database Administration",
            "Blockchain Development",
            "IT Support & Technical Helpdesk",
            "E-commerce & Digital Platforms",
            "Business Intelligence & ERP Systems",
            "AR/VR Development",
            "IoT (Internet of Things)",
        ],
    },
    Law: {
        industries: [
            "Corporate Law",
            "Criminal Law",
            "Civil Litigation",
            "International Law",
            "Intellectual Property Law",
            "Environmental Law",
            "Labor & Employment Law",
            "Tax Law",
            "Family Law",
            "Legal Research & Academia",
        ],
    },
    "Mass Communication & Media": {
        industries: [
            "Journalism",
            "Public Relations",
            "Advertising",
            "Broadcast Media (TV/Radio)",
            "Digital Media & Content Creation",
            "Film & Video Production",
            "Corporate Communications",
            "Social Media Management",
        ],
    },
    "Medical Technology": {
        industries: [
            "Clinical Laboratory Science",
            "Hematology",
            "Microbiology",
            "Pathology & Histotechnology",
            "Clinical Chemistry",
            "Immunology & Serology",
            "Blood Banking & Transfusion Medicine",
            "Biomedical Research",
            "Pharmaceutical & Diagnostic Companies",
        ],
    },
    Nursing: {
        industries: [
            "Clinical Nursing (Hospitals & Clinics)",
            "Pediatrics",
            "Geriatric Nursing",
            "Emergency & Critical Care",
            "Community & Public Health",
            "Mental Health Nursing",
            "Oncology Nursing",
            "Operating Room (Surgical Nursing)",
            "Obstetrics & Gynecology Nursing",
            "School & Academic Nursing",
            "Nursing Education & Research",
            "Telehealth & Remote Nursing",
            "Nursing Administration & Leadership",
        ],
    },
    Psychology: {
        industries: [
            "Clinical Psychology",
            "Counseling & Therapy",
            "Industrial-Organizational Psychology",
            "Educational & School Psychology",
            "Forensic Psychology",
            "Sports Psychology",
            "Neuropsychology",
            "Research & Academia",
        ],
    },
};

export default function UploadPage() {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const router = useRouter();

    const availableIndustries = useMemo(() => {
        if (
            !selectedCourse ||
            !courseData[selectedCourse as keyof typeof courseData]
        ) {
            return [];
        }
        return courseData[selectedCourse as keyof typeof courseData].industries;
    }, [selectedCourse]);

    const handleCourseChange = (course: string) => {
        setSelectedCourse(course);
        setSelectedIndustry(""); // Reset industry selection
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast({
                    title: "Invalid file type",
                    description: "Please upload a PDF file only.",
                    variant: "destructive",
                });
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                // 10MB limit
                toast({
                    title: "File too large",
                    description: "Please upload a file smaller than 10MB.",
                    variant: "destructive",
                });
                return;
            }
            setSelectedFile(file);
        }
    };

    // Convert File -> Base64 string
    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // encodes as data:application/pdf;base64,....
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (err) => reject(err);
        });

    const handleSubmit = async (e: React.FormEvent) => {
        // Remove previous analysis data before new analysis
        localStorage.removeItem("resumeAnalysis");
        e.preventDefault();

        // Daily limit logic
        const today = new Date().toISOString().split("T")[0];
        const limitKey = "resumeAnalysisLimit";
        let limitData = { date: today, count: 0 };
        try {
            const stored = localStorage.getItem(limitKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.date === today) {
                    limitData = parsed;
                }
            }
        } catch {}
        if (limitData.count >= 3) {
            await Swal.fire({
                icon: "error",
                title: "Daily Limit Reached",
                text: "You have reached your analyses for today. Please try again tomorrow.",
                confirmButtonColor: "#6fcf97",
            });
            return;
        }

        if (!selectedCourse || !selectedIndustry || !selectedFile) {
            await Swal.fire({
                icon: "warning",
                title: "Missing information",
                text: "Please fill in all fields and upload your resume.",
                confirmButtonColor: "#6fcf97",
            });
            return;
        }

        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append("resume", selectedFile);
            formData.append("course", selectedCourse);
            formData.append("industry", selectedIndustry);

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json().catch(() => null);
                throw new Error(err?.error || "Analysis failed");
            }

            const { success, analysis } = await response.json();
            if (!success) throw new Error("Analysis failed");

            // 🔥 Convert file to Base64 for viewing later
            const resumeBase64 = await fileToBase64(selectedFile);

            // Save everything to localStorage
            localStorage.setItem(
                "resumeAnalysis",
                JSON.stringify({
                    success,
                    analysis,
                    resumeBase64,
                })
            );

            // Increment daily limit count
            localStorage.setItem(
                limitKey,
                JSON.stringify({ date: today, count: limitData.count + 1 })
            );

            router.push("/results");
        } catch (err: any) {
            await Swal.fire({
                icon: "error",
                title: "Analysis failed",
                text: err?.message || "Error analyzing resume",
                confirmButtonColor: "#6fcf97",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background animate-fade-in">
            {/* Header */}
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Brain className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold text-foreground">
                                NextHire
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/")}
                            className="flex items-center space-x-2 hover:bg-secondary/80 transition-colors duration-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Home</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Upload Form */}
            <section className="py-12 px-4">
                <div className="container mx-auto max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-4">
                            Upload Your Resume
                        </h1>
                        <p className="text-muted-foreground">
                            Provide your course, target industry, and resume for
                            personalized AI analysis
                        </p>
                    </div>

                    <Card className="shadow-lg border-border/50 transition-shadow duration-300 hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <span>Resume Analysis Form</span>
                            </CardTitle>
                            <CardDescription>
                                Fill in the details below to get tailored
                                feedback for your field
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Course Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="course">
                                        Course/Field of Study
                                    </Label>
                                    <Select
                                        value={selectedCourse}
                                        onValueChange={handleCourseChange}
                                    >
                                        <SelectTrigger className="transition-all duration-200 hover:border-primary/50 focus:border-primary">
                                            <SelectValue placeholder="Select your course or field of study" />
                                        </SelectTrigger>
                                        <SelectContent className="animate-dropdown-in">
                                            {Object.keys(courseData).map(
                                                (course) => (
                                                    <SelectItem
                                                        key={course}
                                                        value={course}
                                                        className="transition-colors duration-150 hover:bg-secondary/80"
                                                    >
                                                        {course}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Industry Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="industry">
                                        Target Industry
                                    </Label>
                                    <Select
                                        value={selectedIndustry}
                                        onValueChange={setSelectedIndustry}
                                        disabled={!selectedCourse}
                                    >
                                        <SelectTrigger className="transition-all duration-200 hover:border-primary/50 focus:border-primary disabled:opacity-50">
                                            <SelectValue
                                                placeholder={
                                                    selectedCourse
                                                        ? "Select your target industry"
                                                        : "Please select a course first"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="animate-dropdown-in">
                                            {availableIndustries.map(
                                                (industry) => (
                                                    <SelectItem
                                                        key={industry}
                                                        value={industry}
                                                        className="transition-colors duration-150 hover:bg-secondary/80"
                                                    >
                                                        {industry}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="resume">
                                        Resume Upload
                                    </Label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-all duration-300 hover:bg-secondary/20">
                                        <Input
                                            id="resume"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <Label
                                            htmlFor="resume"
                                            className="cursor-pointer flex flex-col items-center space-y-2"
                                        >
                                            <Upload className="h-8 w-8 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                                            <div>
                                                <span className="text-sm font-medium text-foreground">
                                                    {selectedFile
                                                        ? selectedFile.name
                                                        : "Click to upload your resume"}
                                                </span>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    PDF files only, max 10MB
                                                </p>
                                            </div>
                                        </Label>
                                    </div>
                                    {selectedFile && (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-fade-in">
                                            <FileText className="h-4 w-4" />
                                            <span>
                                                {selectedFile.name} (
                                                {(
                                                    selectedFile.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB)
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    size="lg"
                                    disabled={
                                        !selectedCourse ||
                                        !selectedIndustry ||
                                        !selectedFile ||
                                        isAnalyzing
                                    }
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing Resume...
                                        </>
                                    ) : (
                                        <>
                                            <Brain className="mr-2 h-4 w-4" />
                                            Analyze My Resume
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Privacy Reminder */}
                    <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border/50 animate-fade-in">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    <strong className="text-foreground">
                                        Privacy Reminder:
                                    </strong>{" "}
                                    Your resume will be analyzed instantly and
                                    securely. We do not store your resume or
                                    personal information in our database.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
