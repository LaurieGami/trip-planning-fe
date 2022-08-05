import useAccount from '../hooks/useAccount'

function HomePage() {
    const { user } = useAccount()

    return (
        <>
            <h1>This is the homepage</h1>
            {user ?
                <p>{user.email} is logged in</p>
            :
                <p>There is no user data.</p>
            }
        </>
    )
}

export default HomePage
