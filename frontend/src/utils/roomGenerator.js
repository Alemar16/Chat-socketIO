export const generateRoomId = () => {
    const words = [
        "panda", "tigre", "leon", "aguila", "delfin", "lobo", "oso", "zorro", 
        "gato", "perro", "sol", "luna", "rio", "mar", "nube", "cielo", "estrella",
        "montaña", "bosque", "playa", "fuego", "agua", "tierra", "aire", "rojo",
        "azul", "verde", "amarillo", "blanco", "negro", "mesa", "silla", "libro",
        "lapiz", "papel", "reloj", "llave", "puerta", "casa", "jardin", "flor",
        "arbol", "fruta", "pan", "leche", "cafe", "te", "amigo", "feliz"
    ];

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number (1000-9999)

    return `${randomWord}-${randomNumber}`;
};
