const express = require("express");

const router = express.Router();

let students = [
    {
        id: 1,
        name: "Shubham",
        email: "shubham@gmail.com"
    },
    {
        id: 2,
        name: "Rahul",
        email: "rahul@gmail.com"
    }
];

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     description: Fetch all student records
 *     responses:
 *       200:
 *         description: Students fetched successfully
 */
router.get("/", (req, res) => {

    res.status(200).json({
        message: "Students fetched successfully",
        students
    });

});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a new student
 *     description: Create a new student record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amit
 *               email:
 *                 type: string
 *                 example: amit@gmail.com
 *     responses:
 *       201:
 *         description: Student added successfully
 *       400:
 *         description: Name and email are required
 */
router.post("/", (req, res) => {

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const newStudent = {
        id: Date.now(),
        name,
        email
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });

});

module.exports = router;