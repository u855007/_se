import DB from './data.js';
import { Auth } from './auth.js';

export const UI = {
    renderDashboard() {
        const userId = Auth.getUserId();
        const student = DB.students.find(s => s.id === userId);
        if (!student) return `<div class="p-6 text-center">找不到學生資料</div>`;

        const gpa = 3.85; // Mock GPA calculation
        const totalCredits = student.enrolledCourses.length * 3;

        return `
            <div class="p-6 space-y-6">
                <h2 class="text-2xl font-bold text-gray-800">歡迎回來, ${student.name} 同學</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                        <p class="text-sm text-blue-600 font-medium">目前 GPA</p>
                        <p class="text-3xl font-bold text-blue-900">${gpa}</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                        <p class="text-sm text-green-600 font-medium">累計學分</p>
                        <p class="text-3xl font-bold text-green-900">${totalCredits}</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 shadow-sm">
                        <p class="text-sm text-purple-600 font-medium">所屬系所</p>
                        <p class="text-xl font-bold text-purple-900">${student.major}</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 class="text-lg font-semibold mb-4 text-gray-700">最新通知</h3>
                    <ul class="space-y-3">
                        ${DB.notifications.filter(n => n.userId === userId).map(n => `
                            <li class="flex justify-between items-center p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                                <span class="text-gray-600">${n.message}</span>
                                <span class="text-xs text-gray-400">${n.date}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    },

    renderCourseRegistration() {
        const userId = Auth.getUserId();
        const student = DB.students.find(s => s.id === userId);

        return `
            <div class="p-6">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">選課系統</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-100 text-gray-600 uppercase text-xs">
                                <th class="p-3 border">課程代碼</th>
                                <th class="p-3 border">課程名稱</th>
                                <th class="p-3 border">學分</th>
                                <th class="p-3 border">授課教師</th>
                                <th class="p-3 border">時間/教室</th>
                                <th class="p-3 border">狀態</th>
                                <th class="p-3 border">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${DB.courses.map(c => {
                                const isEnrolled = student?.enrolledCourses.includes(c.code);
                                return `
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="p-3 border font-mono">${c.code}</td>
                                        <td class="p-3 border font-medium">${c.title}</td>
                                        <td class="p-3 border text-center">${c.credits}</td>
                                        <td class="p-3 border">${DB.faculty.find(f => f.id === c.instructorId)?.name || '未指定'}</td>
                                        <td class="p-3 border text-sm">${c.schedule.day} ${c.schedule.time} (${c.schedule.room})</td>
                                        <td class="p-3 border text-center">
                                            <span class="${isEnrolled ? 'text-green-600' : 'text-gray-400'} text-xs">
                                                ${isEnrolled ? '已選課' : `${c.enrolledCount}/${c.capacity}`}
                                            </span>
                                        </td>
                                        <td class="p-3 border text-center">
                                            <button
                                                onclick="app.handleCourseAction('${c.code}')"
                                                class="px-3 py-1 rounded text-sm font-medium transition ${isEnrolled ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}"
                                            >
                                                ${isEnrolled ? '刪除' : '選課'}
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderGrades() {
        const userId = Auth.getUserId();
        const student = DB.students.find(s => s.id === userId);

        return `
            <div class="p-6">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">成績查詢</h2>
                <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th class="p-4 border-b">學期</th>
                                <th class="p-4 border-b">課程代碼</th>
                                <th class="p-4 border-b">課程名稱</th>
                                <th class="p-4 border-b text-center">成績</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${DB.grades.filter(g => g.studentId === userId).map(g => {
                                const course = DB.courses.find(c => c.code === g.courseCode);
                                return `
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="p-4">${g.semester}</td>
                                        <td class="p-4 font-mono">${g.courseCode}</td>
                                        <td class="p-4">${course?.title || '未知課程'}</td>
                                        <td class="p-4 text-center font-bold text-blue-600">${g.grade}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderFacultyDashboard() {
        const userId = Auth.getUserId();
        const faculty = DB.faculty.find(f => f.id === userId);

        return `
            <div class="p-6">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">教師教學管理</h2>
                <div class="grid grid-cols-1 gap-6">
                    ${DB.courses.filter(c => c.instructorId === userId).map(c => `
                        <div class="bg-white p-6 rounded-lg border shadow-sm flex justify-between items-center">
                            <div>
                                <h3 class="text-lg font-bold text-gray-700">${c.title} (${c.code})</h3>
                                <p class="text-sm text-gray-500">${c.schedule.day} ${c.schedule.time} | 教室: ${c.schedule.room}</p>
                                <p class="text-sm text-gray-500">目前人數: ${c.enrolledCount}/${c.capacity}</p>
                            </div>
                            <button
                                onclick="app.handleCourseAction('grade', '${c.code}')"
                                class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm font-medium"
                            >
                                輸入成績
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderGradeEntry(courseCode) {
        const course = DB.courses.find(c => c.code === courseCode);
        // Mock students enrolled in this course
        const enrolledStudents = DB.students.filter(s => s.enrolledCourses.includes(courseCode));

        return `
            <div class="p-6">
                <div class="flex items-center gap-4 mb-6">
                    <button onclick="app.navigate('faculty')" class="text-gray-500 hover:text-gray-700">&larr; 返回</button>
                    <h2 class="text-2xl font-bold text-gray-800">成績輸入: ${course.title}</h2>
                </div>
                <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-gray-50 text-gray-600 text-sm">
                                <th class="p-4 border-b">學號</th>
                                <th class="p-4 border-b">姓名</th>
                                <th class="p-4 border-b text-center">成績</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${enrolledStudents.map(s => `
                                <tr class="border-b">
                                    <td class="p-4 font-mono">${s.id}</td>
                                    <td class="p-4">${s.name}</td>
                                    <td class="p-4 text-center">
                                        <input
                                            type="text"
                                            class="w-20 p-2 border rounded text-center font-bold"
                                            value="${DB.grades.find(g => g.studentId === s.id && g.courseCode === courseCode)?.grade || ''}"
                                            onchange="app.updateGrade('${s.id}', '${courseCode}', this.value)"
                                        >
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderAdminOverview() {
        return `
            <div class="p-6">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">系統概況</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-lg border shadow-sm text-center">
                        <p class="text-gray-500 text-sm">總學生人數</p>
                        <p class="text-4xl font-bold text-blue-600">${DB.students.length}</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg border shadow-sm text-center">
                        <p class="text-gray-500 text-sm">總教師人數</p>
                        <p class="text-4xl font-bold text-indigo-600">${DB.faculty.length}</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg border shadow-sm text-center">
                        <p class="text-gray-500 text-sm">總課程數量</p>
                        <p class="text-4xl font-bold text-green-600">${DB.courses.length}</p>
                    </div>
                </div>
                <div class="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 class="text-lg font-semibold text-blue-800 mb-2">系統維護狀態</h3>
                    <p class="text-sm text-blue-600">所有模組運作正常。下次系統更新預計於 2026-11-01 進行。</p>
                </div>
            </div>
        `;
    }
};
