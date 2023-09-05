import React from "react";
import { useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

function LabImport() {
    const lab = useLocation().state['lab'];
    const user = localStorage.getItem('authToken')
        ? jwt_decode(localStorage.getItem('authToken'))['username']
        : null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('file');
        if (!fileInput.files[0]) {
        alert('Please select an Excel file');
        return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('lab', lab);

        try {
        const response = await fetch('http://localhost:8000/api/ldap/lab/excel/import/', {
            method: 'POST',
            headers: {
            // No need for Content-Type when sending FormData
            // 'Content-Type': 'application/json',
            },
            body: formData,
        });

        if (response.status === 200) {
            alert('Excel added successfully');
            window.location.reload();
        } else {
            alert('Excel create error');
        }
        } catch (error) {
        console.error('Error adding Excel:', error);
        alert('An error occurred while adding Excel');
        }
    };
    return (
        <div>
          <h1>Add Excel</h1>
          <form onSubmit={handleSubmit}>
            <label>Excel: </label>
            <input type="file" name="file" id="file" />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>
      );
}
export default LabImport;