// Gallery Page JavaScript - Simple Tab System

document.addEventListener('DOMContentLoaded', function() {
    console.log('Gallery page loaded');
    
    // Get all filter buttons and gallery items
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    console.log('Found filter buttons:', filterButtons.length);
    console.log('Found gallery items:', galleryItems.length);
    
    // Simple filter function
    function filterItems(category) {
        console.log('Filtering by:', category);
        
        galleryItems.forEach(item => {
            const dataCategory = item.getAttribute('data-category');
            
            if (category === 'all' || dataCategory === category) {
                item.style.display = 'block';
                console.log('Showing item with category:', dataCategory);
            } else {
                item.style.display = 'none';
                console.log('Hiding item with category:', dataCategory);
            }
        });
    }
    
    // Add click events to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent);
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the filter category
            const category = this.getAttribute('data-filter');
            console.log('Filter category:', category);
            
            // Filter the items
            filterItems(category);
        });
    });
    
    // Initialize with "all" filter
    filterItems('all');
    
    // Gallery item click functionality
    const galleryItemsContainers = document.querySelectorAll('.gallery-item');
    
    galleryItemsContainers.forEach(item => {
        item.addEventListener('click', function() {
            const image = this.querySelector('.gallery-image');
            const title = this.querySelector('.overlay-content h3');
            const description = this.querySelector('.overlay-content p');
            
            // Create modal or lightbox functionality
            showImageModal({
                src: image.src,
                alt: image.alt,
                title: title ? title.textContent : '',
                description: description ? description.textContent : ''
            });
        });
    });
    
    // Image modal/lightbox functionality
    function showImageModal(imageData) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'image-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="image-modal">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <div class="modal-content">
                    <img src="${imageData.src}" alt="${imageData.alt}" class="modal-image">
                    <div class="modal-info">
                        <h3>${imageData.title}</h3>
                        <p>${imageData.description}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const modalStyles = `
            <style>
                .image-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    padding: 20px;
                    animation: fadeIn 0.3s ease;
                }
                
                .image-modal {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    background: #1a1a1a;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                    animation: slideIn 0.3s ease;
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 24px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10001;
                    transition: background 0.3s ease;
                }
                
                .modal-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                .modal-content {
                    display: flex;
                    flex-direction: column;
                }
                
                .modal-image {
                    width: 100%;
                    height: auto;
                    max-height: 70vh;
                    object-fit: contain;
                }
                
                .modal-info {
                    padding: 20px;
                    text-align: center;
                }
                
                .modal-info h3 {
                    color: #ffffff;
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                
                .modal-info p {
                    color: #cccccc;
                    font-size: 16px;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    .image-modal {
                        max-width: 95vw;
                        max-height: 95vh;
                    }
                    
                    .modal-info h3 {
                        font-size: 20px;
                    }
                    
                    .modal-info p {
                        font-size: 14px;
                    }
                }
            </style>
        `;
        
        // Add styles to head
        const styleSheet = document.createElement('style');
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
        
        // Add modal to body
        document.body.appendChild(modalOverlay);
        
        // Close modal functionality
        const closeBtn = modalOverlay.querySelector('.modal-close');
        closeBtn.addEventListener('click', closeModal);
        
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
        
        function closeModal() {
            modalOverlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
                document.head.removeChild(styleSheet);
            }, 300);
        }
    }
    
    // Lazy loading for gallery images
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    galleryImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Add hover effects for desktop users
    if (!('ontouchstart' in window)) {
        galleryItemsContainers.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
});

// Add CSS for fade-out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);