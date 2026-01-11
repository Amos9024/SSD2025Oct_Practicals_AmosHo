const bookModel = require("../models/studentModel");

// Get all students
async function getAllStudents(req, res) {
  try {
    const students = await bookModel.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving students" });
  }
}

// Get student by ID
async function getStudentById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const student = await bookModel.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving student" });
  }
}

// Create new student
async function createStudent(req, res) {
  try {
    const newStudent = await bookModel.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating student" });
  }
}

// Update an existing student
async function updateStudent(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updatedStudent = await bookModel.updateStudent(id, req.body);
    if (updatedStudent === 0) {
      return res.status(404).json({ message: `No student found with id ${id}.` });
    }
    res.status(200).json({ message: "Student updated successfully." });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating student" });
  }
}

// Delete a student
async function deleteStudent(req, res) {
  try {   
    const id = parseInt(req.params.id);
    const message = await bookModel.deleteStudent(id);
    if (message === 0) {
      return res.status(404).json({ message: `No student found with id ${id}.` });
    }
    res.json({message: `Student with id ${id} deleted successfully.`});
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting student" });
  }
}
module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};