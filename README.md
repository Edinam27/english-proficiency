# UPSA English Proficiency Letter Generator

This is a Next.js application designed to automate the creation of English proficiency letters for the UPSA School of Graduate Studies (Masters Programmes).

## Features
- **Student Data Form**: Captures Name, Index Number, Programme, Completion Date, etc.
- **Database Persistence**: Stores student records in a Neon (PostgreSQL) database using Prisma.
- **PDF Generation**: Generates a downloadable PDF letter formatted exactly according to UPSA standards (Times New Roman, 13pt, official letterhead spacing).

## Prerequisites
- Node.js (v18 or higher recommended)
- A Neon (PostgreSQL) database account

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Database**
    - Create a project in [Neon](https://neon.tech/).
    - Copy your connection string.
    - Open the `.env` file in the root directory.
    - Replace the placeholder `DATABASE_URL` with your actual Neon connection string.

    ```env
    DATABASE_URL="postgresql://user:password@your-neon-host/neondb?sslmode=require"
    ```

3.  **Push Schema to Database**
    Run the following command to create the tables in your Neon database:
    ```bash
    npx prisma db push
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Access the Application**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
1.  Fill out the student details form.
2.  Click "Generate Letter".
3.  You will be redirected to a preview page where you can view and download the PDF.

## Project Structure
- `app/page.tsx`: Main entry point with the student form.
- `app/api/students`: API routes for saving student data.
- `components/LetterPDF.tsx`: The PDF template definition.
- `prisma/schema.prisma`: Database schema definition.
