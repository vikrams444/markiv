document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('image-input');
    const compressionLevelInput = document.getElementById('compression-level');
    const compressButton = document.getElementById('compress-button');
    const originalImageDisplay = document.getElementById('original-image');
    const compressedImageDisplay = document.getElementById('compressed-image-display');

    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImageDisplay.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    compressButton.addEventListener('click', () => {
        const file = imageInput.files[0];
        const compressionLevel = parseFloat(compressionLevelInput.value);

        if (file) {
            // In a real implementation, you would send the image and compression level to a server
            // for processing. Here, we'll simulate compression by simply displaying the original image.
            // const formData = new FormData();
            // formData.append('image', file);
            // formData.append('compressionLevel', compressionLevel);

            // fetch('/compress', {
            //     method: 'POST',
            //     body: formData
            // })
            // .then(response => response.blob())
            // .then(blob => {
            //     const imageUrl = URL.createObjectURL(blob);
            //     compressedImageDisplay.src = imageUrl;
            // });

            // For this example, just display the original image as the "compressed" image
            compressedImageDisplay.src = originalImageDisplay.src;
            alert('Compression is simulated. Implement server-side compression for actual results.');
        } else {
            alert('Please select an image.');
        }
    });
});
