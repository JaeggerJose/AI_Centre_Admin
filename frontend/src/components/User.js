import React, { useState, useEffect} from 'react'
import { useLocation, Link } from 'react-router-dom'
import "./User.css";
import { Button, Col, Form, ListGroup, Row, FloatingLabel } from 'react-bootstrap';
import jwt_decode from "jwt-decode";
import ListNoteBook from './ListNoteBook';
function User() {
    let state = useLocation().state;
    let [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState({});
    let cpuUsage = 0;
    let memoryUsage = 0;
    let GPUUsage = 0;
    const [ userPermission ] = useState(() =>localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken'))['permission'] : null)
    useEffect(() => {
        getuserinfo();
    }, [state]);
    console.log(state)
    let getuserinfo = async () => {
        document.getElementsByClassName('userPage')[0].style.opacity = 0;

        fetch('/api/ldap/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username":state.user,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setTimeout(() => {
                setUser(data);
                setPermissions(data.permission);
                document.getElementById("editandsave").className = "btn btn-primary";
                document.getElementById("editandsave").innerHTML = "Edit";
            }, 400);
            setTimeout(() => {
                document.getElementsByClassName('userPage')[0].style.opacity = 1;
            }, 300);
        })
        .catch((error) => {
            console.error('Error:', error);
        }
        );
    }

    const deleteUser = async () => {
        if(!window.confirm("Are you sure you want to delete this user?")) return;
        let response = await fetch('/api/ldap/user/delete/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username":state.user,
            }),
        })
        if(response.status===200){
            alert('User deleted successfully');
            window.location.href = '/';
        }
        else {
            console.log('error');
        }
    }

    const editreadonly = async () => {
        if(document.getElementById("editandsave").innerHTML === "Edit"){
            document.getElementById("inputFirstName").readOnly = false;
            document.getElementById("inputLastName").readOnly = false;
            document.getElementById("inputEmail").readOnly = false;
            document.getElementById("cpuQuota").readOnly = false;
            document.getElementById("memQuota").readOnly = false;
            document.getElementById("gpuQuota").readOnly = false;
            document.getElementById("inputFirstName").style.backgroundColor = "#b4d9d7";
            document.getElementById("inputLastName").style.backgroundColor = "#b4d9d7";
            document.getElementById("inputEmail").style.backgroundColor = "#b4d9d7";
            document.getElementById("cpuQuota").style.backgroundColor = "#b4d9d7";
            document.getElementById("memQuota").style.backgroundColor = "#b4d9d7";
            document.getElementById("gpuQuota").style.backgroundColor = "#b4d9d7";

            if(userPermission && userPermission === "root"){
                let check = document.getElementsByClassName("form-check-input");
                for(let i=0; i<check.length; i++){
                    check[i].disabled = false;
                    check[i].style.backgroundColor = "#b4d9d7";
                }
            }
            document.getElementById("editandsave").innerHTML = "Save";
            document.getElementById("editandsave").className = "btn btn-success";
        }
        else if(document.getElementById("editandsave").innerHTML === "Save"){
            document.getElementById("inputFirstName").readOnly = true;
            document.getElementById("inputLastName").readOnly = true;
            document.getElementById("inputEmail").readOnly = true;
            document.getElementById("cpuQuota").readOnly = true;
            document.getElementById("memQuota").readOnly = true;
            document.getElementById("gpuQuota").readOnly = true;
            document.getElementById("inputFirstName").style.backgroundColor = "#fff";
            document.getElementById("inputLastName").style.backgroundColor = "#fff";
            document.getElementById("inputEmail").style.backgroundColor = "#fff";
            document.getElementById("cpuQuota").style.backgroundColor = "#fff";
            document.getElementById("memQuota").style.backgroundColor = "#fff";
            document.getElementById("gpuQuota").style.backgroundColor = "#fff";
            if(userPermission && userPermission === "root"){
            let check = document.getElementsByClassName("form-check-input");
                for(let i=0; i<check.length; i++){
                    check[i].disabled = true;
                    check[i].style.backgroundColor = "#fff";
                }
            }

            document.getElementById("editandsave").innerHTML = "Edit";
            document.getElementById("editandsave").className = "btn btn-primary";
            // return the checked and unchecked group and group name
            let saveUser = () => {
                let check = document.getElementsByClassName("form-check-input");
                let group = [];
                for(let i=0; i<check.length; i++){
                    if(check[i].checked){
                        group.push({"groupname":check[i].id, "permission":"admin"});
                    } else {
                        group.push({"groupname":check[i].id, "permission":"user"});
                    }
                }
                return group;
            }
            console.log(saveUser());


            //saveUser();
            let response = await fetch('/api/user/change/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "username": document.getElementById("inputUsername").value,
                    "firstname": document.getElementById("inputFirstName").value,
                    "lastname": document.getElementById("inputLastName").value,
                    "email": document.getElementById("inputEmail").value,
                    "cpu_quota": document.getElementById("cpuQuota").value,
                    "mem_quota": document.getElementById("memQuota").value,
                    "gpu_quota": document.getElementById("gpuQuota").value,
                    "permission": saveUser(),
                }),
            });
            if (response.status===200) {
                alert('User information change successfully');
                window.location.href='/'
            } else {
                alert('Something wrong!!!')
            }

        }
    }

    return (
        <div className='userPage'>
                <h1>User {state && state.user}</h1><br/>
                <Form className='form-css' style={{boxShadow: "0px 0px 10px 0px #888888", padding: "20px", borderRadius: "12px", display:"flex", flexWrap:"wrap"}}>
                    <Form.Group as={Col} style={{width:"51%"}}>
                        <Form.Group as={Row} className="mb-3" style={{flexWrap: 'nowrap'}}>
                            <Form.Label column sm="2">
                                Username
                            </Form.Label>
                            <Col sm="10" style={{width:"100%"}}>
                                <Form.Control plaintext readOnly id="inputUsername" style={{width:"50%"}} defaultValue={user && user.username} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" style={{flexWrap: 'nowrap'}}>
                            <Form.Label column sm="2">
                                First Name
                            </Form.Label>
                            <Col sm="10" style={{width:"100%"}}>
                                <Form.Control plaintext readOnly id="inputFirstName" style={{width:"50%", border:"ridge 1px", borderRadius:"10px"}} defaultValue={user && user.first_name} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" style={{flexWrap: 'nowrap'}}>
                            <Form.Label column sm="2">
                                Last Name
                            </Form.Label>
                            <Col sm="10" style={{width:"100%"}}>
                                <Form.Control plaintext readOnly id="inputLastName" style={{width:"50%", border:"ridge 1px", borderRadius:"10px"}} defaultValue={user && user.last_name} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" style={{flexWrap: 'nowrap', width:"100%"}}>
                            <Form.Label column sm="2">
                                Email
                            </Form.Label>
                            <Col sm="10" style={{width:"100%"}}>
                                <Form.Control plaintext readOnly id="inputEmail" style={{width:"52%", border:"ridge 1px", borderRadius:"10px"}} defaultValue={user && user.email} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" style={{flexWrap: 'nowrap', width:"100%"}}>
                            CPU Usage
                            <FloatingLabel
                                controlId="floatingSelect"
                                label="CPU Quota"
                                className="mb-3"
                            >
                                <Form.Control type="number" id="cpuQuota" placeholder="Enter CPU Quota" min="0.5" max="8" defaultValue={cpuUsage} step="0.1" readOnly/>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" style={{flexWrap: 'nowrap', width:"100%"}}>
                            Memory Usage
                            <FloatingLabel
                            controlId="floatingSelect"
                            label="Memory Quota (GiB)"
                            className="mb-3"
                            >
                                <Form.Control type="number" id="memQuota" placeholder="Enter Memory Quota" min="1" defaultValue={memoryUsage} step="0.1" readOnly/>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" style={{flexWrap: 'nowrap', width:"100%"}}>
                            GPU Usage
                            <FloatingLabel
                            controlId="floatingSelect"
                            label="GPU Quota"
                            className="mb-3"
                            >
                                <Form.Select aria-label="Floating label select example" id="gpuQuota" defaultValue={GPUUsage} readOnly>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>
                    </Form.Group>
                    <Form.Group as={Col} style={{width:"50%"}}>
                        <Form.Group as={Row} className="mb-3" style={{flexWrap: 'nowrap', alignItems:"start"}}>
                            <Form.Label column sm="2" style={{width:"20%"}}>
                                Current Group:
                            </Form.Label>
                            <Form.Group as={Col} style={{width:"80%"}}>
                                <ListGroup>
                                { permissions && Object.keys(permissions).map((key, index) => {
                                    return (
                                        <ListGroup.Item key={index} style={{border:"none", padding:"0px", display:"flex", flexWrap:"nowrap", alignItems:"center", justifyContent:"space-evenly"}}>
                                            <Form.Label column sm="2" style={{width:"90%"}}>
                                                {permissions[key].groupname}
                                            </Form.Label>
                                            <Form.Check type="checkbox" defaultChecked={permissions[key].permission === "admin" ? true : false} disabled id={permissions[key].groupname} style={{width:"10%"}}/>
                                        </ListGroup.Item>
                                    )
                                })}
                                </ListGroup>
                        </Form.Group>

                    </Form.Group>
                    </Form.Group>
                </Form>
                <Button variant="primary" onClick={editreadonly} id='editandsave' className='buttom-button'>
                    Edit
                </Button>
                <Button variant="danger" onClick={deleteUser} className='buttom-button'>
                    Delete
                </Button>
                <Button variant='dark' className='buttom-button'>
                    {user? <Link to='/password' state={state} style={{textDecoration:"none", color:"#fff"}}>Change Password</Link>: null}
                </Button>
                <Button variant='warning' className='buttom-button' onClick={() => window.history.back()}> Cancel and Back</Button>
                <ListNoteBook user={state.user}/>
        </div>
    )
}
export default User
