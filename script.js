// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.body = document.body;
        this.header = document.querySelector('header');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Handle navigation background based on scroll position
        this.handleNavigationBackground();
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        if (theme === 'light') {
            this.themeIcon.className = 'bx bx-moon';
        } else {
            this.themeIcon.className = 'bx bx-sun';
        }
        
        // Update navigation background based on theme and scroll position
        this.updateNavigationBackground();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    updateNavigationBackground() {
        const scrollPos = window.scrollY;
        
        if (this.currentTheme === 'light') {
            // In light mode, navigation should always be white with border and same padding as sticky
            this.header.style.background = '#ffffff';
            this.header.style.borderBottom = '1px solid #e0e0e0';
            this.header.style.padding = '12px 15%';
            this.header.classList.remove('sticky');
        } else {
            // In dark mode, use original sticky behavior with background
            if (scrollPos > 100) {
                this.header.classList.add('sticky');
            } else {
                this.header.classList.remove('sticky');
            }
            // Reset inline styles for dark mode to use CSS sticky behavior
            this.header.style.background = '';
            this.header.style.borderBottom = '';
            this.header.style.padding = '';
        }
    }
    
    handleNavigationBackground() {
        window.addEventListener('scroll', () => {
            this.updateNavigationBackground();
        });
    }
}

// Editable About Section Functionality
class AboutEditor {
    constructor() {
        this.editBtn = document.getElementById('edit-about');
        this.saveBtn = document.getElementById('save-about');
        this.cancelBtn = document.getElementById('cancel-edit');
        this.editControls = document.getElementById('edit-controls');
        this.aboutTitle = document.getElementById('about-title');
        this.aboutDescription = document.getElementById('about-description');
        
        this.originalTitle = '';
        this.originalDescription = '';
        this.isEditing = false;
        
        this.init();
    }
    
    init() {
        // Load saved content from localStorage
        this.loadSavedContent();
        
        // Add event listeners
        this.editBtn.addEventListener('click', () => {
            this.startEditing();
        });
        
        this.saveBtn.addEventListener('click', () => {
            this.saveChanges();
        });
        
        this.cancelBtn.addEventListener('click', () => {
            this.cancelEditing();
        });
        
        // Save content on Enter key (for title)
        this.aboutTitle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveChanges();
            }
        });
        
        // Save content on Ctrl+Enter (for description)
        this.aboutDescription.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.saveChanges();
            }
        });
    }
    
    loadSavedContent() {
        const savedTitle = localStorage.getItem('aboutTitle');
        const savedDescription = localStorage.getItem('aboutDescription');
        
        if (savedTitle) {
            this.aboutTitle.textContent = savedTitle;
        }
        if (savedDescription) {
            this.aboutDescription.textContent = savedDescription;
        }
    }
    
    startEditing() {
        if (this.isEditing) return;
        
        this.isEditing = true;
        
        // Store original content
        this.originalTitle = this.aboutTitle.textContent;
        this.originalDescription = this.aboutDescription.textContent;
        
        // Make content editable
        this.aboutTitle.contentEditable = true;
        this.aboutDescription.contentEditable = true;
        
        // Show edit controls
        this.editControls.style.display = 'flex';
        
        // Hide edit button
        this.editBtn.style.display = 'none';
        
        // Focus on title
        this.aboutTitle.focus();
        
        // Add visual feedback
        this.aboutTitle.style.outline = '2px solid var(--main-color)';
        this.aboutDescription.style.outline = '2px solid var(--main-color)';
    }
    
    saveChanges() {
        if (!this.isEditing) return;
        
        // Get new content
        const newTitle = this.aboutTitle.textContent.trim();
        const newDescription = this.aboutDescription.textContent.trim();
        
        // Validate content
        if (!newTitle || !newDescription) {
            alert('Please fill in both title and description.');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('aboutTitle', newTitle);
        localStorage.setItem('aboutDescription', newDescription);
        
        // Exit edit mode
        this.exitEditMode();
        
        // Show success message
        this.showMessage('Changes saved successfully!', 'success');
    }
    
    cancelEditing() {
        if (!this.isEditing) return;
        
        // Restore original content
        this.aboutTitle.textContent = this.originalTitle;
        this.aboutDescription.textContent = this.originalDescription;
        
        // Exit edit mode
        this.exitEditMode();
        
        // Show cancel message
        this.showMessage('Changes cancelled.', 'info');
    }
    
    exitEditMode() {
        this.isEditing = false;
        
        // Make content non-editable
        this.aboutTitle.contentEditable = false;
        this.aboutDescription.contentEditable = false;
        
        // Hide edit controls
        this.editControls.style.display = 'none';
        
        // Show edit button
        this.editBtn.style.display = 'flex';
        
        // Remove visual feedback
        this.aboutTitle.style.outline = 'none';
        this.aboutDescription.style.outline = 'none';
    }
    
    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transition: all 0.3s ease;
            transform: translateX(100%);
        `;
        
        // Set background color based on type
        if (type === 'success') {
            messageEl.style.background = '#4CAF50';
        } else if (type === 'info') {
            messageEl.style.background = '#2196F3';
        }
        
        // Add to page
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }
}

// Navigation Active Link Functionality
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.navlist a[href^="#"]');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        // Add scroll event listener
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
        
        // Add smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Initialize active link on page load
        this.updateActiveNavLink();
    }
    
    updateActiveNavLink() {
        const scrollPos = window.scrollY + 100; // Offset for better detection
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.navlist a[href="#${sectionId}"]`);
            
            // Check if current scroll position is within this section
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                this.navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current section's link
                if (navLink) navLink.classList.add('active');
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    new ThemeManager();
    
    // Initialize about editor
    new AboutEditor();
    
    // Initialize navigation manager
    new NavigationManager();
});
