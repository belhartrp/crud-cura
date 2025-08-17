// // // import React from 'react';
// // // import { Navbar, Nav, Container } from 'react-bootstrap';

// // // const NavbarCura = () => {
// // //   return (
// // //     <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
// // //       <Container>
// // //         <Navbar.Brand href="/">Cura</Navbar.Brand>
// // //         <Navbar.Toggle aria-controls="basic-navbar-nav" />
// // //         <Navbar.Collapse id="basic-navbar-nav">
// // //           <Nav className="ms-auto">
// // //             <Nav.Link href="/">Home</Nav.Link>
// // //             <Nav.Link href="/contributor">Contributor</Nav.Link>
// // //             <Nav.Link href="/seeker">Seeker</Nav.Link>
// // //           </Nav>
// // //         </Navbar.Collapse>
// // //       </Container>
// // //     </Navbar>
// // //   );
// // // };

// // // export default NavbarCura;


// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { Navbar, Nav, Container } from 'react-bootstrap';

// // const AppNavbar = () => {
// //   return (
// //     <Navbar bg="light" expand="lg">
// //       <Container>
// //         <Navbar.Brand href="/">Cura MVP</Navbar.Brand>
// //         <Navbar.Toggle aria-controls="basic-navbar-nav" />
// //         <Navbar.Collapse id="basic-navbar-nav">
// //           <Nav className="me-auto">
// //             <Nav.Link as={Link} to="/">Home</Nav.Link>
// //             <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
// //             <Nav.Link as={Link} to="/seeker">Seeker</Nav.Link>
// //             <Nav.Link as={Link} to="/contributor">Contributor</Nav.Link>
// //           </Nav>
// //         </Navbar.Collapse>
// //       </Container>
// //     </Navbar>
// //   );
// // };

// // export default AppNavbar;


// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import { Navbar, Nav, Container } from 'react-bootstrap';

// // const AppNavbar = () => {
// //   return (
// //     <Navbar bg="light" expand="lg">
// //       <Container>
// //         <Navbar.Brand as={Link} to="/profile">Cura MVP</Navbar.Brand>
// //         <Navbar.Toggle aria-controls="basic-navbar-nav" />
// //         <Navbar.Collapse id="basic-navbar-nav">
// //           <Nav className="me-auto">
// //             <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
// //           </Nav>
// //         </Navbar.Collapse>
// //       </Container>
// //     </Navbar>
// //   );
// // };

// // export default AppNavbar;

// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="bg-blue-600 text-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
//       <div className="text-2xl font-bold mb-2 sm:mb-0">
//         Cura
//       </div>
//       <div className="flex gap-4">
//         <Link
//           to="/"
//           className="hover:bg-blue-500 px-3 py-2 rounded transition duration-200"
//         >
//           Profile
//         </Link>
//         <Link
//           to="/report"
//           className="hover:bg-blue-500 px-3 py-2 rounded transition duration-200"
//         >
//           Report
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';

const Navbar = () => {
  return (
    <BSNavbar bg="primary" variant="dark" expand="md" className="mb-4">
      <Container>
        <BSNavbar.Brand as={Link} to="/">Cura</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/report">Report</Nav.Link>
            <Nav.Link as={Link} to="/seeker">Seeker</Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
