const uuidArray = [
    { uuid: '7f747c57-6f7a-4e2a-baa3-1b15d4be4163', utilizado: false },
    { uuid: 'a24b07a6-eb51-4f61-9dc7-63b0b48d8a35', utilizado: false },
    { uuid: '1d64a6cf-2ca4-4e5f-9b83-10f54e3ebf9a', utilizado: false },
    { uuid: 'c44db617-9699-42f8-9b71-c66f0c52b2e9', utilizado: false },
    { uuid: '8c9d60dd-0a18-47c6-96a1-1c284c6a2a5c', utilizado: false },
    { uuid: '49f8fda3-0f36-4319-8b9a-d4f7545718fc', utilizado: false },
    { uuid: '92f47c51-9e3a-4d0f-8bc5-89c8ddca18f5', utilizado: false },
    { uuid: '5a72b7a9-7382-4924-8d29-1629350c3fc5', utilizado: false },
    { uuid: 'ef9f64a7-89c5-4a79-9342-e696bf09b31f', utilizado: false },
    { uuid: '2d5748c9-c956-4d7e-9808-eb545f26be14', utilizado: false }
];

let qrCodeReader = null;
const uuidInput = document.getElementById('uuidInput');
const mensagemElement = document.getElementById('mensagem');
const verificarBtn = document.getElementById('verificarBtn');
const cameraBtn = document.getElementById('cameraBtn');
const gerarRelatorioBtn = document.getElementById('gerarRelatorioBtn');
const uploadInput = document.getElementById('uploadInput');
let isCameraOpen = false;

function toggleCamera() {
    if (!isCameraOpen) {
        if (!qrCodeReader) {
            qrCodeReader = document.createElement('video');
            document.getElementById('qr-reader').appendChild(qrCodeReader);
        }

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                qrCodeReader.srcObject = stream;
                qrCodeReader.play().catch(error => console.error(error));
                lerQRCode();
                isCameraOpen = true;
                cameraBtn.innerHTML = '<i class="fas fa-camera-slash"></i> Fechar Câmera';
            })
            .catch(err => console.error(err));
    } else {
        if (qrCodeReader) {
            const stream = qrCodeReader.srcObject;
            const tracks = stream.getTracks();

            tracks.forEach(track => track.stop());
            qrCodeReader.srcObject = null;
            qrCodeReader.remove();
            qrCodeReader = null;
            isCameraOpen = false;
            cameraBtn.innerHTML = '<i class="fas fa-camera"></i> Abrir Câmera';
        }
    }
}

function verificarUUID(uuid) {
    const index = uuidArray.findIndex(item => item.uuid === uuid);

    if (index === -1) {
        mensagemElement.innerHTML = 'NÃO ENCONTRADO';
    } else if (uuidArray[index].utilizado) {
        mensagemElement.innerHTML = 'INGRESSO JÁ UTILIZADO';
    } else {
        uuidArray[index].utilizado = true;
        mensagemElement.innerHTML = 'ACESSO LIBERADO';
    }

    uuidInput.value = '';
}

function lerQRCode() {
    if (isCameraOpen && qrCodeReader && qrCodeReader.videoWidth > 0 && qrCodeReader.videoHeight > 0) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = qrCodeReader.videoWidth;
        canvas.height = qrCodeReader.videoHeight;
        context.drawImage(qrCodeReader, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            verificarUUID(code.data);
        }
    }

    requestAnimationFrame(lerQRCode);
}

uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                verificarUUID(code.data);
            } else {
                mensagemElement.innerHTML = 'Nenhum QR Code encontrado na imagem.';
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

cameraBtn.addEventListener('click', toggleCamera);
verificarBtn.addEventListener('click', () => verificarUUID(uuidInput.value));