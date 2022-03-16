import { BehaviorSubject } from 'rxjs';

// import i18n from "i18n";

import Environment from "../environment";

import User from "../models/User";


const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));  // receive initial value, only when do next()

export const AuthService = {
    expirationTime: 60 * 5,  // Seconds
    idleInterval: null,
    idleTime: 0,
    currentUser: currentUserSubject.asObservable(),
    currentUserValue: () => {
        return currentUserSubject.value
    },

    login: (email, password) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'es-ar'
            },
            body: JSON.stringify({ email, password })
        };

        return fetch(`${Environment.api}api/auth/login`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json().then(data => {
                        localStorage.setItem('access', data.access_token);
                        localStorage.setItem('refresh', data.expires_in);
                        return data;
                    });
                }
                throw response;
            });
    },

    confirm: (token) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token })
        };

        return fetch(`${Environment.api}api/auth/confirm/`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json().then(data => {
                        localStorage.setItem('message', data.message);
                        localStorage.setItem('user', data.user);
                        return data;
                    });
                }
                throw response;
            });
    },

    refresh: async () => {
        const refresh = localStorage.getItem('refresh');
        if (refresh) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh:  refresh})
            };
            let response = await fetch(`${Environment.api}api/auth/refresh/`, requestOptions);
            if (response.status === 200) {
                let data = await response.json()
                localStorage.setItem('access', data.access_token);
                localStorage.setItem('refresh', data.expires_in);
            }
        }
    },

    logout: () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            currentUserSubject.next(null);
            AuthService.removeListeners();
    },

    loadUser: async (refresh=false) => {
        if (refresh) {
            await AuthService.refresh();
        }

        return new Promise((resolve, reject) => {
            const access = localStorage.getItem('access');
            if (! access) {
                reject("No Access");
                return;
            }

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access
                }
            };
            return fetch(`${Environment.api}api/auth/me/`, requestOptions)
                .then(response => {
                    if (response.ok) {
                        response.json().then(data => {
                            if (!data.habilitado) {
                                AuthService.logout();
                                reject(response);
                            } else {
                                let user = new User(data);
                                localStorage.setItem('currentUser', JSON.stringify(user));
                                // localStorage.setItem('i18nextLng', user.language);
                                // i18n.changeLanguage(user.language)
                                currentUserSubject.next(user);
                                AuthService.startListeners();
                                resolve(user);
                            }
                        });
                    } else {
                        AuthService.logout();
                        reject(response);
                    }
                }).catch(error => {
                    AuthService.logout();
                    reject(error);
                });
        });
    },

    getToken() {
        return `Bearer ${localStorage.getItem('access')}`;
    },

    resetIdle: function() {
        const pendingDelta = AuthService.expirationTime - AuthService.idleTime;

        // If detects user activity and token is going to be expired refresh it
        if (/*pendingDelta > 0 &&*/ pendingDelta < 60) {
            AuthService.idleTime = 0;
            AuthService.refresh();          
        }
    },

    timerIncrement: function() {
        AuthService.idleTime = AuthService.idleTime + 1;

        // Autologout when idleTime passes the expiration delta
        // if (AuthService.idleTime > AuthService.expirationTime) {
        //   AuthService.removeListeners();
        //   AuthService.logout();
        // }
    },

    removeListeners: () => {
        document.removeEventListener('keypress', AuthService.resetIdle, false);

        if (AuthService.idleInterval) clearInterval(AuthService.idleInterval);
    },

    startListeners: () => {
        AuthService.idleInterval = setInterval(AuthService.timerIncrement, 1000);
        document.addEventListener('mousemove', AuthService.resetIdle, false);
        document.addEventListener('keypress', AuthService.resetIdle, false);
    },
};
