import React, { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";
import './User.css'
import { Button } from 'react-bootstrap';
function AddUser() {
    const [lab, setLab] = useState([]);
    const [user] = useState(() =>localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken'))['username'] : null);

    useEffect(() => {
        fetch('http://120.126.23.245:31190/api/ldap/lab/list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user": user,
            }),
        })
        .then(response => response.json())
        .then(data => setLab(data))
        .catch((error) => {
            console.error('Error:', error);
        }
        );
    }, []);

    let handleSubmit = async(e) => {
        e.preventDefault();
        if(e.target[6].value===e.target[7].value){
            let response = await fetch('http://120.126.23.245:31190/api/ldap/user/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "first_name":e.target[0].value,
                    "last_name":e.target[1].value,
                    "username":e.target[2].value,
                    "email":e.target[3].value,
                    "lab":e.target[4].value,
                    "is_lab_manager": e.target[5].checked,
                    "password":e.target[6].value,
                }),
            });
            if(response.status===200){
                alert('User added successfully');
                window.location.reload();
            } else {
                alert('User create error');
            }
        } else {
            alert('Passwords do not match');
        }
    }

    return (
        <div style={{fontFamily: "Comic Sans MS"}}>
            <h1>Add User</h1><br></br>
            <form onSubmit={handleSubmit} style={{display: "inline-flex", alignItems: "flex-start"}}>
                <div className='form-div'><label className='form-label'>First Name:   </label><input type="text" placeholder="Please enter the first name" /></div><br/>
                <div className='form-div'><label className='form-label'>Last Name:   </label><input type="text" placeholder="Please enter the last name" /></div><br/>
                <div className='form-div'><label className='form-label'>Username:   </label><input type="text" placeholder="Please enter the username" /></div><br/>
                <div className='form-div'><label className='form-label'>Email:   </label><input type="text" placeholder="Please enter the email" /></div><br/>
                <div className='form-div'><label className='form-label'>In which labatory:   </label>{lab && <select>
                    {lab.map((lab) => (
                        <option key={lab} value={lab}>
                            {lab}
                        </option>
                    ))}
                </select>}</div><br/>
                <div className='form-div'><label className='form-label'>Is Lab Manager:   <input type="checkbox"/></label></div><br/>
                <div className='form-div'><label className='form-label'>Password:   </label><input type="text" placeholder="Please enter the password" /></div><br/>
                <div className='form-div'><label className='form-label'>Confirm Password:   </label><input type="text" placeholder="Please enter the password again" /></div><br/>
            </form>
            <br/>
            <Button>Submit</Button>

        </div>
    )
}

export default AddUser