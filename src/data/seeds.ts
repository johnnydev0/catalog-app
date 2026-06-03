import type { Product } from '@/types/product';
import imgMacbook from '@/assets/products/macbook15.jpg';
import imgFone from '@/assets/products/fone_bluetooth.webp';
import imgJaqueta from '@/assets/products/jaqueta.avif';
import imgTenis from '@/assets/products/tenis_adidas.avif';
import imgWhey from '@/assets/products/whey.jpg';
import imgEstante from '@/assets/products/estante.jpg';
import imgSerra from '@/assets/products/serra.jpg';
import imgNotebook from '@/assets/products/notebook_inspiron.jpg';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const seedProducts: Product[] = [
  {
    id: 'seed-001',
    name: 'MacBook Air M2 13"',
    description: 'Computador portátil Apple com chip M2, 8GB de memória unificada, SSD 256GB, tela Liquid Retina 13.6", bateria de até 18h. Notebook leve e silencioso, sem cooler.',
    sku: 'APPLE-MBA-M2',
    price: 849900,
    category: 'electronics',
    status: 'active',
    image: imgMacbook,
    createdAt: daysAgo(28),
    updatedAt: daysAgo(5),
  },
  {
    id: 'seed-002',
    name: 'Fone Bluetooth JBL Tune 770NC',
    description: 'Headphone over-ear com cancelamento ativo de ruído, 70h de bateria, dobrável, conexão multipoint para 2 dispositivos simultâneos.',
    sku: 'JBL-T770NC',
    price: 69900,
    category: 'electronics',
    status: 'out_of_stock',
    image: imgFone,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2),
  },
  {
    id: 'seed-003',
    name: 'Jaqueta Corta-Vento Masculina',
    description: 'Jaqueta leve com capuz removível, tecido impermeável, bolsos com zíper. Ideal para dias frios, atividades ao ar livre e tempo chuvoso.',
    sku: 'JAQ-CV-M-001',
    price: 18990,
    category: 'clothing',
    status: 'active',
    image: imgJaqueta,
    createdAt: daysAgo(18),
    updatedAt: daysAgo(18),
  },
  {
    id: 'seed-004',
    name: 'Tênis Running Adidas Ultraboost 22',
    description: 'Tênis de corrida com solado Boost para máximo retorno de energia, cabedal em malha Primeknit, palmilha Continental. Indicado para asfalto.',
    sku: 'ADI-UB22-RUN',
    price: 89990,
    category: 'clothing',
    status: 'inactive',
    image: imgTenis,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(12),
  },
  {
    id: 'seed-005',
    name: 'Whey Protein Chocolate 2kg',
    description: 'Suplemento proteico com 24g de proteína por dose, baixo teor de gordura, enriquecido com BCAA e glutamina. Sabor chocolate belga.',
    sku: 'WHEY-CHOC-2KG',
    price: 15990,
    category: 'food',
    status: 'active',
    image: imgWhey,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  },
  {
    id: 'seed-006',
    name: 'Estante Industrial para Home Office',
    description: 'Estante em madeira de pinus com estrutura em aço carbono, 5 prateleiras, capacidade de 30kg por nível. Estilo industrial retrô.',
    sku: 'EST-IND-HO-5P',
    price: 78900,
    category: 'furniture',
    status: 'active',
    image: imgEstante,
    createdAt: daysAgo(22),
    updatedAt: daysAgo(22),
  },
  {
    id: 'seed-007',
    name: 'Serra Circular 7¼" 1800W Bosch',
    description: 'Serra circular com disco de 7¼ polegadas, motor 1800W, plataforma em alumínio, guia paralela e proteção retrátil. Corte até 63mm em 90°.',
    sku: 'BOSCH-SC-1800',
    price: 64900,
    category: 'tools',
    status: 'active',
    image: imgSerra,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(7),
  },
  {
    id: 'seed-008',
    name: 'Notebook Dell Inspiron 15',
    description: 'Notebook com processador Intel Core i5 12ª geração, 8GB RAM, SSD 512GB, tela 15.6" Full HD, Windows 11. Ideal para uso doméstico e trabalho.',
    sku: 'DELL-INS15-I5',
    price: 349900,
    category: 'electronics',
    status: 'out_of_stock',
    image: imgNotebook,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
  },
];
