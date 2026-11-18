import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

export class CatalogModel {
  static _cachedServices = null;
  static _cachedCategories = null;

  static getServices() {
    if (!this._cachedServices) {
      if (fs.existsSync(SERVICES_FILE)) {
        this._cachedServices = JSON.parse(fs.readFileSync(SERVICES_FILE, 'utf-8'));
      } else {
        this._cachedServices = [];
      }
    }
    return this._cachedServices;
  }

  static getCategories() {
    if (!this._cachedCategories) {
      if (fs.existsSync(CATEGORIES_FILE)) {
        this._cachedCategories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf-8'));
      } else {
        this._cachedCategories = [];
      }
    }
    return this._cachedCategories;
  }

  static reloadData() {
    this._cachedServices = null;
    this._cachedCategories = null;
    return {
      services: this.getServices().length,
      categories: this.getCategories().length
    };
  }

  static findServices({ search = '', category = '', pricingBasis = '' } = {}) {
    let list = this.getServices();

    if (category && category !== 'all') {
      const catLower = category.toLowerCase().trim();
      // Match by exact category name or slug
      const categories = this.getCategories();
      const matchedCat = categories.find(
        (c) => c.slug.toLowerCase() === catLower || c.name.toLowerCase() === catLower
      );
      const targetName = matchedCat ? matchedCat.name.toLowerCase() : catLower;

      list = list.filter((s) => s.category.toLowerCase() === targetName);
    }

    if (pricingBasis && pricingBasis !== 'all') {
      const pbLower = pricingBasis.toLowerCase().trim();
      list = list.filter((s) => (s.pricingBasis || '').toLowerCase().includes(pbLower));
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          (s.scope && s.scope.toLowerCase().includes(q))
      );
    }

    return list;
  }

  static findServiceById(id) {
    if (!id) return null;
    const services = this.getServices();
    return services.find((s) => s.id.toUpperCase() === id.trim().toUpperCase()) || null;
  }

  static findCategoryBySlugOrName(slugOrName) {
    if (!slugOrName) return null;
    const target = slugOrName.toLowerCase().trim();
    const categories = this.getCategories();
    return categories.find(
      (c) => c.slug.toLowerCase() === target || c.name.toLowerCase() === target
    ) || null;
  }

  static getPopularServices() {
    // Top 8 representative services across main Jaipur categories
    const popularIds = [
      'CC-001', // Laptop Check-up & fault diagnosis
      'CC-006', // Laptop Screen replacement
      'CC-032', // AC Split AC basic service
      'CC-033', // AC Split AC deep cleaning
      'CC-047', // Refrigerator Preventive cleaning
      'CC-060', // Washing Machine Front-load deep cleaning
      'CC-092', // CCTV Camera installation
      'CC-103'  // Networking Wi-Fi troubleshooting
    ];
    const services = this.getServices();
    return popularIds
      .map((id) => services.find((s) => s.id === id))
      .filter(Boolean);
  }
}

export default CatalogModel;
