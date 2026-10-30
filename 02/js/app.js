import DB from './data.js';
import { Auth } from './auth.js';
import { UI } from './ui.js';

const app = {
    init() {
        Auth.init();
        this.setupEventListeners();
        this.checkAuth();
        this.render();
    },

    setupEventListeners() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if (Auth.login(user, pass)) {
                this.checkAuth();
                this.render();
            } else {
                alert('帳號或密碼錯誤，請重新輸入');
            }
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            Auth.logout();
            this.checkAuth();
            this.render();
        });
    },

    checkAuth() {
        if (Auth.isAuthenticated()) {
            document.getElementById('login-page').classList.add('hidden');
            document.getElementById('app-shell').classList.remove('hidden');
        } else {
            document.getElementById('login-page').classList.remove('hidden');
            document.getElementById('app-shell').classList.add('hidden');
        }
    },

    navigate(page) {
        this.currentPage = page;
        this.render();
    },

    render() {
        if (!Auth.isAuthenticated()) return;

        const role = Auth.getUserRole();
        const userId = Auth.getUserId();

        // Set user identity
        let displayName = '使用者';
        if (role === 'student') {
            displayName = DB.students.find(s => s.id === userId)?.name || '學生';
        } else if (role === 'faculty') {
            displayName = DB.faculty.find(f => f.id === userId)?.name || '教師';
        } else if (role === 'admin') {
            displayName = '系統管理員';
        }
        document.getElementById('user-display-name').innerText = displayName;
        document.getElementById('user-role-badge').innerText = role === 'student' ? '學生' : role === 'faculty' ? '教師' : '管理員';

        // Sidebar Navigation based on role
        const nav = document.getElementById('main-nav');
        nav.innerHTML = '';

        const routes = {
            student: [
                { id: 'dashboard', label: '首頁', icon: '🏠' },
                { id: 'courses', label: '選課系統', icon: '📚' },
                { id: 'grades', label: '成績查詢', icon: '🎓' },
                { id: 'profile', label: '個人資料', icon: '👤' },
            ],
            faculty: [
                { id: 'faculty', label: '教學管理', icon: '🏫' },
                { id: 'profile', label: '個人資料', icon: '👤' },
            ],
            admin: [
                { id: 'admin', label: '系統管理', icon: '⚙️' },
                { id: 'profile', label: '個人資料', icon: '👤' },
            ]
        };

        const activeRoutes = routes[role] || [];
        activeRoutes.forEach(route => {
            const btn = document.createElement('button');
            btn.className = `w-full flex items-center gap-3 p-3 rounded-lg transition text-sm font-medium ${this.currentPage === route.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`;
            btn.innerHTML = `<span>${route.icon}</span> <span>${route.label}</span>`;
            btn.onclick = () => this.navigate(route.id);
            nav.appendChild(btn);
        });

        // Page Content
        const content = document.getElementById('content-area');
        const title = document.getElementById('page-title');

        if (!this.currentPage) this.currentPage = activeRoutes[0].id;

        switch(this.currentPage) {
            case 'dashboard':
                title.innerText = '個人儀表板';
                content.innerHTML = UI.renderDashboard();
                break;
            case 'courses':
                title.innerText = '選課系統';
                content.innerHTML = UI.renderCourseRegistration();
                break;
            case 'grades':
                title.innerText = '成績查詢';
                content.innerHTML = UI.renderGrades();
                break;
            case 'faculty':
                title.innerText = '教師管理';
                content.innerHTML = UI.renderFacultyDashboard();
                break;
            case 'grade-entry':
                title.innerText = '成績輸入';
                content.innerHTML = UI.renderGradeEntry(this.currentCourseCode);
                break;
            case 'admin':
                title.innerText = '系統管理';
                content.innerHTML = UI.renderAdminOverview();
                break;
            case 'profile':
                title.innerText = '個人資料';
                content.innerHTML = `<div class="p-6 text-center text-gray-500">個人資料編輯功能開發中...</div>`;
                break;
            default:
                content.innerHTML = `<div class="p-6 text-center text-gray-500">頁面不存在</div>`;
        }
    },

    // Global handlers for UI interaction
    handleCourseAction(typeOrCode, courseCode) {
        if (typeOrCode === 'grade') {
            this.currentPage = 'grade-entry';
            this.currentCourseCode = courseCode;
            this.render();
            return;
        }

        const code = typeOrCode;
        const userId = Auth.getUserId();
        const student = DB.students.find(s => s.id === userId);
        if (!student) return;

        if (student.enrolledCourses.includes(code)) {
            student.enrolledCourses = student.enrolledCourses.filter(c => c !== code);
        } else {
            const course = DB.courses.find(c => c.code === code);
            if (course.enrolledCount >= course.capacity) {
                alert('課程已滿，無法選課');
                return;
            }
            student.enrolledCourses.push(code);
            course.enrolledCount++;
        }
        this.render();
    },

    updateGrade(studentId, courseCode, newGrade) {
        let gradeEntry = DB.grades.find(g => g.studentId === studentId && g.courseCode === courseCode);
        if (gradeEntry) {
            gradeEntry.grade = newGrade;
        } else {
            DB.grades.push({ studentId, courseCode, grade: newGrade, semester: '113-1' });
        }
        console.log(`Grade updated: ${studentId} - ${courseCode} : ${newGrade}`);
    },

    // Removed handleCourseActionGrade as it is now merged into handleCourseAction

};

// Make app global for UI handlers
window.app = app;
app.init();
