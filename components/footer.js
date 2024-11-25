export function createFooter() {
    return `
    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between py-3">
                <div class="text-sm text-gray-500">
                    © 2024 GanttChart Maker. All rights reserved.
                </div>
                <div class="flex items-center space-x-6">
                    <a href="https://github.com/rzki-lil" 
                       target="_blank"
                       class="text-gray-500 hover:text-gray-700 transition-colors">
                        <i class="fab fa-github text-xl"></i>
                    </a>
                    <a href="https://instagram.com/ikkki407" 
                       target="_blank"
                       class="text-gray-500 hover:text-pink-500 transition-colors">
                        <i class="fab fa-instagram text-xl"></i>
                    </a>
                    <a href="https://tiktok.com/@mutaks" 
                       target="_blank"
                       class="text-gray-500 hover:text-black transition-colors">
                        <i class="fab fa-tiktok text-xl"></i>
                    </a>
                    <a href="https://wa.me/6281382885716" 
                       target="_blank"
                       class="text-gray-500 hover:text-green-500 transition-colors">
                        <i class="fab fa-whatsapp text-xl"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="h-16"></div>
    `;
} 