import {
    Outlet,
} from 'react-router-dom'

import NavBar from './NavBar';

function Layout() {
    return (
        <>
            <NavBar />
            <div className="content">
                <Outlet />
            </div>
        </>
    )
}

export default Layout