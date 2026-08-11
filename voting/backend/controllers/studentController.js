const Student = require('../models/Student');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// @desc    Upload student Excel sheet and parse into DB
// @route   POST /api/students/upload
// @access  Private/Admin
const uploadStudents = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an Excel file.' });
  }

  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'The Excel sheet is empty.' });
    }

    // Identify header mappings dynamically
    const firstRow = rows[0];
    let collegeIdKey = '';
    let nameKey = '';
    let phoneKey = '';
    let passwordKey = '';

    Object.keys(firstRow).forEach(key => {
      const cleanKey = key.trim().toLowerCase();
      if (cleanKey.includes('college') || cleanKey === 'id' || cleanKey.includes('collegeid') || cleanKey.includes('college id')) {
        collegeIdKey = key;
      } else if (cleanKey === 'name' || cleanKey.includes('student name')) {
        nameKey = key;
      } else if (cleanKey.includes('phone') || cleanKey.includes('contact') || cleanKey.includes('number') || cleanKey.includes('mobile')) {
        phoneKey = key;
      } else if (cleanKey.includes('pass') || cleanKey === 'password') {
        passwordKey = key;
      }
    });

    if (!nameKey || !phoneKey || !passwordKey) {
      return res.status(400).json({
        message: 'Could not detect columns. Ensure your Excel sheet has headers for: Name, Phone Number, Password.'
      });
    }

    if (!collegeIdKey) {
      collegeIdKey = phoneKey;
    }

    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const row of rows) {
      const collegeId = String(row[collegeIdKey]).trim();
      const name = String(row[nameKey]).trim();
      const phoneNumber = String(row[phoneKey]).trim();
      const rawPassword = String(row[passwordKey]).trim();

      if (!collegeId || !name || !phoneNumber || !rawPassword) {
        skippedCount++;
        continue;
      }

      const existingStudent = await Student.findOne({ collegeId });

      if (existingStudent) {
        if (existingStudent.hasVoted) {
          skippedCount++;
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(rawPassword, salt);
          existingStudent.name = name;
          existingStudent.phoneNumber = phoneNumber;
          existingStudent.password = hashedPassword;
          await existingStudent.save();
          updatedCount++;
        }
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);
        const newStudent = new Student({
          collegeId,
          name,
          phoneNumber,
          password: hashedPassword,
          hasVoted: false
        });
        await newStudent.save();
        addedCount++;
      }
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      message: 'Excel file processed successfully.',
      statistics: {
        totalRows: rows.length,
        added: addedCount,
        updated: updatedCount,
        skipped: skippedCount
      }
    });

  } catch (error) {
    console.error('Error processing Excel file:', error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(500).json({ message: 'Error processing Excel file: ' + error.message });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select('-password').sort({ collegeId: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      await Student.deleteOne({ _id: student._id });
      res.json({ message: 'Student removed successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a student manually
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
  let { collegeId, name, phoneNumber, password } = req.body;

  if (!name || !phoneNumber || !password) {
    return res.status(400).json({ message: 'Please fill in all required fields (Name, Phone, Password)' });
  }

  const finalCollegeId = collegeId && collegeId.trim() ? collegeId.trim() : phoneNumber.trim();

  try {
    const studentExists = await Student.findOne({ collegeId: finalCollegeId });
    if (studentExists) {
      return res.status(400).json({ message: 'A student with this College ID / Phone Number already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    const student = new Student({
      collegeId: finalCollegeId,
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword,
      hasVoted: false
    });

    const createdStudent = await student.save();
    // Omit password from output
    const result = createdStudent.toObject();
    delete result.password;

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a student manually
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  const { collegeId, name, phoneNumber, password } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const wasUsingPhoneAsId = student.collegeId === student.phoneNumber;

    student.name = name ? name.trim() : student.name;
    
    if (phoneNumber && phoneNumber.trim()) {
      student.phoneNumber = phoneNumber.trim();
    }

    // Determine new college ID
    let newCollegeId = student.collegeId;
    if (collegeId && collegeId.trim()) {
      newCollegeId = collegeId.trim();
    } else if (wasUsingPhoneAsId && phoneNumber && phoneNumber.trim()) {
      newCollegeId = phoneNumber.trim();
    }

    // Uniqueness check for College ID if changing it
    if (newCollegeId !== student.collegeId) {
      const idExists = await Student.findOne({ collegeId: newCollegeId });
      if (idExists) {
        return res.status(400).json({ message: 'College ID or Phone Number is already in use by another student' });
      }
      student.collegeId = newCollegeId;
    }

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password.trim(), salt);
    }

    const updatedStudent = await student.save();
    const result = updatedStudent.toObject();
    delete result.password;

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadStudents,
  getAllStudents,
  deleteStudent,
  createStudent,
  updateStudent
};
