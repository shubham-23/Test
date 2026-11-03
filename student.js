
const express = require("express");
const cors = require("cors");

const app = express();
const students = [];
let nextStudentId = 1;


app.use(cors({
    origin: "http://localhost:5173",
}));

app.use(express.json());

function validateStudent(body) {
    const { name, email = "", course = "", phone = "" } = body || {};

    if (typeof name !== "string" || name.trim() === "") {
        return { error: "Student name is required" };
    }

    if (typeof email !== "string" ||
        typeof course !== "string" ||
        typeof phone !== "string") {
        return { error: "Student fields must be strings" };
    }

    return {
        value: {
            name: name.trim(),
            email: email.trim(),
            course: course.trim(),
            phone: phone.trim()
        }
    };
}

// Get all students
app.get("/students", (req, res) => {
    res.json({ students });
});

// Get one student
app.get("/students/:id", (req, res) => {
    const student = students.find((item) => item.id === Number(req.params.id));

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json({ student });
});

// Create a student
app.post("/students", (req, res) => {
    const result = validateStudent(req.body);

    if (result.error) {
        return res.status(400).json({ message: result.error });
    }

    const student = {
        id: nextStudentId++,
        ...result.value,
        createdAt: new Date().toISOString()
    };

    students.push(student);

    res.status(201).json({
        message: "Student created successfully",
        student
    });
});

// Update a student
app.put("/students/:id", (req, res) => {
    const studentIndex = students.findIndex(
        (item) => item.id === Number(req.params.id)
    );

    if (studentIndex === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const result = validateStudent(req.body);

    if (result.error) {
        return res.status(400).json({ message: result.error });
    }

    students[studentIndex] = {
        ...students[studentIndex],
        ...result.value,
        updatedAt: new Date().toISOString()
    };

    res.json({
        message: "Student updated successfully",
        student: students[studentIndex]
    });
});

// Delete a student
app.delete("/students/:id", (req, res) => {
    const studentIndex = students.findIndex(
        (item) => item.id === Number(req.params.id)
    );

    if (studentIndex === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const [deletedStudent] = students.splice(studentIndex, 1);

    res.json({
        message: "Student deleted successfully",
        student: deletedStudent
    });
});

if (require.main === module) {
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Backend running at http://localhost:${port}`);
    });
}

module.exports = app;
