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
                [id]: !isAlphabetic || value === '', // Set error if not alphabetic or empty
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
            <div className="container mx-auto my-10 p-6 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-lg shadow-lg max-w-5xl">
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
                        <FormControl error={errors.hobbies} className='w-full'>
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
                            variant="outlined"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            error={errors.pincode}
                            helperText={errors.pincode ? 'Pincode must be 6 digits' : ''}
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <Button
                            className="bg-fuchsia-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            variant="contained"
                        >
                            {editingUserId ? 'Update' : 'Register'}
                        </Button>
                    </div>
                </form>

                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-center mb-4">Users List</h2>
                    {users.length > 0 ? (
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">First Name</th>
                                    <th className="border px-4 py-2">Last Name</th>
                                    <th className="border px-4 py-2">Age</th>
                                    <th className="border px-4 py-2">Gender</th>
                                    <th className="border px-4 py-2">Date of Birth</th>
                                    <th className="border px-4 py-2">Hobbies</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="border px-4 py-2">{user.firstName}</td>
                                        <td className="border px-4 py-2">{user.lastName}</td>
                                        <td className="border px-4 py-2">{user.age}</td>
                                        <td className="border px-4 py-2">{user.gender}</td>
                                        <td className="border px-4 py-2">{user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : ''}</td>
                                        <td className="border px-4 py-2">{user.hobbies.join(', ')}</td>
                                        <td className="border px-4 py-2 flex space-x-4">
                                            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEdit(user)}>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleOpenDialog(user)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center">No users found</p>
                    )}
                </div>

                {/* Confirmation dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}>
                    <DialogTitle>{"Confirm Delete"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirmed} color="error" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </LocalizationProvider>
    );
};

export default Add;
