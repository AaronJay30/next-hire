# NextHire – AI-Powered Resume Analysis

**NextHire** is a modern web application built with Next.js that allows users to upload, analyze, and visually review their resumes using AI. The app provides a clean and accessible UI, interactive PDF preview, and exportable analysis results as images. It’s perfect for job seekers who want instant, actionable insights to improve their resumes.

Built with **TypeScript, React, Tailwind CSS**, and advanced PDF rendering libraries, NextHire is designed for speed, accessibility, and ease of use.

---

## Key Features

-   **Resume Upload**  
    Upload your resume in PDF format for instant AI analysis. The system validates files to ensure compatibility and proper rendering.

-   **AI-Powered Resume Analysis**  
    Get detailed insights including:

    -   Strengths and weaknesses of your resume
    -   Keyword optimization for specific job roles
    -   ATS (Applicant Tracking System) compatibility
    -   Personalized suggestions for improving layout, content, and impact

-   **Interactive PDF Preview**  
    View your uploaded resume directly in the browser using a robust PDF viewer powered by `@react-pdf-viewer/core`. You can scroll, zoom, and navigate pages seamlessly.

-   **Exportable Analysis Results**  
    Convert your resume analysis into high-quality images using `pdfjs-dist` and `html2canvas`. Perfect for sharing or keeping a visual record of improvements.

-   **Modern, Responsive UI**  
    Built with **Tailwind CSS** and custom reusable components for a clean, responsive, and accessible experience across all devices.

---

## Technology Stack

-   **Next.js** – App Router with TypeScript for robust, scalable architecture
-   **React** – Interactive UI components
-   **Tailwind CSS** – Utility-first CSS for fast styling
-   **@react-pdf-viewer/core** – PDF rendering and viewer
-   **pdfjs-dist** – Convert PDF to image for export
-   **html2canvas** – Capture analysis as images for export

---

## Getting Started

### Prerequisites

-   **Node.js** v18+ (recommended)
-   **Package Manager**: pnpm, npm, or yarn

### Installation Steps

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd resume-ai-analysis
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    # or
    npm install
    # or
    yarn install
    ```

3. **Run the development server**

    ```bash
    pnpm dev
    # or
    npm run dev
    # or
    yarn dev
    ```

4. **Open the app in your browser**  
   Visit: [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
resume-ai-analysis/
├── app/
│   ├── upload/         # Resume upload page
│   ├── results/        # Analysis results and PDF preview
│   ├── api/analyze/    # API route for analysis (stub/extend as needed)
│   ├── globals.css     # App-wide styles
│   ├── layout.tsx      # App layout
│   └── page.tsx        # Home page
├── components/
│   ├── ui/             # Reusable UI components (Button, Card, etc.)
│   ├── privacy-modal.tsx
│   └── theme-provider.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # Tailwind and global CSS
├── types/              # TypeScript type definitions
├── package.json
├── tsconfig.json
└── README.md           # Project documentation
```

## Customization

-   **Color Theme**: Colors are defined using CSS variables in `globals.css`. For html2canvas compatibility, all colors use hex codes.
-   **PDF Analysis**: The analysis logic is stubbed in the API route. Integrate your own AI or backend as needed.
-   **UI Components**: All UI is built with reusable components in `components/ui`.

## Accessibility

-   The app is designed with accessibility in mind, using semantic HTML and accessible UI components.

## Troubleshooting

-   **Export errors**: Ensure all CSS color variables use supported formats (no `oklch`, `lab`, etc.).
-   **PDF not rendering**: Check that the uploaded file is a valid PDF and that `pdfjs-dist` is installed.
-   **Build errors**: Make sure your Node.js version is compatible and all dependencies are installed.

## Future Improvements

-   Integration with **AI models for tailored job descriptions**
-   Support for additional file formats (DOCX, TXT)
-   Resume version history and comparison
-   Multi-language support
