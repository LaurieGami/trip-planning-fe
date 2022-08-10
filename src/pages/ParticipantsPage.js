import { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { filter } from 'lodash'
// import { useNavigate } from 'react-router-dom'
// import { filter } from 'lodash'
import { useAccount } from '../context/authContext'

import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
} from '@mui/material'
import { Add } from '@mui/icons-material'

import Page from '../components/common/Page'
// import AddParticipantButton from '../components/participant/AddParticipantButton'
import SearchNotFound from '../components/common/SearchNotFound'
import ParticipantTableHead from '../components/participant/ParticipantTableHead'
import ParticipantTableToolbar from '../components/participant/ParticipantTableToolbar'
import ParticipantMoreButton from '../components/participant/ParticipantMoreButton'

const GET_PARTICIPANTS = gql`
    query GetParticipants($userId: ID!) {
        getParticipants(userId: $userId) {
            id
            firstName
            lastName
        }
    }
`

const TABLE_HEAD = [
    { id: 'fullName', label: 'Full Name', alignRight: false },
    { id: 'firstName', label: 'First Name', alignRight: false },
    { id: 'lastName', label: 'Last Name', alignRight: false },
    { id: '' }
]

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        const filteredValues = filter(array, (_participant) => (
            _participant['lastName'].toLowerCase().indexOf(query.toLowerCase()) !== -1
            || _participant['firstName'].toLowerCase().indexOf(query.toLowerCase()) !== -1
        ))

        return filteredValues
    }
    return stabilizedThis.map((el) => el[0]);
}

function ParticipantsPage() {
    // let navigate = useNavigate()
    const { user } = useAccount()

    const [participants, setParticipants] = useState([])
    const [filteredParticipants, setFilteredParticipants] = useState([])
    const [page, setPage] = useState(0)
    const [order, setOrder] = useState('asc')
    const [selected, setSelected] = useState([])
    const [orderBy, setOrderBy] = useState('fullName')
    const [filterName, setFilterName] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = filteredParticipants.map((p) => p.id)
            setSelected(newSelecteds)
            return
        }
        setSelected([])
    }

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected = []
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }
        setSelected(newSelected)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleFilterByName = (event) => {
        setFilterName(event.target.value)
    }

    useEffect(() => {
        const filteredParticipants = applySortFilter(participants, getComparator(order, orderBy), filterName)
        setFilteredParticipants(filteredParticipants)
    }, [participants, order, orderBy, filterName])

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - participants.length) : 0
    
    const isParticipantNotFound = filteredParticipants.length === 0

    useQuery(GET_PARTICIPANTS, {
        variables: { userId: user.id },
        onCompleted({ getParticipants }) {
            setParticipants(getParticipants.map(participant => {
                return {
                    id: participant.id,
                    firstName: participant.firstName,
                    lastName: participant.lastName
                }
            }))
        }
    })

    return (
        <Page title="Participants">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Participants
                    </Typography>
                    <Button variant="contained" component={Link} to="#" startIcon={<Add />}>
                        New Participant
                    </Button>
                </Stack>
                <Card>
                    <ParticipantTableToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <ParticipantTableHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={filteredParticipants.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredParticipants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    // const { id, name, role, status, company, avatarUrl, isVerified } = row
                                    const { id, firstName, lastName } = row
                                    const isItemSelected = selected.indexOf(id) !== -1
                                    return (
                                        <TableRow
                                            hover
                                            key={id}
                                            tabIndex={-1}
                                            role="checkbox"
                                            selected={isItemSelected}
                                            aria-checked={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Avatar alt={`${firstName} ${lastName}`} />
                                                    <Typography variant="subtitle2" noWrap>
                                                        {`${firstName} ${lastName}`}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="left">{firstName}</TableCell>
                                            <TableCell align="left">{lastName}</TableCell>
                                            <TableCell align="right">
                                                <ParticipantMoreButton />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            {isParticipantNotFound && (
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                            <SearchNotFound searchQuery={filterName} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )}
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={participants.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    )
}

export default ParticipantsPage
