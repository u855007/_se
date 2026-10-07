const DB = {
    users: [
        { username: 'student1', password: 'password123', role: 'student', userId: 'S1001' },
        { username: 'faculty1', password: 'password123', role: 'faculty', userId: 'F2001' },
        { username: 'admin1', password: 'password123', role: 'admin', userId: 'A3001' }
    ],
    students: [
        {
            id: 'S1001',
            name: '陳小明',
            major: '資訊工程學系',
            dept: '電信工程學院',
            year: 2,
            email: 'student1@nqu.edu.tw',
            phone: '0912-345-678',
            enrolledCourses: ['CS101', 'CS102']
        }
    ],
    faculty: [
        {
            id: 'F2001',
            name: '王教授',
            dept: '資訊工程學系',
            email: 'faculty1@nqu.edu.tw',
            phone: '0987-654-321'
        }
    ],
    courses: [
        {
            code: 'CS101',
            title: '程式設計(一)',
            credits: 3,
            dept: '資訊工程學系',
            instructorId: 'F2001',
            capacity: 40,
            enrolledCount: 25,
            schedule: { day: '週一', time: '08:00 - 10:00', room: 'C301' },
            description: '學習程式設計基礎邏輯與語法。'
        },
        {
            code: 'CS102',
            title: '資料結構',
            credits: 3,
            dept: '資訊工程學系',
            instructorId: 'F2001',
            capacity: 30,
            enrolledCount: 15,
            schedule: { day: '週三', time: '10:00 - 12:00', room: 'C302' },
            description: '探討各種資料結構的儲存與操作。'
        },
        {
            code: 'EN101',
            title: '英文寫作',
            credits: 2,
            dept: '外語中心',
            instructorId: 'F2005',
            capacity: 20,
            enrolledCount: 10,
            schedule: { day: '週二', time: '14:00 - 16:00', room: 'B101' },
            description: '提升學術英文寫作能力。'
        }
    ],
    grades: [
        { studentId: 'S1001', courseCode: 'CS101', grade: 'A', semester: '112-1' },
        { studentId: 'S1001', courseCode: 'CS102', grade: 'B+', semester: '112-1' }
    ],
    notifications: [
        { id: 1, userId: 'S1001', message: '您的 CS101 成績已公布', date: '2026-10-01' },
        { id: 2, userId: 'S1001', message: '下週三有系務會議', date: '2026-10-05' }
    ]
};

export default DB;
