import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MenuItem, InputLabel, Select, FormGroup, Checkbox, FormControlLabel, FormLabel } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

const Add = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        dateOfBirth: null,
        gender: '',
        hobbies: [],
        address: '',
        city: '',
        pincode: '',
    });

    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        age: false,
        gender: false,
        hobbies: false,
        address: false,
        city: false,
        pincode: false,
    });

    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('usersData');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });

    const [editingUserId, setEditingUserId] = useState(null);

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            age: '',
            dateOfBirth: null,
            gender: '',
            hobbies: [],
            address: '',
            city: '',
            pincode: '',
        });
        setEditingUserId(null);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === 'firstName' || id === 'lastName') {
            const isAlphabetic = /^[A-Za-z]*$/.test(value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [id]: !isAlphabetic || value === '',// Set error if not alphabetic or empty
            }));
        }

        setFormData((prev) => ({ ...prev, [id]: value }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: value === '' || (id === 'age' && value <= 0) || (id === 'pincode' && value.length !== 6),
        }));
    };

    const handleGenderChange = (e) => {
        setFormData((prev) => ({ ...prev, gender: e.target.value }));
        setErrors((prevErrors) => ({ ...prevErrors, gender: e.target.value === '' }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const updatedHobbies = checked
                ? [...prev.hobbies, value]
                : prev.hobbies.filter((hobby) => hobby !== value);

            setErrors((prevErrors) => ({ ...prevErrors, hobbies: updatedHobbies.length === 0 }));

            return { ...prev, hobbies: updatedHobbies };
        });
    };

    const handleDateChange = (newValue) => {
        setFormData((prev) => ({ ...prev, dateOfBirth: newValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {
            firstName: formData.firstName === '',
            lastName: formData.lastName === '',
            age: formData.age === '' || formData.age <= 0,
            gender: formData.gender === '',
            hobbies: formData.hobbies.length === 0,
            address: formData.address === '',
            city: formData.city === '',
            pincode: formData.pincode === '' || formData.pincode.length !== 6,
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).includes(true)) {
            const newUser = {
                ...formData,
                dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
                id: editingUserId || Date.now(),
            };

            const updatedUsers = editingUserId
                ? users.map(user => (user.id === editingUserId ? newUser : user))
                : [...users, newUser];

            setUsers(updatedUsers);
            localStorage.setItem('usersData', JSON.stringify(updatedUsers));

            resetForm();
        }
    };


    const handleEdit = (user) => {
        setFormData({
            ...user,
            dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
        });
        setEditingUserId(user.id);
    };

    const [openDialog, setOpenDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);


    const handleOpenDialog = (user) => {
        setUserToDelete(user);  // Store the user to delete
        setOpenDialog(true);  // Open the dialog
    };


    const handleCloseDialog = () => {
        setOpenDialog(false); // Close the dialog
        setUserToDelete(null); // Clear the user to delete
    };

    const handleDeleteConfirmed = () => {
        const updatedUsers = users.filter(user => user.id !== userToDelete.id);
        setUsers(updatedUsers);
        localStorage.setItem('usersData', JSON.stringify(updatedUsers));
        handleCloseDialog();  // Close dialog after deleting
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="container mx-auto my-20 p-6 bg-gradient-to-br from-indigo-100 to-pink-100 bg-gray-50 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Register Here!</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            className='w-full'
                            id="firstName"
                            label="First Name"
                            variant="outlined"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            error={errors.firstName}
                            helperText={errors.firstName ? 'First Name is required' : ''}
                        />
                        <TextField
                            className='w-full'
                            id="lastName"
                            label="Last Name"
                            variant="outlined"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            error={errors.lastName}
                            helperText={errors.lastName ? 'Last Name is required' : ''}
                        />
                        <TextField
                            className='w-full'
                            id="age"
                            label="Age"
                            type="number"
                            variant="outlined"
                            value={formData.age}
                            onChange={handleInputChange}
                            error={errors.age}
                            helperText={errors.age ? 'Age must be greater than 0' : ''}
                        />
                        <DatePicker
                            className='w-full'
                            label="Date of Birth"
                            value={formData.dateOfBirth}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                        />

                        <FormControl className='w-full' error={errors.gender}>
                            <InputLabel id="gender-select-label">Gender</InputLabel>
                            <Select
                                labelId="gender-select-label"
                                id="gender-select"
                                value={formData.gender}
                                onChange={handleGenderChange}
                                label="Gender"
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Others">Others</MenuItem>
                            </Select>
                            {errors.gender && <p style={{ color: 'red' }}>Gender is required</p>}
                        </FormControl>
                        <FormControl error={errors.hobbies} className='w-full' sx={{ marginLeft: '5px' }}>
                            <FormLabel sx={{ color: 'black' }}>Hobbies</FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={formData.hobbies.includes('Swimming')} onChange={handleCheckboxChange} />}
                                    label="Swimming"
                                    value="Swimming"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={formData.hobbies.includes('Gymming')} onChange={handleCheckboxChange} />}
                                    label="Gymming"
                                    value="Gymming"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={formData.hobbies.includes('Gaming')} onChange={handleCheckboxChange} />}
                                    label="Gaming"
                                    value="Gaming"
                                />
                            </FormGroup>
                            {errors.hobbies && <p style={{ color: 'red' }}>At least one hobby is required</p>}
                        </FormControl>
                        <TextField
                            className='w-full'
                            id="address"
                            label="Address"
                            variant="outlined"
                            value={formData.address}
                            onChange={handleInputChange}
                            error={errors.address}
                            helperText={errors.address ? 'Address is required' : ''}
                        />
                        <TextField
                            className='w-full'
                            id="city"
                            label="City"
                            variant="outlined"
                            value={formData.city}
                            onChange={handleInputChange}
                            error={errors.city}
                            helperText={errors.city ? 'City is required' : ''}
                        />
                        <TextField
                            className='w-full'
                            id="pincode"
                            label="Pincode"
                            type="number"
                            variant="outlined"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            error={errors.pincode}
                            helperText={errors.pincode ? 'Pincode must be 6 digits' : ''}
                        />
                    </div>
                    <Button variant="contained" color="primary" type="submit" sx={{
                        marginTop: '16px',
                        borderRadius: '20px',
                        backgroundColor: '#6b46c1',
                        '&:hover': {
                            backgroundColor: '#553c9a',
                        },
                        transition: 'background-color 0.3s',
                    }}>
                        {editingUserId ? 'Save' : 'Submit'}
                    </Button>
                </form>
            </div>

            <div className="mx-5 my-5 sm:mx-28 sm:my-5 ">
                <h3 className="text-2xl mb-4 font-semibold">👥 User Entries</h3>
                {users.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {users.map(user => (
                            <div key={user.id} className="bg-gradient-to-br from-indigo-100 to-pink-100 shadow-lg rounded-lg p-4 border border-gray-300 transition-transform transform hover:scale-105">
                                <h4 className="text-lg font-bold mb-2 text-center">{user.firstName} {user.lastName}</h4>
                                <div className="p-2">
                                    <p className="text-gray-700"><strong>Age:</strong> {user.age}</p>
                                    <p className="text-gray-700"><strong>Gender:</strong> {user.gender}</p>
                                    <p className="text-gray-700"><strong>Hobbies:</strong> {user.hobbies.join(', ')}</p>
                                    <p className="text-gray-700"><strong>Address:</strong> {user.address}</p>
                                    <p className="text-gray-700"><strong>City:</strong> {user.city}</p>
                                    <p className="text-gray-700"><strong>Pincode:</strong> {user.pincode}</p>
                                </div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleEdit(user)}
                                    startIcon={<EditIcon />}
                                    sx={{ marginTop: '8px', marginLeft: '8px' }}
                                >
                                    Edit
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleOpenDialog(user)}
                                    startIcon={<DeleteIcon />}
                                    sx={{ marginTop: '8px', marginLeft: '8px' }}
                                >
                                    Delete
                                </Button>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center">No entries found</p>
                )}

                {/* Dialog Box */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong> from the list?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirmed} color="secondary" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </LocalizationProvider>
    );
};

export default Add;
