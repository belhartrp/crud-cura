import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Modal, Form, ProgressBar } from 'react-bootstrap';
import { ReportContext } from '../contexts/ReportContext';

const trustLevels = [
  { level: 1, name: 'Rendah', minScore: 0 },
  { level: 2, name: 'Sedang', minScore: 5 },
  { level: 3, name: 'Tinggi', minScore: 15 },
  { level: 4, name: 'Sangat Tinggi', minScore: 30 },
];

const Profile = () => {
  const { reports } = useContext(ReportContext);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [trustScore, setTrustScore] = useState(0);
  const [trustLevel, setTrustLevel] = useState(1);

  // Load nama dari localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setName(storedName);
    } else {
      setShowModal(true);
    }
  }, []);

  // Hitung trustScore berdasarkan laporan selesai
  useEffect(() => {
    const userReports = reports.filter(r => r.user === name); // pastikan setiap laporan punya field user
    let totalLikes = 0;
    let totalReportsSelesai = 0;

    userReports.forEach(r => {
      if (r.expired) {
        if (r.likes > r.dislikes) {
          totalReportsSelesai += 1; // laporan berhasil
        }
        totalLikes += r.likes;
      }
    });

    const score = totalLikes + totalReportsSelesai;
    setTrustScore(score);

    // Tentukan level
    const level = [...trustLevels].reverse().find(l => score >= l.minScore)?.level || 1;
    setTrustLevel(level);
  }, [reports, name]);

  const handleSave = () => {
    if (!name.trim()) return alert('Tolong isi nama Anda!');
    setShowModal(false);
    localStorage.setItem('userName', name);
  };

  return (
    <Container className="my-4">
      <h2>Profil Pengguna</h2>

      <Card className="mt-3 p-3 shadow-sm">
        <Card.Body>
          <h4>Nama: {name}</h4>
          <p>Tingkat Kepercayaan: <strong>{trustLevels.find(t => t.level === trustLevel)?.name}</strong></p>
          <p>Trust Score: {trustScore}</p>
          <ProgressBar now={(trustScore/30)*100} label={`${trustScore}`} />
          <p>Maksimal laporan aktif yang dapat dibuat: {trustLevel + 1}</p>
        </Card.Body>
      </Card>

      <Modal show={showModal} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>Masukkan Nama Anda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama..."
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
