"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Brain,
    Shield,
    Zap,
    CheckCircle,
    Upload,
    FileText,
    BarChart3,
} from "lucide-react";
import { PrivacyModal } from "@/components/privacy-modal";

export default function HomePage() {
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const handleGetStarted = () => {
        setShowPrivacyModal(true);
    };

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
                        <nav className="hidden md:flex items-center space-x-6">
                            <a
                                href="#features"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                How It Works
                            </a>
                            <a
                                href="#privacy"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Privacy
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <Badge variant="secondary" className="mb-4">
                        AI-Powered Resume Analysis
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                        Boost Your Resume with{" "}
                        <span className="text-primary">AI Insights</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                        Get personalized feedback, industry-specific
                        recommendations, and actionable insights to make your
                        resume stand out to employers.
                    </p>
                    <Button
                        size="lg"
                        className="text-lg px-8 py-6 mb-8"
                        onClick={handleGetStarted}
                    >
                        <Upload className="mr-2 h-5 w-5" />
                        Upload Resume for AI Analysis
                    </Button>
                    <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            No data stored
                        </div>
                        <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-primary" />
                            Instant analysis
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            Industry-specific
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 px-4 bg-muted/30">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our AI analyzes your resume in three simple steps to
                            provide comprehensive feedback
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Upload className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>1. Upload & Select</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Upload your PDF resume and select your
                                    course and target industry for personalized
                                    analysis
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Brain className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>2. AI Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Our AI acts as an HR manager in your field,
                                    analyzing strengths, weaknesses, and
                                    opportunities
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <BarChart3 className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>3. Get Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Receive detailed feedback with ratings,
                                    recommendations, and actionable advice to
                                    improve your resume
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Why Choose NextHire?
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Get professional-grade resume analysis with
                            industry-specific insights
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <FileText className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>
                                    Industry-Specific Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Tailored feedback based on your specific
                                    course and target industry requirements
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Shield className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Privacy First</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Your resume is analyzed instantly and never
                                    stored in our database
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Comprehensive Scoring</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Get detailed ratings and specific
                                    recommendations for improvement
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Privacy Assurance Section */}
            <section id="privacy" className="py-16 px-4 bg-muted/30">
                <div className="container mx-auto max-w-4xl text-center">
                    <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Your Privacy Matters
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        We take your privacy seriously. Your uploaded resume is
                        only used for AI analysis and is never stored in any
                        database or used for any other purpose.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-foreground">
                                    No Data Storage
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Your resume is processed and immediately
                                    discarded
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-foreground">
                                    Secure Processing
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    All analysis happens in a secure, encrypted
                                    environment
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-foreground">
                                    No Third Parties
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Your data is never shared with external
                                    parties
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Brain className="h-6 w-6 text-primary" />
                            <span className="font-semibold text-foreground">
                                NextHire
                            </span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <a
                                href="#privacy"
                                className="hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#terms"
                                className="hover:text-foreground transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#contact"
                                className="hover:text-foreground transition-colors"
                            >
                                Contact
                            </a>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border text-center text-sm text-muted-foreground">
                        © 2025 NextHire. Built with privacy and security in
                        mind.
                    </div>
                </div>
            </footer>

            <PrivacyModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
            />
        </div>
    );
}
