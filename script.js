// Student Management System - JavaScript
 
// State
let students = [];
let editingId = null;

// DOM Elements
const addStudentBtn = document.getElementById('addStudentBtn');
const formContainer = document.getElementById('formContainer');
const studentForm = document.getElementById('studentForm');
const formTitle = document.getElementById('formTitle');
const submitBtnText = document.getElementById('submitBtnText');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const highestMarksBtn = document.getElementById('highestMarksBtn');
const averageMarksBtn = document.getElementById('averageMarksBtn');
const statsContainer = document.getElementById('statsContainer');
const studentsTable = document.getElementById('studentsTable');
const studentsTableBody = document.getElementById('studentsTableBody');
const emptyState = document.getElementById('emptyState');
const studentCount = document.getElementById('studentCount');

// Form inputs
const studentName = document.getElementById('studentName');
const studentEmail = document.getElementById('studentEmail');
const studentAge = document.getElementById('studentAge');
const studentCourse = document.getElementById('studentCourse');
const studentMarks = document.getElementById('studentMarks');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    renderStudents();
    attachEventListeners();
});

// Event Listeners
function attachEventListeners() {
    addStudentBtn.addEventListener('click', showForm);
    cancelBtn.addEventListener('click', hideForm);
    studentForm.addEventListener('submit', handleSubmit);
    searchInput.addEventListener('input', handleSearch);
    highestMarksBtn.addEventListener('click', findHighestMarks);
    averageMarksBtn.addEventListener('click', calculateAverage);
}

// Load students from localStorage
function loadStudents() {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
}

// Save students to localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Show form
function showForm() {
    formContainer.style.display = 'block';
    if (!editingId) {
        formTitle.textContent = 'Add New Student';
        submitBtnText.textContent = 'Save Student';
    }
}

// Hide form
function hideForm() {
    formContainer.style.display = 'none';
    resetForm();
}

// Reset form
function resetForm() {
    studentForm.reset();
    editingId = null;
    formTitle.textContent = 'Add New Student';
    submitBtnText.textContent = 'Save Student';
}

// Handle form submit
function handleSubmit(e) {
    e.preventDefault();

    const studentData = {
        id: editingId || Date.now().toString(),
        name: studentName.value.trim(),
        email: studentEmail.value.trim(),
        age: parseInt(studentAge.value),
        course: studentCourse.value.trim(),
        marks: parseFloat(studentMarks.value)
    };

    if (editingId) {
        // Update existing student
        const index = students.findIndex(s => s.id === editingId);
        if (index !== -1) {
            students[index] = studentData;
        }
    } else {
        // Add new student
        students.push(studentData);
    }

    saveStudents();
    renderStudents();
    hideForm();
}

// Edit student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (student) {
        editingId = id;
        studentName.value = student.name;
        studentEmail.value = student.email;
        studentAge.value = student.age;
        studentCourse.value = student.course;
        studentMarks.value = student.marks;
        
        formTitle.textContent = 'Edit Student';
        submitBtnText.textContent = 'Update Student';
        showForm();
    }
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        renderStudents();
    }
}

// Handle search
function handleSearch() {
    renderStudents();
}

// Get filtered students
function getFilteredStudents() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        return students;
    }

    return students.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.course.toLowerCase().includes(searchTerm)
    );
}

// Calculate grade
function calculateGrade(marks) {
    if (marks >= 90) return { grade: 'A+', class: 'grade-a-plus' };
    if (marks >= 80) return { grade: 'A', class: 'grade-a' };
    if (marks >= 70) return { grade: 'B', class: 'grade-b' };
    if (marks >= 60) return { grade: 'C', class: 'grade-c' };
    if (marks >= 50) return { grade: 'D', class: 'grade-d' };
    return { grade: 'F', class: 'grade-f' };
}

// Render students table
function renderStudents() {
    const filteredStudents = getFilteredStudents();
    studentCount.textContent = filteredStudents.length;

    if (filteredStudents.length === 0) {
        studentsTable.style.display = 'none';
        emptyState.style.display = 'block';
        
        if (searchInput.value.trim()) {
            emptyState.innerHTML = `
                <div class="empty-icon">🔍</div>
                <p class="empty-title">No students found matching your search</p>
                <p class="empty-subtitle">Try a different search term</p>
            `;
        } else {
            emptyState.innerHTML = `
                <div class="empty-icon">👥</div>
                <p class="empty-title">No students added yet</p>
                <p class="empty-subtitle">Click "Add Student" to get started</p>
            `;
        }
        return;
    }

    emptyState.style.display = 'none';
    studentsTable.style.display = 'table';

    studentsTableBody.innerHTML = filteredStudents.map(student => {
        const { grade, class: gradeClass } = calculateGrade(student.marks);
        return `
            <tr>
                <td><div class="student-name">${escapeHtml(student.name)}</div></td>
                <td><div class="student-email">${escapeHtml(student.email)}</div></td>
                <td><div class="student-age">${student.age}</div></td>
                <td><div class="student-course">${escapeHtml(student.course)}</div></td>
                <td><div class="student-marks">${student.marks}%</div></td>
                <td><span class="grade ${gradeClass}">${grade}</span></td>
                <td class="actions-cell">
                    <div class="action-buttons">
                        <button class="btn btn-edit" onclick="editStudent('${student.id}')">
                            <span>✏️</span> Edit
                        </button>
                        <button class="btn btn-delete" onclick="deleteStudent('${student.id}')">
                            <span>🗑️</span> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Find highest marks
function findHighestMarks() {
    if (students.length === 0) {
        alert('No students available');
        return;
    }

    const highest = students.reduce((prev, current) =>
        (current.marks > prev.marks) ? current : prev
    );

    displayStat('highest', `
        <div class="stat-card-header">
            <span>🏆</span>
            <h3>Top Student</h3>
            <button class="stat-close" onclick="removeStat('highest')">✖</button>
        </div>
        <p><strong>Name:</strong> ${escapeHtml(highest.name)}</p>
        <p><strong>Marks:</strong> ${highest.marks}%</p>
        <p><strong>Course:</strong> ${escapeHtml(highest.course)}</p>
    `);
}

// Calculate average marks
function calculateAverage() {
    if (students.length === 0) {
        alert('No students available');
        return;
    }

    const total = students.reduce((sum, student) => sum + student.marks, 0);
    const average = total / students.length;

    displayStat('average', `
        <div class="stat-card-header">
            <span>🧮</span>
            <h3>Class Average</h3>
            <button class="stat-close" onclick="removeStat('average')">✖</button>
        </div>
        <div class="stat-value">${average.toFixed(2)}%</div>
        <div class="stat-info">Based on ${students.length} student${students.length !== 1 ? 's' : ''}</div>
    `);
}

// Display stat card
function displayStat(type, content) {
    // Remove existing stat of this type
    const existing = document.getElementById(`stat-${type}`);
    if (existing) {
        existing.remove();
    }

    const statCard = document.createElement('div');
    statCard.className = `stat-card ${type}`;
    statCard.id = `stat-${type}`;
    statCard.innerHTML = content;
    statsContainer.appendChild(statCard);
}

// Remove stat card
function removeStat(type) {
    const stat = document.getElementById(`stat-${type}`);
    if (stat) {
        stat.remove();
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
