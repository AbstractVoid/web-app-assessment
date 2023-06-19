from typing import List
from typing_extensions import TypedDict
from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


class Table(Enum):
    Students = 'students'
    Courses = 'courses'
    Results = 'results'

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(100))
    family_name = Column(String(100))
    dob = Column(Date)
    email = Column(String(100))
    
    results = relationship("Result", back_populates="student", cascade="all, delete")

class Course(Base):
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True)
    course_name = Column(String(100))

    results = relationship("Result", back_populates="course", cascade="all, delete")

class Result(Base):
    __tablename__ = 'results'
    
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students.id'))
    course_id = Column(Integer, ForeignKey('courses.id'))
    score = Column(Enum('A', 'B', 'C', 'D', 'E', 'F'))
    
    student = relationship("Student", back_populates="results")
    course = relationship("Course", back_populates="results")
