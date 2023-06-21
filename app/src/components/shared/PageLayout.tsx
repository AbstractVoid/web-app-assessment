import React from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Container from "./Container";

const PageLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className="bg-white shadow-lg flex flex-col space-y-4 fixed p-10 h-full">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/add-student" className="hover:underline">
          Add New Students
        </Link>
        <Link href="/students" className="hover:underline">
          Students
        </Link>
        <Link href="/add-course" className="hover:underline">
          Add New Courses
        </Link>
        <Link href="/courses" className="hover:underline">
          Courses
        </Link>
        <Link href="/add-result" className="hover:underline">
          Add New Results
        </Link>
        <Link href="/results" className="hover:underline">
          Results
        </Link>
      </div>
      <Container>{children}</Container>
      <ToastContainer />
    </div>
  );
};

export default PageLayout;
