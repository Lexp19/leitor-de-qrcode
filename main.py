import cv2
from pyzbar.pyzbar import decode

def read_qr_code(image_path):
    # Carrega a imagem
    image = cv2.imread(image_path)

    # Decodifica o QR code
    decoded_objects = decode(image)

    # Exibe o resultado
    for obj in decoded_objects:
        print('Data:', obj.data.decode('utf-8'))

# Caminho da imagem contendo o QR code
image_path = 'caminho_para_imagem.png'

# Chama a função para ler o QR code
read_qr_code(image_path)
