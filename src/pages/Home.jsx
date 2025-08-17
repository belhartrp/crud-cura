// src/pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ReportContext } from '../contexts/ReportContext';
import { Card, ProgressBar } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaWhatsapp, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

// Warna kategori
const categoryColors = {
  macet: 'orange',
  kecelakaan: 'red',
  banjir: 'blue',
  kebakaran: 'darkred',
  demo: 'purple',
};

const Home = () => {
  const { reports } = useContext(ReportContext);

  // Ambil hanya laporan aktif
  const activeReports = reports.filter(r => !r.expired);

  // Statistik per kategori
  const stats = activeReports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {});

  const totalReports = activeReports.length;

  // Ambil 5 laporan terbaru
  const latestReports = [...activeReports].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  return (
    <div className="container my-4 px-3">

      {/* Header */}
      <div className="text-center mb-5 p-4 bg-light rounded shadow-sm">
        <h1 className="display-5 fw-bold">Selamat Datang di Cura</h1>
        <p className="lead mb-3">Aplikasi laporan kendala lalu lintas secara realtime.</p>
        <p className="text-muted">Laporkan masalah, lihat laporan terkini, dan bantu komunitas tetap aman dari informasi hoax!</p>
      </div>

      {/* Navigasi Cepat */}
      <div className="row mb-5 text-center">
        <div className="col-md-4 mb-3">
          <Link to="/report" className="text-decoration-none">
            <Card className="shadow-sm p-3 hover-card h-100">
              <h4>📣 Laporkan Kendala</h4>
              <p className="text-muted">Laporkan kendala lalu lintas di lokasi Anda dengan cepat dan mudah.</p>
            </Card>
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/seeker" className="text-decoration-none">
            <Card className="shadow-sm p-3 hover-card h-100">
              <h4>🔍 Cari Laporan</h4>
              <p className="text-muted">Cari laporan berdasarkan lokasi, radius, atau kata kunci.</p>
            </Card>
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/profile" className="text-decoration-none">
            <Card className="shadow-sm p-3 hover-card h-100">
              <h4>👤 Profil Saya</h4>
              <p className="text-muted">Lihat tingkat kepercayaan Anda dan perbarui informasi profil.</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Ringkasan Laporan Terbaru */}
      <div className="mb-5">
        <h3 className="mb-3">Laporan Terbaru</h3>
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Kategori</th>
                <th>Lokasi</th>
                <th>Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {latestReports.map((report, idx) => (
                <tr key={report.id}>
                  <td>{idx + 1}</td>
                  <td style={{ color: categoryColors[report.category] || 'black', fontWeight: 'bold' }}>
                    {report.category.toUpperCase()}
                  </td>
                  <td>{report.address || report.location}</td>
                  <td>{report.description}</td>
                </tr>
              ))}
              {latestReports.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">Belum ada laporan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistik Laporan */}
      <div className="mb-5">
        <h3 className="mb-3">Statistik Laporan</h3>
        <div className="row">
          {Object.keys(categoryColors).map((category) => {
            const count = stats[category] || 0;
            const percentage = totalReports ? Math.round((count / totalReports) * 100) : 0;
            return (
              <div className="col-md-3 mb-3" key={category}>
                <Card className="shadow-sm p-3 h-100">
                  <h5 className="text-capitalize">{category}</h5>
                  <p className="fs-4 fw-bold">{count}</p>
                  <ProgressBar now={percentage} label={`${percentage}%`} variant="info" />
                </Card>
              </div>
            );
          })}
          {totalReports === 0 && <p className="text-center">Belum ada laporan</p>}
        </div>
      </div>

      {/* Footer Modern */}
      <footer className="bg-dark text-white py-5 mt-5">
        <div className="container">
          <div className="row">

            <div className="col-md-4 mb-3">
              <h5 className="fw-bold">Cura</h5>
              <p>Aplikasi laporan kendala lalu lintas secara realtime.</p>
            </div>

            <div className="col-md-4 mb-3">
              <h5 className="fw-bold">Kontak</h5>
              <p><FaEnvelope /> <a href="mailto:belhartrpb@gmail.com" className="text-white">belhartrpb@gmail.com</a></p>
              <p><FaPhone /> <a href="tel:+6282274316431" className="text-white">+62 822 7431 6431</a></p>
              <p><FaWhatsapp /> <a href="https://wa.me/6282274316435" className="text-white">082274316435</a></p>
            </div>

            <div className="col-md-4 mb-3">
              <h5 className="fw-bold">Media Sosial</h5>
              <p><FaInstagram /> <a href="https://www.instagram.com/belhart.rp" className="text-white">@belhart.rp</a></p>
              <p><FaLinkedin /> <a href="https://www.linkedin.com/in/belhart-rajesky-pasaribu" className="text-white">LinkedIn</a></p>
              <p><FaGithub /> <a href="https://github.com/belhartrp" className="text-white">GitHub</a></p>
            </div>

          </div>
          <div className="text-center mt-3 border-top pt-3 text-muted">
            &copy; {new Date().getFullYear()} Cura. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
