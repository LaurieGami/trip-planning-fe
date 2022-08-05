import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

function useAccount() {
    const accountInfo = useContext(AuthContext)
    return accountInfo
}

export default useAccount
