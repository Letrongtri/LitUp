<template>
  <footer class="simple-footer">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="brand-section">
          <h3 class="footer-brand">LitUp!</h3>
          <p class="brand-description">Empowering education through technology</p>
        </div>
        
        <!-- Links Section -->
        <div class="footer-links">
          <div class="link-column">
            <h4>Platform</h4>
            <a href="#">Classrooms</a>
            <a href="#">Assignments</a>
            <a href="#">Resources</a>
            <a href="#">Dashboard</a>
          </div>
          
          <div class="link-column">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Community</a>
            <a href="#">FAQs</a>
          </div>
          
          <div class="link-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Careers</a>
          </div>
        </div>
      </div>
      
      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="copyright">
          <span>&copy; 2025 LitUp! All rights reserved.</span>
        </div>
        
        <div class="footer-meta">
          <span class="version">Version 1.0</span>
          <span class="separator">•</span>
          <span class="status">🟢 All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.simple-footer {
  background: #ffffff;
  border-top: 1px solid #dee2e6;
  margin-top: 4rem;
  padding: 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 1.5rem;
}

/* Main Footer Content */
.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 2.5rem;
}

/* Brand Section */
.brand-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-brand {
  font-size: 1.75rem;
  font-weight: 700;
  color: #007bff;
  margin: 0;
}

.brand-description {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

/* Links Section */
.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.link-column h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.link-column a {
  display: block;
  color: #6c757d;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 0.6rem;
  transition: color 0.2s ease;
}

.link-column a:hover {
  color: #007bff;
}

/* Footer Bottom */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
}

.copyright {
  color: #6c757d;
  font-size: 0.85rem;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: #6c757d;
}

.separator {
  color: #dee2e6;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Responsive Design */
@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 2rem 1rem 1.5rem;
  }
  
  .footer-content {
    gap: 2rem;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer-meta {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 1.5rem 0.75rem 1rem;
  }
  
  .footer-brand {
    font-size: 1.5rem;
  }
  
  .brand-description {
    font-size: 0.85rem;
  }
  
  .footer-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .separator {
    display: none;
  }
}
</style>