import { createAuthClient } from 'better-auth/client';

const authClient = createAuthClient({
    baseURL: 'http://www.cloudworkers.dev/auth',
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
        console.log({session});
        
        if (session && session.data) {
            console.log(session.data);
            userEmailElement.textContent = session.data.user.email;
            userEmailElement.title = 'Sign out';
            userIconElement.className = 'fas fa-user'; // Change to filled user icon when logged in
            userEmailElement.onclick = async () => {
                await authClient.signOut();
                document.location.reload();
            }

        } else {
            userEmailElement.textContent = 'Click to sign in';
            userIconElement.className = 'fas fa-user-circle'; // Use outline icon when not logged in
            userEmailElement.onclick = () => {
                document.location = `/auth/front/signin?returnUrl=${window.location.href}`;
            }
        }
    } catch (error) {
        console.error('Error checking authentication status:', error);
        userEmailElement.textContent = '';
        userIconElement.className = 'fas fa-user-circle';
    }
}); 