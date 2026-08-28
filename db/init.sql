CREATE DATABASE IF NOT EXISTS quicknexttech;
USE quicknexttech;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    unidades_vendidas INT NOT NULL DEFAULT 0
);

INSERT INTO productos (nombre, categoria, precio, stock, unidades_vendidas) VALUES
('Camiseta Básica Blanca', 'Camisetas', 15.99, 150, 320),
('Camiseta Básica Negra', 'Camisetas', 15.99, 140, 280),
('Polo de Algodón Azul', 'Camisetas', 22.50, 80, 115),
('Pantalón Vaquero Clásico', 'Pantalones', 45.00, 100, 450),
('Pantalón Chino Beige', 'Pantalones', 38.00, 75, 90),
('Falda Midi Estampada', 'Faldas', 28.99, 40, 35),
('Vestido de Verano Floral', 'Vestidos', 35.50, 30, 60),
('Vestido de Noche Elegante', 'Vestidos', 89.00, 15, 12),
('Chaqueta de Cuero Sintético', 'Chaquetas', 75.00, 25, 45),
('Abrigo de Lana Invierno', 'Chaquetas', 120.00, 20, 80),
('Sudadera con Capucha Gris', 'Sudaderas', 29.99, 90, 210),
('Sudadera sin Capucha Negra', 'Sudaderas', 25.99, 85, 150),
('Jersey de Punto Cuello V', 'Jerseys', 34.50, 50, 65),
('Camisa de Vestir Blanca', 'Camisas', 39.99, 60, 140),
('Camisa de Cuadros Franela', 'Camisas', 32.00, 70, 110),
('Pantalón Corto Deportivo', 'Deportivo', 19.99, 120, 300),
('Leggings de Yoga Negros', 'Deportivo', 24.50, 110, 250),
('Top Deportivo Transpirable', 'Deportivo', 18.00, 95, 180),
('Zapatillas Casual Blancas', 'Calzado', 59.99, 45, 190),
('Botas de Cuero Marrón', 'Calzado', 95.00, 30, 40),
('Zapatos de Vestir Oxford', 'Calzado', 85.00, 25, 35),
('Cinturón de Cuero Negro', 'Accesorios', 14.50, 150, 220),
('Gafas de Sol Estilo Aviador', 'Accesorios', 25.00, 60, 130),
('Gorra de Béisbol Clásica', 'Accesorios', 12.99, 100, 175),
('Bufanda de Lana a Cuadros', 'Accesorios', 18.50, 40, 85),
('Guantes Térmicos de Invierno', 'Accesorios', 22.00, 45, 90),
('Calcetines de Algodón (Pack 3)', 'Ropa Interior', 9.99, 200, 500),
('Bóxers de Algodón (Pack 3)', 'Ropa Interior', 15.50, 180, 420),
('Pijama de Algodón Largo', 'Ropa de Dormir', 29.99, 50, 75),
('Traje de Baño Enterizo', 'Baño', 35.00, 40, 110),
('Bañador Tipo Short Azul', 'Baño', 25.00, 65, 145),
('Bolso Tote de Lona', 'Accesorios', 22.50, 55, 95);