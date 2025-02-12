import { createAuthClient } from 'better-auth/client';

const authClient = createAuthClient({
    baseURL: 'http://localhost:5757/auth',
});

document.addEventListener('DOMContentLoaded', async () => {
    const userEmailElement = document.getElementById('user-email');
    const userIconElement = document.querySelector('#user-account i');

    if (!userEmailElement || !userIconElement) {
        console.error('Required DOM elements not found');
        return;
    }

    try {
        const session = await authClient.getSession();
        
        
        if (session && session.data) {
            console.log(session.data);
            userEmailElement.textContent = session.data.user.email;
            userIconElement.className = 'fas fa-user'; // Change to filled user icon when logged in
        } else {
            userEmailElement.textContent = '';
            userIconElement.className = 'fas fa-user-circle'; // Use outline icon when not logged in
        }
    } catch (error) {
        console.error('Error checking authentication status:', error);
        userEmailElement.textContent = '';
        userIconElement.className = 'fas fa-user-circle';
    }
}); 