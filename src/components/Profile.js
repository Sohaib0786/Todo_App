// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-HmAlYRaMiTx6PqSGcL9ifkAFxWHVPvhiHQ&s';

const Profile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || '');
        setProfileImage(data.profileImage || '');
      } else {
        await setDoc(userRef, {
          email: user.email,
          username: '',
          profileImage: '',
        });
      }
    };

    fetchData();
  }, [user]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleSave = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    let imageUrl = profileImage;

    try {
      // Delete existing image if new one is selected
      if (file) {
        const imageRef = ref(storage, `profileImages/${user.uid}`);
        if (profileImage) {
          try {
            await deleteObject(imageRef);
          } catch (err) {
            console.warn('No existing image to delete or permission denied:', err.message);
          }
        }

        await uploadBytes(imageRef, file);
        imageUrl = await getDownloadURL(imageRef);
        setProfileImage(imageUrl);
      }

      await updateDoc(userRef, {
        username,
        profileImage: imageUrl,
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile.');
    }
  };

  const handleDeleteImage = async () => {
    if (!user || !profileImage) return;

    try {
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await deleteObject(imageRef);
      await updateDoc(doc(db, 'users', user.uid), {
        profileImage: '',
      });
      setProfileImage('');
      alert('Profile image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error.message);
      alert('Failed to delete image.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="container mt-4 bg-light border p-4 rounded shadow" style={{ maxWidth: '500px' }}>
        <h3 className="mb-4 text-center">Profile</h3>

        <div className="text-center mb-3">
          <img
            src={profileImage || DEFAULT_IMAGE}
            alt="Profile"
            className="rounded-circle"
            width="100"
            height="100"
          />
        </div>

        {profileImage && (
          <div className="text-center mb-3">
            <button className="btn btn-sm btn-outline-danger" onClick={handleDeleteImage}>
              Delete Profile Image
            </button>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="text" className="form-control" value={email} disabled />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="profilePhoto" className="form-label">Profile Photo</label>
          <input
            type="file"
            id="profilePhoto"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

          <br></br>
        

        {/* Bottom Navigation */}
        <div className="border-top d-flex justify-content-around py-2 bg-light mt-5">
          <div className="text-center" onClick={() => navigate('/todo')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-list-task fs-5"></i><br />
            <span className="small">To-Do</span>
          </div>
          <div className="text-center" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <i className="bi bi-person fs-5"></i><br />
            <span className="small">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
