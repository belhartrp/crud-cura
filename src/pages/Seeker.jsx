import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Table, Form, Row, Col, Card, Button, Image } from "react-bootstrap";
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
    click(e) { setSelectedPos([e.latlng.lat, e.latlng.lng]); },
  });
  return null;
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
};

const Seeker = () => {
  const { reports, updateReport } = useContext(ReportContext);
  const [selectedPos, setSelectedPos] = useState(null);
  const [radius, setRadius] = useState(2);
  const [filterCity, setFilterCity] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    const activeReports = reports.filter(r => !r.expired);
    let filtered = [...activeReports];

    // Filter kota/alamat berlaku untuk seluruh data aktif
    if (filterCity.trim() !== "") {
      filtered = activeReports.filter(r =>
        r.address.toLowerCase().includes(filterCity.toLowerCase())
      );
    }
    // Jika kota/alamat kosong, baru filter radius jika ada titik dipilih
    else if (selectedPos) {
      filtered = activeReports.filter(r => {
        const [lat, lng] = r.location.split(",").map(Number);
        return getDistance(selectedPos[0], selectedPos[1], lat, lng) <= radius;
      });
    }

    setFilteredReports(filtered);
  }, [reports, selectedPos, radius, filterCity]);

  const handleLike = (id) => {
    const r = reports.find(r => r.id === id);
    if (r) updateReport(id, { likes: r.likes + 1 });
  };
  const handleDislike = (id) => {
    const r = reports.find(r => r.id === id);
    if (r) updateReport(id, { dislikes: r.dislikes + 1 });
  };

  return (
    <div className="container my-3">
      <Row>
        <Col lg={8} className="mb-3">
          <Card>
            <Card.Header>Map</Card.Header>
            <Card.Body style={{ padding: 0 }}>
              <MapContainer center={[-6.2,106.816]} zoom={12} style={{height:"500px", width:"100%"}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors"/>
                {filteredReports.map(r => {
                  const [lat,lng] = r.location.split(",").map(Number);
                  return (
                    <Marker key={r.id} position={[lat,lng]} icon={getIcon(r.category)}>
                      <Popup>
                        <strong>{r.category}</strong>
                        <p>{r.description}</p>
                        <small>{r.address}</small>
                        {r.image && <Image src={r.image} alt="Bukti" fluid className="mt-2"/>}
                      </Popup>
                    </Marker>
                  );
                })}
                {selectedPos && <Circle center={selectedPos} radius={radius*1000} color="blue"/>}
                <ClickMarker setSelectedPos={setSelectedPos}/>
              </MapContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>Filter Pencarian</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Titik Koordinat</Form.Label>
                <Form.Control type="text" value={selectedPos ? `${selectedPos[0].toFixed(5)}, ${selectedPos[1].toFixed(5)}` : ""} readOnly/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Radius (km)</Form.Label>
                <Form.Control type="number" min="0" value={radius} onChange={e=>setRadius(Number(e.target.value))}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Filter Kota/Alamat</Form.Label>
                <Form.Control type="text" value={filterCity} onChange={e=>setFilterCity(e.target.value)}/>
              </Form.Group>
              <Button variant="primary" onClick={()=>setSelectedPos(null)}>Reset Map</Button>
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
                    <th>Gambar</th>
                    <th>Like</th>
                    <th>Dislike</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.location}</td>
                      <td>{r.address}</td>
                      <td>{r.category}</td>
                      <td>{r.description}</td>
                      <td>{r.image ? <Image src={r.image} alt="Bukti" thumbnail style={{maxWidth:"100px"}}/> : "-"}</td>
                      <td><Button size="sm" variant="success" onClick={()=>handleLike(r.id)}>👍</Button> {r.likes}</td>
                      <td><Button size="sm" variant="danger" onClick={()=>handleDislike(r.id)}>👎</Button> {r.dislikes}</td>
                    </tr>
                  ))}
                  {filteredReports.length===0 && <tr><td colSpan="8" className="text-center">Tidak ada data</td></tr>}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Seeker;
