import React, {useState, useEffect} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {useHistory} from 'react-router-dom';

import './App.css';

import {Context, ContextPersist} from "./store/context"
import { AuthService } from './services/AuthService';

import UserListView from './views/User/UserList/UserListView';
import FriendshipListView from './views/Lesson/FriendshipList/FriendshipListView';
import UserLessonListView from './views/Lesson/UserLessonList/UserLessonListView';
import UserFriendshipListView from './views/Lesson/UserFriendshipList/UserFriendshipListView';

function App() {
    const history = useHistory();

    const [user, setUser] = useState(null);

    useEffect(() => {
        AuthService.loadUser()
            .then(user => {
                setUser(user);
            }).catch(error => {
                console.log(error)
            }
        );

        const currentUserObserver = AuthService.currentUser.subscribe(user_event => {
            if (user != null && user_event === null) {
                history.push('/login');
            }
            
            setUser(user_event);
        });

        return function cleanup() {
            currentUserObserver.unsubscribe();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ContextPersist><Context>

        <main>
            <Switch>
                <React.Fragment>
                        {/* { (load && !user) &&
                        <div>
                            <Route path='/login' component={SignInView} />
                        </div>
                        }
                        { (load && user) && */}
                        <div>
                            <Route path='/users' component={UserListView} />
                            <Route path='/friendships' component={FriendshipListView} />
                            <Route path='/user-lessons/:user' component={UserLessonListView} />
                            <Route path='/user-friendships/:user' component={UserFriendshipListView} />
                            <Route exact path="/">
                                <Redirect to="/users" />
                            </Route>
                        </div>
                        {/* } */}
                </React.Fragment>
            </Switch>
        </main>
        </Context></ContextPersist>

    );
}

export default App;
