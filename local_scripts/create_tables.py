from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(100))
    family_name = Column(String(100))
    dob = Column(Date)
    email = Column(String(100))
    
    results = relationship("Result", back_populates="student")

class Course(Base):
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True)
    course_name = Column(String(100))

    results = relationship("Result", back_populates="course")

class Result(Base):
    __tablename__ = 'results'
    
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students.id'))
    course_id = Column(Integer, ForeignKey('courses.id'))
    score = Column(Enum('A', 'B', 'C', 'D', 'E', 'F'))
    
    student = relationship("Student", back_populates="results")
    course = relationship("Course", back_populates="results")

USER = os.getenv('DB_USER')
PASSWORD = os.getenv('DB_PASSWORD')
HOST = os.getenv('DB_HOST')
PORT = os.getenv('DB_PORT')
DATABASE = os.getenv('DB_NAME')

engine = create_engine(f'mssql+pyodbc://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}?driver=SQL+Server')

Session = sessionmaker(bind=engine)

session = Session()

Base.metadata.create_all(engine)

session.commit()