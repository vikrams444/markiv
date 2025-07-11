document.addEventListener('DOMContentLoaded', function() {
            // Set current year in footer
            document.getElementById('currentYear').textContent = new Date().getFullYear();
            
            // DOM elements
            const fileInput = document.getElementById('fileInput');
            const browseBtn = document.getElementById('browseBtn');
            const dropArea = document.getElementById('dropArea');
            const compressBtn = document.getElementById('compressBtn');
            const formatSelect = document.getElementById('formatSelect');
            const qualityRange = document.getElementById('qualityRange');
            const qualityValue = document.getElementById('qualityValue');
            const resizeToggle = document.getElementById('resizeToggle');
            const widthControl = document.getElementById('widthControl');
            const heightControl = document.getElementById('heightControl');
            const loadingIndicator = document.getElementById('loadingIndicator');
            const resultsSection = document.getElementById('resultsSection');
            const originalPreview = document.getElementById('originalPreview');
            const compressedPreview = document.getElementById('compressedPreview');
            const originalSize = document.getElementById('originalSize');
            const compressedSize = document.getElementById('compressedSize');
            const originalDimensions = document.getElementById('originalDimensions');
            const compressedDimensions = document.getElementById('compressedDimensions');
            const compressionRatio = document.getElementById('compressionRatio');
            const savingsInfo = document.getElementById('savingsInfo');
            const downloadBtn = document.getElementById('downloadBtn');
            
            let originalFile = null;
            let compressedFile = null;
            
            // Event listeners
            browseBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', handleFileSelect);
            dropArea.addEventListener('dragover', handleDragOver);
            dropArea.addEventListener('dragleave', handleDragLeave);
            dropArea.addEventListener('drop', handleDrop);
            qualityRange.addEventListener('input', updateQualityValue);
            resizeToggle.addEventListener('change', toggleResizeControls);
            compressBtn.addEventListener('click', compressImage);
            
            // Functions
            function handleFileSelect(e) {
                const files = e.target.files;
                if (files.length > 0) {
                    processFile(files[0]);
                }
            }
            
            function handleDragOver(e) {
                e.preventDefault();
                e.stopPropagation();
                dropArea.classList.add('active');
            }
            
            function handleDragLeave(e) {
                e.preventDefault();
                e.stopPropagation();
                dropArea.classList.remove('active');
            }
            
            function handleDrop(e) {
                e.preventDefault();
                e.stopPropagation();
                dropArea.classList.remove('active');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    processFile(files[0]);
                }
            }
            
            function processFile(file) {
                if (!file.type.match('image.*')) {
                    alert('Please select an image file (JPEG, PNG, etc.)');
                    return;
                }
                
                originalFile = file;
                compressBtn.disabled = false;
                
                // Display original file info
                const reader = new FileReader();
                reader.onload = function(e) {
                    originalPreview.src = e.target.result;
                    
                    // Get image dimensions
                    const img = new Image();
                    img.onload = function() {
                        originalDimensions.textContent = `Dimensions: ${img.width} × ${img.height} px`;
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
                
                originalSize.textContent = `Size: ${formatFileSize(file.size)}`;
            }
            
            function updateQualityValue() {
                qualityValue.textContent = qualityRange.value;
            }
            
            function toggleResizeControls() {
                const value = resizeToggle.value;
                widthControl.style.display = value === 'width' || value === 'both' ? 'block' : 'none';
                heightControl.style.display = value === 'height' || value === 'both' ? 'block' : 'none';
            }
            
            async function compressImage() {
                if (!originalFile) return;

                loadingIndicator.style.display = 'block';
                resultsSection.style.display = 'none';

                let outputFormat = formatSelect.value;
                if (outputFormat === 'auto') {
                    const originalType = originalFile.type.split('/')[1];
                    const supportedOutputTypes = ['jpeg', 'png', 'webp'];
                    if (supportedOutputTypes.includes(originalType)) {
                        outputFormat = originalType;
                    } else {
                        outputFormat = 'png'; // Default to PNG for unsupported types
                    }
                }

                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: parseInt(qualityRange.value) / 100,
                    fileType: `image/${outputFormat}`
                };

                const resizeType = resizeToggle.value;
                if (resizeType === 'width') {
                    options.maxWidthOrHeight = parseInt(document.getElementById('resizeWidth').value) || 1920;
                } else if (resizeType === 'height') {
                    options.maxWidthOrHeight = parseInt(document.getElementById('resizeHeight').value) || 1920;
                } else if (resizeType === 'both') {
                    options.maxWidthOrHeight = Math.max(
                        parseInt(document.getElementById('resizeWidth').value) || 0,
                        parseInt(document.getElementById('resizeHeight').value) || 0
                    ) || 1920;
                }

                try {
                    compressedFile = await imageCompression(originalFile, options);

                    compressedPreview.src = URL.createObjectURL(compressedFile);
                    compressedSize.textContent = `Size: ${formatFileSize(compressedFile.size)}`;
                    
                    const img = new Image();
                    img.onload = function() {
                        compressedDimensions.textContent = `Dimensions: ${img.width} × ${img.height} px`;
                    };
                    img.src = URL.createObjectURL(compressedFile);

                    const reduction = ((originalFile.size - compressedFile.size) / originalFile.size * 100).toFixed(1);
                    compressionRatio.textContent = `Reduction: ${reduction}%`;
                    savingsInfo.textContent = `You saved ${formatFileSize(originalFile.size - compressedFile.size)} (${reduction}% reduction)!`;

                    const fileName = originalFile.name.replace(/\.[^/.]+$/, '');
                    downloadBtn.href = URL.createObjectURL(compressedFile);
                    downloadBtn.download = `${fileName}_compressed.${outputFormat}`;

                } catch (error) {
                    console.error(error);
                    alert('An error occurred during compression.');
                } finally {
                    loadingIndicator.style.display = 'none';
                    resultsSection.style.display = 'block';
                }
            }
            
            function formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }
        });
