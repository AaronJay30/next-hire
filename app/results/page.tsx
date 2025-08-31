"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Brain,
    ArrowLeft,
    Download,
    CheckCircle,
    AlertCircle,
    Target,
    FileText,
    TrendingUp,
    Lightbulb,
    Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
    success: boolean;
    analysis: {
        overallScore: number;
        strengths: string[];
        improvements: string[];
        keywordOptimization: {
            score: number;
            suggestions: string[];
        };
        atsCompatibility: {
            score: number;
            issues: string[];
        };
        recommendations: string[];
    };
    resumeUrl?: string;
    resumeBase64?: string;
}

export default function ResultsPage() {
    const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // ✅ Load from localStorage instead of sessionStorage
        const storedData = localStorage.getItem("resumeAnalysis");
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                setAnalysisData(data);
            } catch (error) {
                console.error("Error parsing analysis data:", error);
                toast({
                    title: "Error loading results",
                    description:
                        "There was an error loading your analysis results.",
                    variant: "destructive",
                });
                router.push("/upload");
            }
        } else {
            toast({
                title: "No analysis found",
                description: "Please upload and analyze your resume first.",
                variant: "destructive",
            });
            router.push("/upload");
        }
        setLoading(false);
    }, [router, toast]);

    const getScoreBadgeVariant = (score: number) => {
        if (score >= 85) return "default";
        if (score >= 70) return "secondary";
        return "destructive";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                    <p className="text-muted-foreground">
                        Loading your analysis results...
                    </p>
                </div>
            </div>
        );
    }

    if (!analysisData) {
        return null;
    }

    const { analysis } = analysisData;

    return (
        <div className="min-h-screen bg-background">
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
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    localStorage.removeItem("resumeAnalysis");
                                    router.push("/upload");
                                }}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>New Analysis</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Results Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Resume Viewer */}
                    <div className="space-y-6">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <span>Your Resume</span>
                                </CardTitle>
                                <CardDescription>
                                    Original document for reference
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analysisData?.resumeBase64 ? (
                                    <embed
                                        src={analysisData.resumeBase64}
                                        type="application/pdf"
                                        width="100%"
                                        height="600px"
                                        className="rounded-lg border"
                                    />
                                ) : (
                                    <div className="bg-secondary/20 rounded-lg p-8 text-center border-2 border-dashed border-border">
                                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">
                                            No resume available
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div
                        ref={resultsRef}
                        className="space-y-6 bg-background p-6 rounded-lg"
                    >
                        {/* Overall Score */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        <span>Overall Score</span>
                                    </div>
                                    <Badge
                                        variant={getScoreBadgeVariant(
                                            analysis.overallScore
                                        )}
                                        className="text-lg px-3 py-1"
                                    >
                                        {analysis.overallScore}/100
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Progress
                                    value={analysis.overallScore}
                                    className="h-3 mb-2"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Your resume shows{" "}
                                    {analysis.overallScore >= 85
                                        ? "excellent"
                                        : analysis.overallScore >= 70
                                        ? "good"
                                        : "room for improvement"}{" "}
                                    alignment with industry standards.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Strengths */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span>Strengths</span>
                                </CardTitle>
                                <CardDescription>
                                    What your resume does well
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {analysis.strengths.map((s, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start space-x-3"
                                        >
                                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Improvements */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                    <span>Areas for Improvement</span>
                                </CardTitle>
                                <CardDescription>
                                    Suggestions to enhance your resume
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {analysis.improvements.map((im, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start space-x-3"
                                        >
                                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">
                                                {im}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Keyword Optimization */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Search className="h-5 w-5 text-primary" />
                                        <span>Keyword Optimization</span>
                                    </div>
                                    <Badge
                                        variant={getScoreBadgeVariant(
                                            analysis.keywordOptimization.score
                                        )}
                                    >
                                        {analysis.keywordOptimization.score}/100
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    How well your resume matches industry
                                    keywords
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress
                                    value={analysis.keywordOptimization.score}
                                    className="h-2 mb-4"
                                />
                                <ul className="space-y-2">
                                    {analysis.keywordOptimization.suggestions.map(
                                        (s, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start space-x-3"
                                            >
                                                <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">
                                                    {s}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* ATS Compatibility */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span>ATS Compatibility</span>
                                    </div>
                                    <Badge
                                        variant={getScoreBadgeVariant(
                                            analysis.atsCompatibility.score
                                        )}
                                    >
                                        {analysis.atsCompatibility.score}/100
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    How well your resume works with applicant
                                    tracking systems
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress
                                    value={analysis.atsCompatibility.score}
                                    className="h-2 mb-4"
                                />
                                <ul className="space-y-2">
                                    {analysis.atsCompatibility.issues.map(
                                        (issue, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start space-x-3"
                                            >
                                                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">
                                                    {issue}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Recommendations */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Lightbulb className="h-5 w-5 text-primary" />
                                    <span>Personalized Recommendations</span>
                                </CardTitle>
                                <CardDescription>
                                    Tailored advice for your career path
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {analysis.recommendations.map((r, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start space-x-3"
                                        >
                                            <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-12 text-center space-y-4">
                    <Separator />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => {
                                localStorage.removeItem("resumeAnalysis");
                                router.push("/upload");
                            }}
                            size="lg"
                        >
                            <Brain className="mr-2 h-4 w-4" />
                            Analyze Another Resume
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/")}
                            size="lg"
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
