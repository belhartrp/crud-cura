// src/pages/Report.jsx
import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Table, Form, Row, Col, Card, Button } from "react-bootstrap";
import { ReportContext } from "../contexts/ReportContext";

const categoryColors = {
  macet: "orange",
  kecelakaan: "red",
  banjir: "blue",
  kebakaran: "darkred",
  demo: "purple",
};

const getIcon = (category) =>
  new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${categoryColors[category] || "gray"}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const ClickMarker = ({ setSelectedPos }) => {
  useMapEvents({
    click(e) {
      setSelectedPos([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const fetchAddress = async (lat, lng) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await res.json();
    return data.address?.village || data.address?.town || data.address?.city || data.address?.county || "";
  } catch {
    return "";
  }
};

const trustLevels = [
  { level: 1, maxReports: 2 },
  { level: 2, maxReports: 5 },
  { level: 3, maxReports: 8 },
  { level: 4, maxReports: 12 },
];

const Report = () => {
  const { reports, addReport, updateReport, deleteReport } = useContext(ReportContext);

  const [selectedPos, setSelectedPos] = useState(null);
  const [formData, setFormData] = useState({ address: "", category: "macet", description: "", image: null });
  const [editingId, setEditingId] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [trustLevel, setTrustLevel] = useState(1);

  // Ambil trust level user dari localStorage
  useEffect(() => {
    const storedTrust = localStorage.getItem('trustLevel');
    setTrustLevel(parseInt(storedTrust) || 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedPos) return;
    const [lat, lng] = selectedPos;
    fetchAddress(lat, lng).then((addr) => setFormData((prev) => ({ ...prev, address: addr })));
  }, [selectedPos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPos || !formData.category || !formData.description) return alert("Semua field wajib diisi");

    const activeUserReports = reports.filter(r => !r.expired);
    const maxAllowed = trustLevels.find(t => t.level === trustLevel)?.maxReports || 2;

    if (!editingId && activeUserReports.length >= maxAllowed) {
      return alert(`Tingkat kepercayaan Anda hanya boleh membuat maksimal ${maxAllowed} laporan aktif.`);
    }

    const newReport = {
      id: editingId || Date.now(),
      location: `${selectedPos[0]},${selectedPos[1]}`,
      address: formData.address,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      expired: false,
    };

    if (editingId) {
      updateReport(editingId, newReport);
    } else {
      addReport(newReport);
    }

    setFormData({ address: "", category: "macet", description: "", image: null });
    setSelectedPos(null);
    setEditingId(null);
  };

  const handleRowClick = (r) => {
    setEditingId(r.id);
    const [lat, lng] = r.location.split(",");
    setSelectedPos([parseFloat(lat), parseFloat(lng)]);
    setFormData({ address: r.address, category: r.category, description: r.description, image: r.image });
  };

  const activeReports = reports.filter((r) => !r.expired);

  return (
    <div className="container my-3">
      <Row>
        <Col lg={8} className="mb-3">
          <Card>
            <Card.Header>Map</Card.Header>
            <Card.Body style={{ padding: 0 }}>
              <MapContainer center={[-6.2, 106.816]} zoom={12} style={{ height: "500px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors"/>
                {activeReports.map((r) => {
                  const [lat, lng] = r.location.split(",").map(Number);
                  return (
                    <Marker key={r.id} position={[lat, lng]} icon={getIcon(r.category)}>
                      <Popup>
                        <strong>{r.category}</strong>
                        <p>{r.description}</p>
                        <small>{r.address}</small>
                      </Popup>
                    </Marker>
                  );
                })}
                <ClickMarker setSelectedPos={setSelectedPos} />
              </MapContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-3">
            <Card.Header>Form Laporan</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Titik Koordinat</Form.Label>
                  <Form.Control type="text" value={selectedPos ? `${selectedPos[0].toFixed(5)}, ${selectedPos[1].toFixed(5)}` : ""} readOnly/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Alamat (Desa/Kota)</Form.Label>
                  <Form.Control type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="macet">Macet</option>
                    <option value="kecelakaan">Kecelakaan</option>
                    <option value="banjir">Banjir</option>
                    <option value="kebakaran">Kebakaran</option>
                    <option value="demo">Demo</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control as="textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Gambar</Form.Label>
                  <Form.Control type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}/>
                </Form.Group>
                <Button type="submit" variant={editingId ? "warning" : "primary"} className="w-100">{editingId ? "Edit" : "Submit"}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>Data Laporan</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Koordinat</th>
                    <th>Alamat</th>
                    <th>Kategori</th>
                    <th>Deskripsi</th>
                    <th>Like</th>
                    <th>Dislike</th>
                    <th>Hitung Mundur</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {activeReports.map((r) => {
                    const remaining = Math.max(0, 120 - Math.floor((now - r.timestamp) / 1000));
                    return (
                      <tr key={r.id} onClick={() => handleRowClick(r)} style={{ cursor: "pointer" }}>
                        <td>{r.id}</td>
                        <td>{r.location}</td>
                        <td>{r.address}</td>
                        <td>{r.category}</td>
                        <td>{r.description}</td>
                        <td>{r.likes}</td>
                        <td>{r.dislikes}</td>
                        <td>{remaining}s</td>
                        <td>
                          <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); deleteReport(r.id); }}>🗑️</Button>
                        </td>
                      </tr>
                    );
                  })}
                  {activeReports.length === 0 && (
                    <tr><td colSpan="9" className="text-center">Tidak ada data aktif</td></tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Report;
