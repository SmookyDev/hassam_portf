class ProjectCard {
    constructor(project) {
        this.project = project;
    }

    render() {
        return `
            <li class="ts-image-link image-link group md:contents-right cursor-pointer" data-project-id="${this.project.id}">
                <div class="flex flex-col gap-4 border-t border-silver md:flex-row md:gap-16 md:border-none md:pl-[10%] transition-all duration-300 hover:bg-gray-100 hover:bg-opacity-5 p-4 md:p-0 rounded-lg md:rounded-none">
                    <div class="flex md:hidden justify-between pt-3 transition-colors duration-300">
                        <span>(${this.project.number})</span>
                        <span class="font-serif-en">${this.project.year}</span>
                    </div>
                    <div class="flex-1 md:pt-3 md:border-t border-silver flex flex-col relative z-10 order-2 md:order-1 transition-colors duration-300">
                        <div class="hidden justify-between md:flex">
                            <span>(${this.project.number})</span>
                            <span class="font-serif-en">${this.project.year}</span>
                        </div>
                        <h3 class="font-medium text-1.4 md:text-1.75 md:mt-16 transition-colors duration-300">
                            ${this.project.title}
                        </h3>
                        <ul class="mt-3 font-serif-en transition-colors duration-300">
                            <li>${this.project.type}</li>
                        </ul>
                        <ul class="text-gray flex md:flex-col flex-wrap gap-y-2 gap-x-3 leading-none mt-7 md:mt-auto transition-colors duration-300">
                            ${this.project.services.map(service => `<li>${service}</li>`).join('')}
                        </ul>
                    </div>
                    <picture class="order-1 md:order-2 md:w-75 overflow-hidden rounded-lg">
                        <img src="${this.project.image}" alt="${this.project.title}" class="w-full object-cover h-48 md:h-auto transition-transform duration-300 group-hover:scale-105">
                    </picture>
                </div>
            </li>
        `;
    }

    static createProjectModal(project) {
        return `
            <div id="project-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm hidden">
                <div class="bg-white max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
                    <div class="relative">
                        <!-- Close Button -->
                        <button class="project-modal-close absolute top-4 right-4 z-10 bg-black bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-2 transition-all duration-300">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>

                        <!-- Project Image -->
                        <div class="w-full h-64 md:h-96 overflow-hidden rounded-t-lg">
                            <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
                        </div>

                        <!-- Project Content -->
                        <div class="p-6 md:p-8 text-black">
                            <div class="mb-6">
                                <span class="font-serif-en text-gray text-sm">(${project.number}) / ${project.year}</span>
                            </div>

                            <h1 class="text-3xl md:text-4xl font-medium mb-6 leading-tight">
                                ${project.title}
                            </h1>

                            <div class="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 class="font-serif-en text-sm font-medium mb-3 text-gray uppercase">Project Type</h3>
                                    <p class="text-lg">${project.type}</p>
                                </div>

                                <div>
                                    <h3 class="font-serif-en text-sm font-medium mb-3 text-gray uppercase">Services</h3>
                                    <ul class="space-y-1">
                                        ${project.services.map(service => `<li>${service}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>

                            <div class="space-y-6 text-base md:text-lg leading-relaxed">
                                <p>${project.description}</p>
                                ${project.details ? `<p>${project.details}</p>` : ''}
                            </div>

                            ${project.gallery && project.gallery.length > 0 ? `
                                <div class="mt-8">
                                    <h3 class="text-xl font-medium mb-6">Project Gallery</h3>
                                    <div class="grid md:grid-cols-2 gap-4">
                                        ${project.gallery.map(img => `
                                            <img src="${img}" alt="${project.title} Gallery" class="w-full object-cover rounded-lg">
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <div class="mt-8 pt-6 border-t border-gray-200 text-center">
                                <button class="project-modal-close bg-black text-white px-8 py-3 rounded-full font-serif-en transition-all duration-300 hover:bg-gray-800">
                                    Close Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static setupModalEvents() {
        document.addEventListener('click', (e) => {
            // Open modal
            const projectCard = e.target.closest('.ts-image-link[data-project-id]');
            if (projectCard) {
                e.preventDefault();
                const projectId = projectCard.dataset.projectId;
                ProjectCard.openModal(projectId);
            }

            // Close modal
            if (e.target.closest('.project-modal-close')) {
                ProjectCard.closeModal();
            }

            // Close on backdrop click
            if (e.target.id === 'project-modal') {
                ProjectCard.closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ProjectCard.closeModal();
            }
        });
    }

    static openModal(projectId) {
        // Get project data (you'll need to store this globally or pass it)
        const projects = window.portfolioProjects || [];
        const project = projects.find(p => p.id === projectId);
        
        if (project) {
            // Remove existing modal
            const existingModal = document.getElementById('project-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create and append new modal
            document.body.insertAdjacentHTML('beforeend', ProjectCard.createProjectModal(project));
            
            // Show modal
            const modal = document.getElementById('project-modal');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    static closeModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectCard;
}
