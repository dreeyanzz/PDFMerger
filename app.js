// Application state
let pdfFiles = [];
let draggedIndex = null;

// DOM elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const filesSection = document.getElementById('filesSection');
const filesList = document.getElementById('filesList');
const fileCount = document.getElementById('fileCount');
const clearAllBtn = document.getElementById('clearAll');
const actionSection = document.getElementById('actionSection');
const mergeBtn = document.getElementById('mergeBtn');
const mergedFilenameInput = document.getElementById('mergedFilename');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Initialize
function init() {
    // Drop zone events
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // Clear all button
    clearAllBtn.addEventListener('click', clearAllFiles);
    
    // Merge button
    mergeBtn.addEventListener('click', mergePDFs);
}

// Handle file selection
function handleFiles(files) {
    const validFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (validFiles.length === 0) {
        alert('Please select PDF files only!');
        return;
    }
    
    validFiles.forEach(file => {
        // Check if file already exists
        if (!pdfFiles.find(f => f.name === file.name)) {
            pdfFiles.push(file);
        }
    });
    
    renderFilesList();
    updateUI();
}

// Render files list
function renderFilesList() {
    filesList.innerHTML = '';
    
    pdfFiles.forEach((file, index) => {
        const fileItem = createFileItem(file, index);
        filesList.appendChild(fileItem);
    });
    
    fileCount.textContent = pdfFiles.length;
}

// Create file item element
function createFileItem(file, index) {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.draggable = true;
    div.dataset.index = index;
    
    // Drag events
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);
    div.addEventListener('dragleave', handleDragLeave);
    
    const fileSize = formatFileSize(file.size);
    
    div.innerHTML = `
        <svg class="drag-handle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
        </svg>
        <div class="file-icon">PDF</div>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${fileSize}</div>
        </div>
        <div class="file-number">${index + 1}</div>
        <button class="file-remove" onclick="removeFile(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    `;
    
    return div;
}

// Drag and drop handlers
function handleDragStart(e) {
    draggedIndex = parseInt(e.target.dataset.index);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const target = e.target.closest('.file-item');
    if (target && !target.classList.contains('dragging')) {
        target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const target = e.target.closest('.file-item');
    if (target) {
        target.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    
    const target = e.target.closest('.file-item');
    if (!target) return;
    
    const dropIndex = parseInt(target.dataset.index);
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
        // Reorder the array
        const draggedFile = pdfFiles[draggedIndex];
        pdfFiles.splice(draggedIndex, 1);
        pdfFiles.splice(dropIndex, 0, draggedFile);
        
        renderFilesList();
    }
    
    target.classList.remove('drag-over');
}

// Remove file
function removeFile(index) {
    pdfFiles.splice(index, 1);
    renderFilesList();
    updateUI();
}

// Clear all files
function clearAllFiles() {
    if (confirm('Are you sure you want to remove all files?')) {
        pdfFiles = [];
        renderFilesList();
        updateUI();
    }
}

// Update UI visibility
function updateUI() {
    if (pdfFiles.length > 0) {
        filesSection.style.display = 'block';
        actionSection.style.display = pdfFiles.length >= 2 ? 'block' : 'none';
    } else {
        filesSection.style.display = 'none';
        actionSection.style.display = 'none';
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Merge PDFs
async function mergePDFs() {
    if (pdfFiles.length < 2) {
        alert('Please add at least 2 PDF files to merge!');
        return;
    }
    
    try {
        // Show progress
        actionSection.style.display = 'none';
        progressSection.style.display = 'block';
        updateProgress(0, 'Loading PDF library...');
        
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();
        
        // Process each PDF
        for (let i = 0; i < pdfFiles.length; i++) {
            const file = pdfFiles[i];
            updateProgress((i / pdfFiles.length) * 90, `Processing ${file.name}...`);
            
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }
        
        updateProgress(95, 'Generating merged PDF...');
        
        // Save the merged PDF
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        
        // Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = mergedFilenameInput.value.trim() || 'merged';
        link.href = url;
        link.download = `${filename}.pdf`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        updateProgress(100, 'Done! PDF merged successfully!');
        
        setTimeout(() => {
            progressSection.style.display = 'none';
            actionSection.style.display = 'block';
        }, 2000);
        
    } catch (error) {
        console.error('Error merging PDFs:', error);
        alert('Error merging PDFs: ' + error.message);
        progressSection.style.display = 'none';
        actionSection.style.display = 'block';
    }
}

// Update progress
function updateProgress(percent, message) {
    progressFill.style.width = percent + '%';
    progressText.textContent = message;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);
