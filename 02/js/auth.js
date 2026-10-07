import DB from './data.js';

export const Auth = {
    currentUser: null,

    login(username, password) {
        const user = DB.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = { ...user };
            localStorage.setItem('u_session', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('u_session');
    },

    init() {
        const session = localStorage.getItem('u_session');
        if (session) {
            this.currentUser = JSON.parse(session);
        }
    },

    isAuthenticated() {
        return this.currentUser !== null;
    },

    getUserRole() {
        return this.currentUser ? this.currentUser.role : null;
    },

    getUserId() {
        return this.currentUser ? this.currentUser.userId : null;
    }
};
